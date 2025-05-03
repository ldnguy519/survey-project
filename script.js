document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default submission

    // Capture selected values
    const selectedValues = {};
    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        selectedValues[checkbox.name] = true;
    });

    // Generate shareable link with cleaner formatting
    const encodedData = encodeURIComponent(JSON.stringify(selectedValues));
    const baseUrl = window.location.href.split('?')[0];
    const shareableLink = `${baseUrl}?data=${encodedData}`;

    // Display confirmation message with copy and forward options
    document.body.innerHTML = `
        <div style="text-align: center; font-family: Arial, sans-serif;">
            <h2>Survey submitted!</h2>
            <p>Share this link:</p>
            <input type="text" id="shareable-link" value="${shareableLink}" readonly style="width: 80%; padding: 10px; font-size: 16px;">
            <button onclick="copyLink()" style="padding: 10px; margin-top: 10px;">Copy Link</button>
            <button onclick="sendSMS('${shareableLink}')" style="padding: 10px; margin-top: 10px;">Forward via SMS</button>
            <button onclick="reloadSurvey()" style="padding: 10px; margin-top: 10px;">Start New Survey</button>
        </div>
    `;
});

// Function to copy link to clipboard
function copyLink() {
    const linkInput = document.getElementById("shareable-link");
    linkInput.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
}

// Function to send link via SMS
function sendSMS(link) {
    const phoneNumber = prompt("Enter phone number to send SMS:");
    if (phoneNumber) {
        window.open(`sms:${phoneNumber}?body=Survey Link: ${link}`, "_self");
    }
}

// Function to restart survey after submission
function reloadSurvey() {
    window.location.href = window.location.href.split('?')[0];
}

// Check if we are comparing selections
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("data")) {
        const previousSelections = JSON.parse(decodeURIComponent(params.get("data")));
        compareSelections(previousSelections);
    }
};

// Function to compare selections and display summary grouped by section
function compareSelections(previousSelections) {
    let matchSummary = "<h3>Matched Selections</h3>";

    const sections = {};

    // Group matched selections by section
    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        if (previousSelections[checkbox.name]) {
            const sectionTitle = checkbox.closest(".section").querySelector(".section-title").textContent;
            if (!sections[sectionTitle]) {
                sections[sectionTitle] = [];
            }
            sections[sectionTitle].push(checkbox.parentElement.textContent.trim());
        }
    });

    // Generate summary HTML
    for (const section in sections) {
        matchSummary += `<h4>${section}</h4><ul>`;
        sections[section].forEach(item => {
            matchSummary += `<li>${item}</li>`;
        });
        matchSummary += "</ul>";
    }

    // Display summary instead of modifying individual checkboxes
    document.getElementById("survey-form").innerHTML = matchSummary;
}

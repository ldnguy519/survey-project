document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default submission

    // Capture selected values
    const selectedValues = {};
    const gender = document.querySelector('input[name="gender"]:checked').value;
    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        selectedValues[checkbox.name] = true;
    });

    // Store submission based on gender
    localStorage.setItem(gender, JSON.stringify(selectedValues));

    // Check if both gender surveys are completed
    if (localStorage.getItem("male") && localStorage.getItem("female")) {
        compareSelections();
    } else {
        // Generate shareable link
        const encodedData = encodeURIComponent(JSON.stringify(selectedValues));
        const baseUrl = window.location.href.split('?')[0];
        const shareableLink = `${baseUrl}?data=${encodedData}`;

        // Display confirmation message with copy and forward options
        document.body.innerHTML = `
            <div style="text-align: center; font-family: Arial, sans-serif;">
                <h2>Survey submitted!</h2>
                <p>Share this link for the second survey:</p>
                <input type="text" id="shareable-link" value="${shareableLink}" readonly style="width: 80%; padding: 10px; font-size: 16px;">
                <button onclick="copyLink()" style="padding: 10px; margin-top: 10px;">Copy Link</button>
                <button onclick="sendSMS('${shareableLink}')" style="padding: 10px; margin-top: 10px;">Forward via SMS</button>
                <button onclick="reloadSurvey()" style="padding: 10px; margin-top: 10px;">Start New Survey</button>
            </div>
        `;
    }
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

// Function to compare submissions after both gender surveys are completed
function compareSelections() {
    let maleSelections = JSON.parse(localStorage.getItem("male"));
    let femaleSelections = JSON.parse(localStorage.getItem("female"));

    let matchSummary = "<h3>Comparison of Male vs Female Responses</h3>";

    const sections = {};

    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        const sectionTitle = checkbox.closest(".section").querySelector(".section-title").textContent;
        if (!sections[sectionTitle]) {
            sections[sectionTitle] = { male: [], female: [] };
        }

        if (maleSelections[checkbox.name]) {
            sections[sectionTitle].male.push(checkbox.parentElement.textContent.trim());
        }

        if (femaleSelections[checkbox.name]) {
            sections[sectionTitle].female.push(checkbox.parentElement.textContent.trim());
        }
    });

    // Generate structured summary
    for (const section in sections) {
        matchSummary += `<h4>${section}</h4>`;
        matchSummary += "<strong>Male Selected:</strong><ul>";
        sections[section].male.forEach(item => {
            matchSummary += `<li>${item}</li>`;
        });
        matchSummary += "</ul><strong>Female Selected:</strong><ul>";
        sections[section].female.forEach(item => {
            matchSummary += `<li>${item}</li>`;
        });
        matchSummary += "</ul>";
    }

    // Display comparison results
    document.body.innerHTML = matchSummary;
}

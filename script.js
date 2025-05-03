document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default submission

    // Capture selected values
    const selectedValues = {};
    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        selectedValues[checkbox.name] = true;
    });

    // Generate shareable link
    const encodedData = encodeURIComponent(JSON.stringify(selectedValues));
    const shareableLink = `${window.location.href.split('?')[0]}?data=${encodedData}`;
    
    alert(`Survey submitted! Share this link: ${shareableLink}`);
});

// Check if we are comparing selections
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("data")) {
        const previousSelections = JSON.parse(decodeURIComponent(params.get("data")));
        compareSelections(previousSelections);
    }
};

// Function to compare selections and display summary
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

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
    let matchSummary = "<h3>Matched Selections</h3><ul>";

    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        if (previousSelections[checkbox.name]) {
            matchSummary += `<li>${checkbox.parentElement.textContent.trim()}</li>`;
        }
    });

    matchSummary += "</ul>";

    // Display summary instead of modifying individual checkboxes
    document.getElementById("survey-form").innerHTML = matchSummary;
}

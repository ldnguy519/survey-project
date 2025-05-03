document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default submission

    // Capture selected values
    const selectedValues = {};
    const gender = document.querySelector('input[name="gender"]:checked').value;
    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        selectedValues[checkbox.name] = true;
    });

    // Store survey data based on gender
    localStorage.setItem(gender, JSON.stringify(selectedValues));

    // Check if the second survey needs to start
    if (!localStorage.getItem("male") || !localStorage.getItem("female")) {
        let oppositeGender = gender === "male" ? "female" : "male";
        startSecondSurvey(oppositeGender);
    } else {
        // Both surveys are completed, proceed to comparison
        compareSelections();
    }
});

// Function to start the second survey immediately
function startSecondSurvey(gender) {
    localStorage.setItem("currentSurvey", gender);
    window.location.href = window.location.href.split('?')[0]; // Reload for second survey
}

// Function to compare Male vs Female responses after both surveys are complete
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

    // Display comparison results with a "Go Back to Start" button
    document.body.innerHTML = `
        ${matchSummary}
        <button onclick="resetSurvey()" style="padding: 10px; margin-top: 20px;">Go Back to Start</button>
    `;
}

// Function to reset survey and clear all stored data
function resetSurvey() {
    localStorage.clear();
    window.location.href = window.location.href.split('?')[0]; // Reload for a fresh start
}

// Clear storage when the browser is closed
window.addEventListener("beforeunload", function() {
    localStorage.clear();
});

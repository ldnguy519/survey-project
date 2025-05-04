document.addEventListener("DOMContentLoaded", function () {
    // Hide all sub-options initially
    document.querySelectorAll(".sub-options").forEach(div => {
        div.style.display = "none";
    });
});

function toggleSubOptions(subOptionId) {
    let subOptionsDiv = document.getElementById(subOptionId);
    let button = document.querySelector(`button[onclick="toggleSubOptions('${subOptionId}')"]`);

    if (subOptionsDiv.style.display === "none") {
        subOptionsDiv.style.display = "block";
        button.textContent = "▼ " + button.textContent.slice(2);
    } else {
        subOptionsDiv.style.display = "none";
        button.textContent = "▶ " + button.textContent.slice(2);
    }
}

document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default submission

    let requiredOptions = ["sec1_A", "sec1_B", "sec2_J", "sec2_K", "sec3_N", "sec3_O"];
    let allValid = true;

    requiredOptions.forEach(optionId => {
        let checkboxes = document.querySelectorAll(`input[data-parent='${optionId}']`);
        let isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

        let optionElement = document.getElementById(optionId).parentElement;

        if (!isChecked) {
            allValid = false;
            optionElement.style.color = "red"; // Highlight missing selection
        } else {
            optionElement.style.color = "black"; // Reset highlight
        }
    });

    if (!allValid) {
        alert("Please select at least one option under each option.");
        return; // **Explicitly stop further execution**
    }

    // Continue with form submission logic only if validation passes
    let participant = localStorage.getItem("currentParticipant") || "male";
    let selectedValues = {};

    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        let parent = checkbox.dataset.parent || checkbox.id;

        if (!selectedValues[parent]) {
            selectedValues[parent] = [];
        }
        
        selectedValues[parent].push(checkbox.id);
    });

    localStorage.setItem(participant, JSON.stringify(selectedValues));

    if (participant === "male") {
        startSecondSurvey();
    } else {
        compareSelections();
    }
});

    if (!allValid) {
        alert("Please select at least one option under each option");
        return;
    }

    // Save selections in localStorage
    let participant = localStorage.getItem("currentParticipant") || "male";
    let selectedValues = {};

    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        let parent = checkbox.dataset.parent || checkbox.id;

        if (!selectedValues[parent]) {
            selectedValues[parent] = [];
        }
        
        selectedValues[parent].push(checkbox.id);
    });

    localStorage.setItem(participant, JSON.stringify(selectedValues));

    if (participant === "male") {
        startSecondSurvey();
    } else {
        compareSelections();
    }
});

function startSecondSurvey() {
    alert("Male survey completed! Now starting the female survey.");
    localStorage.setItem("currentParticipant", "female");
    location.reload();
}

function compareSelections() {
    let maleSelections = JSON.parse(localStorage.getItem("male")) || {};
    let femaleSelections = JSON.parse(localStorage.getItem("female")) || {};

    let matchSummary = "<h3>Matching Responses</h3>";

    for (let category in maleSelections) {
        if (femaleSelections[category]) {
            let matchedSubOptions = maleSelections[category].filter(option => femaleSelections[category].includes(option));

            if (matchedSubOptions.length > 0) {
                matchSummary += `<h4>${category}</h4><ul>`;
                matchedSubOptions.forEach(item => {
                    matchSummary += `<li>${item}</li>`;
                });
                matchSummary += "</ul>";
            }
        }
    }

    document.body.innerHTML = `${matchSummary}<button onclick="resetSurvey()" style="padding: 10px; margin-top: 20px;">Restart Survey</button>`;
}

function resetSurvey() {
    localStorage.clear();
    location.reload();
}

window.addEventListener("load", function() {
    if (!localStorage.getItem("currentParticipant")) {
        localStorage.setItem("currentParticipant", "male"); // Ensure default is male
    }
    
    const currentParticipant = localStorage.getItem("currentParticipant");
    document.getElementById("survey-title").textContent = `Survey for ${currentParticipant.charAt(0).toUpperCase() + currentParticipant.slice(1)} Participant`;
});

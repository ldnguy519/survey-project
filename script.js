document.addEventListener("DOMContentLoaded", function () {
    // Hide all sub-options initially
    document.querySelectorAll(".sub-options").forEach(div => {
        div.style.display = "none";
    });
});

function toggleSubOptions(mainOptionId) {
    let subOptionsDiv = document.getElementById(`sub_${mainOptionId}`);
    let mainCheckbox = document.getElementById(mainOptionId);

    if (mainCheckbox.checked) {
        subOptionsDiv.style.display = "block";
    } else {
        subOptionsDiv.style.display = "none";
        // Uncheck all sub-options when hiding
        subOptionsDiv.querySelectorAll("input[type='checkbox']").forEach(subCheckbox => {
            subCheckbox.checked = false;
        });
    }
}

document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault();

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
    const currentParticipant = localStorage.getItem("currentParticipant") || "male";
    document.getElementById("survey-title").textContent = `Survey for ${currentParticipant.charAt(0).toUpperCase() + currentParticipant.slice(1)} Participant`;
});

window.addEventListener("load", function() {
    const currentParticipant = localStorage.getItem("currentParticipant") || "male";
    document.getElementById("survey-title").textContent = `Survey for ${currentParticipant.charAt(0).toUpperCase() + currentParticipant.slice(1)} Participant`;
});

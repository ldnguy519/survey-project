document.addEventListener("DOMContentLoaded", function () {
    // Hide all sub-options initially
    document.querySelectorAll(".sub-options").forEach(div => {
        div.style.display = "none";
    });
});

function toggleSubOptions(subOptionId) {
    let subOptionsDiv = document.getElementById(subOptionId);
    let button = document.querySelector(`button[onclick="toggleSubOptions('${subOptionId}')"]`);

    if (subOptionsDiv.style.display === "none" || subOptionsDiv.style.display === "") {
        subOptionsDiv.style.display = "block";
        button.textContent = "▼ " + button.textContent.replace(/▶ /, "");
    } else {
        subOptionsDiv.style.display = "none";
        button.textContent = "▶ " + button.textContent.replace(/▼ /, "");
    }
}

document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let allSubOptions = document.querySelectorAll(".sub-options");
    let isValid = true;
    let errorMessage = "Please select at least one option in each section before submitting.";

    allSubOptions.forEach(subOptionsDiv => {
        let checkboxes = subOptionsDiv.querySelectorAll("input[type='checkbox']");
        let isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

        if (!isChecked) {
            isValid = false;
            subOptionsDiv.classList.add("warning"); // Highlight missing selection
        } else {
            subOptionsDiv.classList.remove("warning"); // Remove highlight if fixed
        }
    });

    if (!isValid) {
        alert(errorMessage);
        return;
    }

    let participant = localStorage.getItem("currentParticipant") || "Person 1";
    let selectedValues = {};

    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        let parent = checkbox.dataset.parent || checkbox.id;

        if (!selectedValues[parent]) {
            selectedValues[parent] = [];
        }
        
        selectedValues[parent].push(checkbox.id);
    });

    localStorage.setItem(participant, JSON.stringify(selectedValues));

    if (participant === "Person 1") {
        startSecondSurvey();
    } else {
        compareSelections();
    }
});

function startSecondSurvey() {
    alert("Person 1 survey completed! Now starting the Person 2 survey.");
    localStorage.setItem("currentParticipant", "Person 2");
    location.reload();
}

// **Section Label Mapping**
const sectionMap = {
    sec1_A: "Car",
    sec1_B: "Fruit",
    sec1_C: "Meat",
    sec2_D: "Clothes",
    sec2_E: "Sports",
    sec2_F: "Animals",
    sec3_G: "Dinosaurs",
    sec3_H: "Colours",
    sec3_I: "Pokemon"
};

// **Function to retrieve correct label text**
function getLabelText(elementId) {
    let element = document.getElementById(elementId);

    if (!element) {
        return sectionMap[elementId] || elementId; // Use mapped section name or fallback to ID
    }

    // If it's a checkbox, get its associated label text
    if (element.type === "checkbox") {
        let label = element.closest("label");
        return label ? label.textContent.trim() : elementId;
    }

    return sectionMap[elementId] || elementId; // Default fallback for section names
}

// **Compare Selections & Display Human-Readable Labels**
function compareSelections() {
    let firstSelections = JSON.parse(localStorage.getItem("Person 1")) || {};
    let secondSelections = JSON.parse(localStorage.getItem("Person 2")) || {};

    let matchSummary = "<h3>Matching Responses</h3>";

    for (let category in firstSelections) {
        if (secondSelections[category]) {
            let matchedSubOptions = firstSelections[category].filter(option => secondSelections[category].includes(option));

            if (matchedSubOptions.length > 0) {
                matchSummary += `<h4>${getLabelText(category)}</h4><ul>`;
                matchedSubOptions.forEach(item => {
                    matchSummary += `<li>${getLabelText(item)}</li>`;
                });
                matchSummary += "</ul>";
            }
        }
    }

    document.body.innerHTML = `
        ${matchSummary}
        <button onclick="copySummary()" style="padding: 10px; margin-top: 20px;">Copy Summary</button>
        <button onclick="resetSurvey()" style="padding: 10px; margin-top: 20px;">Restart Survey</button>
    `;
}

function copySummary() {
    let summaryText = document.querySelector("h3").innerText + "\n" + 
        Array.from(document.querySelectorAll("h4, li")).map(el => el.innerText).join("\n");

    navigator.clipboard.writeText(summaryText).then(() => {
        alert("Matching responses copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}

function resetSurvey() {
    localStorage.clear();
    location.reload();
}

window.addEventListener("load", function() {
    if (!localStorage.getItem("currentParticipant")) {
        localStorage.setItem("currentParticipant", "Person 1"); // Ensure default is Person 1
    }
    
    const currentParticipant = localStorage.getItem("currentParticipant");
    document.getElementById("survey-title").textContent = `Survey for ${currentParticipant.charAt(0).toUpperCase() + currentParticipant.slice(1)}`;
});

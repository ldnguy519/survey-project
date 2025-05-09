document.addEventListener("DOMContentLoaded", function () {
    // Hide all sub-options initially
    document.querySelectorAll(".sub-options").forEach(div => div.style.display = "none");

    // Set session storage for participant tracking
    if (!sessionStorage.getItem("currentParticipant")) {
        sessionStorage.setItem("currentParticipant", "Person 1");
    }

    const currentParticipant = sessionStorage.getItem("currentParticipant");
    document.getElementById("survey-title").textContent = `Survey for ${currentParticipant.charAt(0).toUpperCase() + currentParticipant.slice(1)}`;
});

function toggleSubOptions(subOptionId) {
    let subOptionsDiv = document.getElementById(subOptionId);
    let button = document.querySelector(`button[onclick="toggleSubOptions('${subOptionId}')"]`);

    let isExpanded = subOptionsDiv.style.display === "block";
    subOptionsDiv.style.display = isExpanded ? "none" : "block";
    button.setAttribute("aria-expanded", !isExpanded);
    button.textContent = `${isExpanded ? "▶" : "▼"} ${button.textContent.replace(/▶ |▼ /, "")}`;
}

document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let isValid = true;
    let errorMessage = "Please select at least one option in each subsection before submitting.";

    // Reset previous highlights
    document.querySelectorAll(".sub-options").forEach(subOptionsDiv => subOptionsDiv.classList.remove("warning"));

    document.querySelectorAll(".sub-options").forEach(subOptionsDiv => {
        let checkboxes = subOptionsDiv.querySelectorAll("input[type='checkbox']");
        let isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

        // Apply warning to the specific subsection instead of the whole section
        if (!isChecked) {
            isValid = false;
            subOptionsDiv.classList.add("warning"); // Highlight subsection with missing selection
        }
    });

    if (!isValid) {
        alert(errorMessage);
        return;
    }

    saveSurveyData();
});

function saveSurveyData() {
    let participant = sessionStorage.getItem("currentParticipant") || "Person 1";
    let selectedValues = {};

    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        let parent = checkbox.dataset.parent || checkbox.id;
        selectedValues[parent] = selectedValues[parent] || [];
        selectedValues[parent].push(checkbox.id);
    });

    sessionStorage.setItem(participant, JSON.stringify(selectedValues));

    participant === "Person 1" ? startSecondSurvey() : compareSelections();
}

function startSecondSurvey() {
    alert("Person 1 survey completed! Now starting the Person 2 survey.");
    sessionStorage.setItem("currentParticipant", "Person 2");
    location.reload();
}

// Section Label Mapping
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

function getLabelText(elementId) {
    let element = document.getElementById(elementId);

    if (!element) {
        return sectionMap[elementId] || elementId;
    }

    if (element.type === "checkbox") {
        let label = element.closest("label");
        return label ? label.textContent.trim() : elementId;
    }

    return sectionMap[elementId] || elementId;
}

function compareSelections() {
    let firstSelections = JSON.parse(sessionStorage.getItem("Person 1")) || {};
    let secondSelections = JSON.parse(sessionStorage.getItem("Person 2")) || {};

    // Mapping section codes to readable section names
    const sectionTitleMap = {
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

    // Mapping main section names for grouping
    const mainSections = {
        Section1: { title: "Transportation & Food", subs: ["sec1_A", "sec1_B", "sec1_C"] },
        Section2: { title: "Lifestyle & Interests", subs: ["sec2_D", "sec2_E", "sec2_F"] },
        Section3: { title: "Entertainment & Preferences", subs: ["sec3_G", "sec3_H", "sec3_I"] }
    };

    let matchSummary = "<h2>Matching Responses</h2>";

    for (let sectionKey in mainSections) {
        let sectionTitle = mainSections[sectionKey].title;
        let sectionMatch = `<h3>${sectionTitle}</h3>`; // Ensure section title is displayed

        let hasMatches = false; // Track if there are any matches within this section

        mainSections[sectionKey].subs.forEach(category => {
            if (firstSelections[category] && secondSelections[category]) {
                let matchedSubOptions = firstSelections[category].filter(option => secondSelections[category].includes(option));

                if (matchedSubOptions.length > 0) {
                    sectionMatch += `<h4>${sectionTitleMap[category]}</h4><ul>`;
                    matchedSubOptions.forEach(item => {
                        sectionMatch += `<li>${getLabelText(item)}</li>`;
                    });
                    sectionMatch += "</ul>";

                    hasMatches = true; // Indicate that this section contains matches
                }
            }
        });

        // Add section grouping only if there are matches
        if (hasMatches) {
            matchSummary += sectionMatch;
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
    sessionStorage.clear();
    location.reload();
}

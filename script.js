document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let participant = localStorage.getItem("currentParticipant") || "male";
    let selectedValues = {};

    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        selectedValues[checkbox.id] = true;
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
    const sections = {};

    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        const sectionTitle = checkbox.closest(".section").querySelector(".section-title").textContent;
        const sectionNumber = checkbox.closest(".section").querySelector(".section-title").id.replace("section-", "").replace("-title", "");

        if (!sections[sectionNumber]) {
            sections[sectionNumber] = [];
        }

        if (maleSelections[checkbox.id] && femaleSelections[checkbox.id]) {
            sections[sectionNumber].push(checkbox.parentElement.textContent.trim());
        }
    });

    for (const section in sections) {
        matchSummary += `<h4>Section ${section}</h4><ul>`;
        sections[section].forEach(item => {
            matchSummary += `<li>${item}</li>`;
        });
        matchSummary += "</ul>";
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

document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
        alert("Please select a gender before proceeding.");
        return;
    }

    const selectedValues = {};
    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        selectedValues[checkbox.id] = true;
    });

    localStorage.setItem(gender.value, JSON.stringify(selectedValues));

    // Store that the first survey is complete
    localStorage.setItem("completedSurvey", gender.value);

    // Determine next step
    if (!localStorage.getItem("male") || !localStorage.getItem("female")) {
        startSecondSurvey(gender.value === "male" ? "female" : "male");
    } else {
        compareSelections();
    }
});

// Retain gender selection after refresh
window.addEventListener("load", function() {
    const currentSurvey = localStorage.getItem("currentSurvey");
    if (currentSurvey) {
        document.querySelector(`input[name="gender"][value="${currentSurvey}"]`).checked = true;
        showSections();
    }
});

function startSecondSurvey(nextGender) {
    localStorage.setItem("currentSurvey", nextGender);
    alert(`Now starting the ${nextGender} survey.`);
    location.reload();
}

function compareSelections() {
    let maleSelections = JSON.parse(localStorage.getItem("male")) || {};
    let femaleSelections = JSON.parse(localStorage.getItem("female")) || {};

    let matchSummary = "<h3>Comparison of Male vs Female Responses</h3>";
    const sections = {};

    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        const sectionTitle = checkbox.closest(".section").querySelector(".section-title").textContent;
        if (!sections[sectionTitle]) {
            sections[sectionTitle] = { male: [], female: [] };
        }

        if (maleSelections[checkbox.id]) {
            sections[sectionTitle].male.push(checkbox.parentElement.textContent.trim());
        }

        if (femaleSelections[checkbox.id]) {
            sections[sectionTitle].female.push(checkbox.parentElement.textContent.trim());
        }
    });

    for (const section in sections) {
        matchSummary += `<h4>${section}</h4>`;
        matchSummary += "<strong>Male Selected:</strong><ul>" + sections[section].male.map(item => `<li>${item}</li>`).join("") + "</ul>";
        matchSummary += "<strong>Female Selected:</strong><ul>" + sections[section].female.map(item => `<li>${item}</li>`).join("") + "</ul>";
    }

    document.body.innerHTML = `${matchSummary}<button onclick="resetSurvey()" style="padding: 10px; margin-top: 20px;">Go Back to Start</button>`;
}

function resetSurvey() {
    localStorage.clear();
    location.reload();
}

window.addEventListener("beforeunload", function() {
    localStorage.clear();
});

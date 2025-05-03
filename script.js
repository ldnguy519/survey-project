document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default submission

    const gender = document.querySelector('input[name="gender"]:checked');
    if (!gender) {
        alert("Please select a gender before proceeding.");
        return;
    }

    const selectedValues = {};
    document.querySelectorAll("input[type='checkbox']:checked").forEach(checkbox => {
        selectedValues[checkbox.id] = true; // Use checkbox ID for uniqueness
    });

    localStorage.setItem(gender.value, JSON.stringify(selectedValues));

    if (!localStorage.getItem("male") || !localStorage.getItem("female")) {
        startSecondSurvey(gender.value === "male" ? "female" : "male");
    } else {
        compareSelections();
    }
});

// Retain gender selection after refresh
window.addEventListener("load", function() {
    const savedGender = localStorage.getItem("currentSurvey");
    if (savedGender) {
        document.querySelector(`input[name="gender"][value="${savedGender}"]`).checked = true;
        showSections();
    }
});

function startSecondSurvey(gender) {
    localStorage.setItem("currentSurvey", gender);
    location.reload(); // Reload without losing progress
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

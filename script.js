document.addEventListener("DOMContentLoaded", function () {
    const subjects = [];

    function createSubjectInput() {
        const inputDiv = document.getElementById("inputs");
        const subjectInput = document.createElement("div");
        subjectInput.className = "subject";

        const gradeInput = document.createElement("input");
        gradeInput.type = "text";
        gradeInput.placeholder = "Enter grade";

        const hoursInput = document.createElement("input");
        hoursInput.type = "text";
        hoursInput.placeholder = "Enter hours";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener("click", function () {
            subjectInput.remove();
            updateSubjectsArray();
        });

        subjectInput.appendChild(gradeInput);
        subjectInput.appendChild(hoursInput);
        subjectInput.appendChild(removeButton);

        inputDiv.appendChild(subjectInput);
        subjects.push(subjectInput);
    }

    function toggleCumulativeInputFields() {
        const cumulativeInputs = document.getElementById("cumulative-inputs");
        cumulativeInputs.style.display = cumulativeInputs.style.display === "none" ? "block" : "none";
    }

    function calculateGPA() {
        const totalGradePoints = subjects.reduce((total, subject) => {
            const grade = convertGradeToNumeric(subject.children[0].value);
            const hours = parseFloat(subject.children[1].value);
            return total + grade * hours;
        }, 0);

        const totalHours = subjects.reduce((total, subject) => {
            return total + parseFloat(subject.children[1].value);
        }, 0);

        const gpa = totalGradePoints / totalHours;

        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `Total hours studied: ${totalHours}<br>GPA: ${gpa.toFixed(2)}`;
    }

    function calculateCumulativeGPA() {
        const oldGPA = parseFloat(document.getElementById("oldGPA").value);
        const oldGPAHours = parseFloat(document.getElementById("oldGPAHours").value);
        const newGPA = parseFloat(document.getElementById("newGPA").value);
        const newGPAHours = parseFloat(document.getElementById("newGPAHours").value);

        const totalGradePoints = subjects.reduce((total, subject) => {
            const grade = convertGradeToNumeric(subject.children[0].value);
            const hours = parseFloat(subject.children[1].value);
            return total + grade * hours;
        }, 0);

        const totalHours = subjects.reduce((total, subject) => {
            return total + parseFloat(subject.children[1].value);
        }, 0);

        const cumulativeGPA = (totalGradePoints + oldGPA * oldGPAHours + newGPA * newGPAHours) / (totalHours + oldGPAHours + newGPAHours);

        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `Cumulative GPA: ${cumulativeGPA.toFixed(2)}`;
    }

    function createGPAInput(placeholder) {
        const gpaInput = document.createElement("input");
        gpaInput.type = "text";
        gpaInput.placeholder = placeholder;
        return gpaInput;
    }

    function createHoursInput(placeholder) {
        const hoursInput = document.createElement("input");
        hoursInput.type = "text";
        hoursInput.placeholder = placeholder;
        return hoursInput;
    }

    function removeAllSubjects() {
        const inputDiv = document.getElementById("inputs");
        const cumulativeInputs = document.getElementById("cumulative-inputs");
    
        inputDiv.innerHTML = ""; // Remove all child elements
        cumulativeInputs.style.display = "none"; // Hide cumulative inputs
        updateSubjectsArray();
    }
    
    function updateSubjectsArray() {
        subjects.length = 0;
        const subjectInputs = document.querySelectorAll(".subject");
        subjectInputs.forEach((input) => subjects.push(input));
    }

    function convertGradeToNumeric(grade) {
        switch (grade.toUpperCase()) {
            case "A":
                return 4.0;
            case "B+":
                return 3.5;
            case "B":
                return 3.0;
            case "C+":
                return 2.5;
            case "C":
                return 2.0;
            case "D":
                return 1.5;
            case "F":
                return 0;
            default:
                return NaN;
        }
    }

    window.createSubjectInput = createSubjectInput;
    window.toggleCumulativeInputFields = toggleCumulativeInputFields;
    window.calculateGPA = calculateGPA;
    window.calculateCumulativeGPA = calculateCumulativeGPA;
    window.removeAllSubjects = removeAllSubjects;
});

document.addEventListener("DOMContentLoaded", function () {
    const subjects = [];

    // Create input fields for previous GPA and hours
    createPrevGPAInputs();

    window.createSubjectInput = function () {
        const subjectInput = document.createElement("div");
        subjectInput.className = "subject";

        const gradeInput = document.createElement("input");
        gradeInput.type = "text";
        gradeInput.placeholder = "Enter grade (A, B+, B, C+, C, D, F)";

        const hoursInput = document.createElement("input");
        hoursInput.type = "number"; // Change to number for hours input
        hoursInput.placeholder = "Enter hours";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "remove-button";
        removeButton.addEventListener("click", function () {
            subjectInput.remove();
            updateSubjectsArray();
        });

        subjectInput.appendChild(gradeInput);
        subjectInput.appendChild(hoursInput);
        subjectInput.appendChild(removeButton);

        document.getElementById("inputs").appendChild(subjectInput);
        subjects.push(subjectInput);
    };

    window.calculateGPA = function () {
        const totalGradePoints = calculateTotalGradePoints();
        const totalHours = calculateTotalHours();

        // Get previous GPA and hours
        const prevGPA = parseFloat(document.getElementById("prev-gpa").value) || 0;
        const prevHours = parseFloat(document.getElementById("prev-hours").value) || 0;

        // Calculate cumulative GPA
        const cumulativeGradePoints = totalGradePoints + (prevGPA * prevHours);
        const cumulativeTotalHours = totalHours + prevHours;

        if (totalHours === 0 && prevHours === 0) {
            showResult("Please enter valid grades and hours", "error");
            return;
        }

        const currentGPA = totalHours === 0 ? 0 : totalGradePoints / totalHours;
        const cumulativeGPA = cumulativeTotalHours === 0 ? 0 : cumulativeGradePoints / cumulativeTotalHours;

        showResult(`
            Total hours studied: ${totalHours}<br>
            Cumulative Total hours studied: ${cumulativeTotalHours}<br>
            Current GPA: ${currentGPA.toFixed(2)}<br>
            Cumulative GPA: ${cumulativeGPA.toFixed(2)}
        `);
    };

    window.removeAllSubjects = function () {
        document.getElementById("inputs").querySelectorAll(".subject").forEach(subject => subject.remove());
        subjects.length = 0; // Clear the subjects array
        updateSubjectsArray();

        // Clear the values of previous GPA and hours but keep the input fields
        document.getElementById("prev-gpa").value = "";
        document.getElementById("prev-hours").value = "";
    };

    function calculateTotalGradePoints() {
        let totalGradePoints = 0;

        subjects.forEach(subject => {
            const grade = subject.querySelector("input[type='text']").value;
            const hours = parseFloat(subject.querySelector("input[type='number']").value) || 0;

            const gradePoint = getGradePoint(grade);
            totalGradePoints += (gradePoint * hours);
        });

        return totalGradePoints;
    }

    function calculateTotalHours() {
        let totalHours = 0;

        subjects.forEach(subject => {
            const hours = parseFloat(subject.querySelector("input[type='number']").value) || 0;
            totalHours += hours;
        });

        return totalHours;
    }

    function getGradePoint(grade) {
        switch (grade.toUpperCase()) {
            case "A": return 4;
            case "B+": return 3.5;
            case "B": return 3;
            case "C+": return 2.5;
            case "C": return 2;
            case "D": return 1.5;
            case "F": return 0;
            default: return 0; // Invalid grade
        }
    }

    function showResult(message, type = "success") {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = message;
        resultDiv.style.backgroundColor = type === "error" ? "#ef4444" : "#22c55e";
        resultDiv.style.color = "white";
    }

    function createPrevGPAInputs() {
        const prevGPAInput = document.createElement("input");
        prevGPAInput.id = "prev-gpa";
        prevGPAInput.type = "number"; // Change to number for GPA input
        prevGPAInput.placeholder = "Enter previous GPA";

        const prevHoursInput = document.createElement("input");
        prevHoursInput.id = "prev-hours";
        prevHoursInput.type = "number"; // Change to number for hours input
        prevHoursInput.placeholder = "Enter previous hours";

        document.getElementById("inputs").appendChild(prevGPAInput);
        document.getElementById("inputs").appendChild(prevHoursInput);
    }

    function updateSubjectsArray() {
        subjects.length = 0; // Reset the subjects array
        document.querySelectorAll(".subject").forEach(subject => subjects.push(subject));
    }
});

// Created by Mohammed Nuseirat


// script.js
document.addEventListener("DOMContentLoaded", function () {
    // Array to store all subject input elements
    const subjects = [];

    // Add Subject Button Handler
    window.addSubject = function() {
        // Create container for new subject inputs
        const subjectInput = document.createElement("div");
        subjectInput.className = "subject";

        // Create grade input field
        const gradeInput = document.createElement("input");
        gradeInput.type = "text";
        gradeInput.placeholder = "Enter grade (A, B+, B, C+, C, D, F)";
        gradeInput.className = "grade-input";

        // Create credit hours input field
        const hoursInput = document.createElement("input");
        hoursInput.type = "number";
        hoursInput.placeholder = "Enter hours";
        hoursInput.className = "hours-input";
        hoursInput.min = "1";

        // Create remove button with icon
        const removeButton = document.createElement("button");
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.className = "remove-button";
        
        // Add animation and removal functionality to remove button
        removeButton.addEventListener("click", function () {
            gsap.to(subjectInput, {
                duration: 0.3,
                opacity: 0,
                y: -20,
                ease: 'power2.in',
                onComplete: () => {
                    subjectInput.remove();
                    updateSubjectsArray();
                }
            });
        });

        // Assemble the subject input container
        subjectInput.appendChild(gradeInput);
        subjectInput.appendChild(hoursInput);
        subjectInput.appendChild(removeButton);

        // Add to DOM and subjects array
        document.getElementById("subjects-container").appendChild(subjectInput);
        subjects.push(subjectInput);

        // Animate new subject entry
        gsap.from(subjectInput, {
            duration: 0.5,
            opacity: 0,
            y: 20,
            ease: 'power2.out'
        });

        // Validate grade input
        gradeInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
            const validGrades = ['A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
            if (!validGrades.includes(this.value) && this.value !== '') {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });

        // Validate hours input
        hoursInput.addEventListener('input', function() {
            if (this.value < 1) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
    };

    // Clear All Button Handler
    window.clearAll = function() {
        const subjectInputs = document.querySelectorAll(".subject");
        
        // Animate removal of all subjects
        gsap.to(subjectInputs, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            stagger: 0.1,
            ease: 'power2.in',
            onComplete: () => {
                // Clear all inputs and results
                document.getElementById("subjects-container").innerHTML = '';
                subjects.length = 0;
                document.getElementById("prev-gpa").value = "";
                document.getElementById("prev-hours").value = "";
                document.getElementById("result").innerHTML = "";
                document.getElementById("result").classList.add("hidden");
            }
        });

        // Animate calculator container
        gsap.to('.calculator-container', {
            duration: 0.2,
            scale: 0.98,
            ease: 'power2.in',
            yoyo: true,
            repeat: 1
        });
    };

    // Calculate GPA Button Handler
    window.calculateGPA = function() {
        // Validate all inputs before calculation
        const invalidInputs = document.querySelectorAll('.invalid');
        if (invalidInputs.length > 0) {
            showResult("Please correct invalid inputs before calculating", "error");
            return;
        }

        // Calculate totals
        const totalGradePoints = calculateTotalGradePoints();
        const totalHours = calculateTotalHours();

        // Get previous GPA data
        const prevGPA = parseFloat(document.getElementById("prev-gpa").value) || 0;
        const prevHours = parseFloat(document.getElementById("prev-hours").value) || 0;

        // Validate previous GPA
        if (prevGPA > 4) {
            showResult("Previous GPA cannot be greater than 4.0", "error");
            return;
        }

        // Calculate cumulative statistics
        const cumulativeGradePoints = totalGradePoints + (prevGPA * prevHours);
        const cumulativeTotalHours = totalHours + prevHours;

        // Validate hours
        if (totalHours === 0 && prevHours === 0) {
            showResult("Please enter valid grades and hours", "error");
            return;
        }

        // Calculate GPAs
        const currentGPA = totalHours === 0 ? 0 : totalGradePoints / totalHours;
        const cumulativeGPA = cumulativeTotalHours === 0 ? 0 : cumulativeGradePoints / cumulativeTotalHours;

        // Format and display results
        const resultHTML = `
            <div class="result-content">
                <div class="result-item">
                    <span class="result-label">Semester Hours:</span>
                    <span class="result-value">${totalHours}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Total Hours:</span>
                    <span class="result-value">${cumulativeTotalHours}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Semester GPA:</span>
                    <span class="result-value">${currentGPA.toFixed(2)}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Cumulative GPA:</span>
                    <span class="result-value">${cumulativeGPA.toFixed(2)}</span>
                </div>
            </div>
        `;

        showResult(resultHTML);

        // Animate result items
        gsap.from('.result-item', {
            duration: 0.5,
            opacity: 0,
            y: 20,
            stagger: 0.1,
            ease: 'power2.out'
        });
    };

    // Helper function to calculate total grade points
    function calculateTotalGradePoints() {
        let totalGradePoints = 0;

        subjects.forEach(subject => {
            const grade = subject.querySelector(".grade-input").value;
            const hours = parseFloat(subject.querySelector(".hours-input").value) || 0;

            const gradePoint = getGradePoint(grade);
            totalGradePoints += (gradePoint * hours);
        });

        return totalGradePoints;
    }

    // Helper function to calculate total hours
    function calculateTotalHours() {
        let totalHours = 0;

        subjects.forEach(subject => {
            const hours = parseFloat(subject.querySelector(".hours-input").value) || 0;
            totalHours += hours;
        });

        return totalHours;
    }

    // Convert letter grades to grade points
    function getGradePoint(grade) {
        const gradePoints = {
            'A': 4,
            'B+': 3.5,
            'B': 3,
            'C+': 2.5,
            'C': 2,
            'D': 1.5,
            'F': 0
        };
        return gradePoints[grade.toUpperCase()] || 0;
    }

    // Display result with animation
    function showResult(message, type = "success") {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = message;
        resultDiv.classList.remove("hidden");
        resultDiv.style.opacity = "0";
        
        // Animate result appearance
        gsap.to(resultDiv, {
            duration: 0.5,
            opacity: 1,
            y: 0,
            ease: 'power2.out'
        });

        // Scroll result into view
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update subjects array after removal
    function updateSubjectsArray() {
        subjects.length = 0;
        document.querySelectorAll(".subject").forEach(subject => subjects.push(subject));
    }

    // Validate previous GPA input
    const prevGPAInput = document.getElementById("prev-gpa");
    prevGPAInput.addEventListener('input', function() {
        if (this.value > 4) {
            this.classList.add('invalid');
        } else {
            this.classList.remove('invalid');
        }
    });
});

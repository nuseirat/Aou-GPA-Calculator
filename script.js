document.addEventListener("DOMContentLoaded", function () {
    const subjects = [];

    // Initial animations
    gsap.from('.container', {
        duration: 1,
        opacity: 0,
        y: 50,
        ease: 'power3.out'
    });

    // Theme toggle functionality with persistence
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    // Theme toggle with animation
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        // Save theme preference
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        
        // Animate theme toggle button
        gsap.to(themeToggleBtn, {
            duration: 0.3,
            rotate: 180,
            ease: 'power2.out',
            onComplete: () => {
                gsap.set(themeToggleBtn, { rotate: 0 });
            }
        });
        
        // Animate logo transition
        gsap.to('.logo', {
            duration: 0.3,
            opacity: 0,
            scale: 0.9,
            ease: 'power2.out',
            onComplete: () => {
                gsap.to('.logo', {
                    duration: 0.3,
                    opacity: 1,
                    scale: 1,
                    ease: 'power2.out'
                });
            }
        });
    });

    // Function to add a new subject (connected to HTML button)
    window.addSubject = function() {
        const subjectInput = document.createElement("div");
        subjectInput.className = "subject";

        const gradeInput = document.createElement("input");
        gradeInput.type = "text";
        gradeInput.placeholder = "Enter grade (A, B+, B, C+, C, D, F)";
        gradeInput.className = "grade-input";

        const hoursInput = document.createElement("input");
        hoursInput.type = "number";
        hoursInput.placeholder = "Enter hours";
        hoursInput.className = "hours-input";
        hoursInput.min = "1";

        const removeButton = document.createElement("button");
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.className = "remove-button";
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

        subjectInput.appendChild(gradeInput);
        subjectInput.appendChild(hoursInput);
        subjectInput.appendChild(removeButton);

        document.getElementById("subjects-container").appendChild(subjectInput);
        subjects.push(subjectInput);

        // Animate new subject row
        gsap.from(subjectInput, {
            duration: 0.5,
            opacity: 0,
            y: 20,
            ease: 'power2.out'
        });

        // Add input validation
        gradeInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
            const validGrades = ['A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
            if (!validGrades.includes(this.value) && this.value !== '') {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });

        hoursInput.addEventListener('input', function() {
            if (this.value < 1) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
    };

    // Function to clear all (connected to HTML button)
    window.clearAll = function() {
        const subjectInputs = document.querySelectorAll(".subject");
        
        gsap.to(subjectInputs, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            stagger: 0.1,
            ease: 'power2.in',
            onComplete: () => {
                document.getElementById("subjects-container").innerHTML = '';
                subjects.length = 0;
                document.getElementById("prev-gpa").value = "";
                document.getElementById("prev-hours").value = "";
                document.getElementById("result").innerHTML = "";
                document.getElementById("result").classList.add("hidden");
            }
        });

        // Animate clear effect
        gsap.to('.calculator-container', {
            duration: 0.2,
            scale: 0.98,
            ease: 'power2.in',
            yoyo: true,
            repeat: 1
        });
    };

    // Calculate GPA function (connected to HTML button)
    window.calculateGPA = function() {
        // Validate inputs before calculation
        const invalidInputs = document.querySelectorAll('.invalid');
        if (invalidInputs.length > 0) {
            showResult("Please correct invalid inputs before calculating", "error");
            return;
        }

        const totalGradePoints = calculateTotalGradePoints();
        const totalHours = calculateTotalHours();

        const prevGPA = parseFloat(document.getElementById("prev-gpa").value) || 0;
        const prevHours = parseFloat(document.getElementById("prev-hours").value) || 0;

        // Validate GPA range
        if (prevGPA > 4) {
            showResult("Previous GPA cannot be greater than 4.0", "error");
            return;
        }

        const cumulativeGradePoints = totalGradePoints + (prevGPA * prevHours);
        const cumulativeTotalHours = totalHours + prevHours;

        if (totalHours === 0 && prevHours === 0) {
            showResult("Please enter valid grades and hours", "error");
            return;
        }

        const currentGPA = totalHours === 0 ? 0 : totalGradePoints / totalHours;
        const cumulativeGPA = cumulativeTotalHours === 0 ? 0 : cumulativeGradePoints / cumulativeTotalHours;

        // Format result with enhanced styling
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

        // Animate calculation effect
        gsap.from('.result-item', {
            duration: 0.5,
            opacity: 0,
            y: 20,
            stagger: 0.1,
            ease: 'power2.out'
        });
    };

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

    function calculateTotalHours() {
        let totalHours = 0;

        subjects.forEach(subject => {
            const hours = parseFloat(subject.querySelector(".hours-input").value) || 0;
            totalHours += hours;
        });

        return totalHours;
    }

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

    function showResult(message, type = "success") {
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = message;
        resultDiv.classList.remove("hidden");

        
        gsap.to(resultDiv, {
            duration: 0.5,
            opacity: 1,
            y: 0,
            ease: 'power2.out'
        });

        // Scroll to result if it's not in view
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function updateSubjectsArray() {
        subjects.length = 0;
        document.querySelectorAll(".subject").forEach(subject => subjects.push(subject));
    }

    // Add validation for previous GPA inputs
    const prevGPAInput = document.getElementById("prev-gpa");
    prevGPAInput.addEventListener('input', function() {
        if (this.value > 4) {
            this.classList.add('invalid');
        } else {
            this.classList.remove('invalid');
        }
    });

    
});

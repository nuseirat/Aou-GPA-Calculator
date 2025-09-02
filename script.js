/*
    AOU GPA Calculator - JavaScript Logic
    Created by Mohammed Nuseirat
    Version: 2.0
    
    This file contains all the interactive functionality for the GPA calculator,
    including subject management, GPA calculations, validation, and UI animations.
*/

// ===== GLOBAL VARIABLES AND INITIALIZATION =====
// Wait for DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", function () {
    
    // Array to store all subject input elements for easy management
    const subjects = [];

    // ===== INFO PANEL FUNCTIONALITY =====
    
    /**
     * Toggles the visibility of the information panel modal
     * Uses GSAP for smooth animations
     */
    window.toggleInfoPanel = function() {
        const infoPanel = document.getElementById('info-panel');
        infoPanel.classList.toggle('active');
        
        // Animate info content when opening
        if (infoPanel.classList.contains('active')) {
            gsap.from('.info-content', {
                duration: 0.5,
                scale: 0.8,
                opacity: 0,
                ease: 'power2.out'
            });
        }
    };

    /**
     * Close info panel when user clicks outside the modal content
     */
    document.getElementById('info-panel').addEventListener('click', function(e) {
        if (e.target === this) {
            toggleInfoPanel();
        }
    });

    // ===== SUBJECT MANAGEMENT FUNCTIONS =====
    
    /**
     * Adds a new subject input row to the calculator
     * Creates grade input, credit hours input, and remove button
     */
    window.addSubject = function() {
        // Create main container for the subject entry
        const subjectInput = document.createElement("div");
        subjectInput.className = "subject";

        // Create grade input field with validation
        const gradeInput = document.createElement("input");
        gradeInput.type = "text";
        gradeInput.placeholder = "Enter grade (A, B+, B, C+, C, D, F) / الدرجة";
        gradeInput.className = "grade-input";

        // Create credit hours input field with validation
        const hoursInput = document.createElement("input");
        hoursInput.type = "number";
        hoursInput.placeholder = "Enter hours / أضف الساعات";
        hoursInput.className = "hours-input";
        hoursInput.min = "1";

        // Create remove button with icon
        const removeButton = document.createElement("button");
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.className = "remove-button";
        
        // Add click event to remove button with smooth animation
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

        // Animate new subject entry appearance
        gsap.from(subjectInput, {
            duration: 0.5,
            opacity: 0,
            y: 20,
            ease: 'power2.out'
        });

        // Add real-time grade validation
        gradeInput.addEventListener('input', function() {
            // Convert to uppercase for consistency
            this.value = this.value.toUpperCase();
            const validGrades = ['A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
            
            // Visual feedback for invalid grades
            if (!validGrades.includes(this.value) && this.value !== '') {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });

        // Add real-time hours validation
        hoursInput.addEventListener('input', function() {
            // Ensure positive values only
            if (this.value < 1) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
    };

    // ===== CLEAR FUNCTIONALITY =====
    
    /**
     * Clears all subject entries and resets the calculator
     * Includes smooth animations for better user experience
     */
    window.clearAll = function() {
        const subjectInputs = document.querySelectorAll(".subject");
        
        // Animate removal of all subjects with staggered timing
        gsap.to(subjectInputs, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            stagger: 0.1,
            ease: 'power2.in',
            onComplete: () => {
                // Clear all DOM elements and reset state
                document.getElementById("subjects-container").innerHTML = '';
                subjects.length = 0;
                document.getElementById("prev-gpa").value = "";
                document.getElementById("prev-hours").value = "";
                document.getElementById("result").innerHTML = "";
                document.getElementById("result").classList.add("hidden");
            }
        });

        // Add subtle feedback animation to calculator container
        gsap.to('.calculator-container', {
            duration: 0.2,
            scale: 0.98,
            ease: 'power2.in',
            yoyo: true,
            repeat: 1
        });
    };

    // ===== GPA CALCULATION FUNCTIONS =====
    
    /**
     * Main calculation function that computes both semester and cumulative GPA
     * Includes comprehensive validation and error handling
     */
    window.calculateGPA = function() {
        // Pre-calculation validation
        const invalidInputs = document.querySelectorAll('.invalid');
        if (invalidInputs.length > 0) {
            showResult("Please correct invalid inputs before calculating", "error");
            return;
        }

        // Calculate current semester statistics
        const totalGradePoints = calculateTotalGradePoints();
        const totalHours = calculateTotalHours();

        // Get previous academic history
        const prevGPA = parseFloat(document.getElementById("prev-gpa").value) || 0;
        const prevHours = parseFloat(document.getElementById("prev-hours").value) || 0;

        // Validate previous GPA range
        if (prevGPA > 4) {
            showResult("Previous GPA cannot be greater than 4.0", "error");
            return;
        }

        // Calculate cumulative statistics
        const cumulativeGradePoints = totalGradePoints + (prevGPA * prevHours);
        const cumulativeTotalHours = totalHours + prevHours;

        // Ensure there's data to calculate
        if (totalHours === 0 && prevHours === 0) {
            showResult("Please enter valid grades and hours", "error");
            return;
        }

        // Perform GPA calculations
        const currentGPA = totalHours === 0 ? 0 : totalGradePoints / totalHours;
        const cumulativeGPA = cumulativeTotalHours === 0 ? 0 : cumulativeGradePoints / cumulativeTotalHours;

        // Generate formatted results HTML
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

        // Display results with animation
        showResult(resultHTML);

        // Animate individual result items for better visual feedback
        gsap.from('.result-item', {
            duration: 0.5,
            opacity: 0,
            y: 20,
            stagger: 0.1,
            ease: 'power2.out'
        });
    };

    // ===== CALCULATION HELPER FUNCTIONS =====
    
    /**
     * Calculates total grade points for current semester
     * @returns {number} Total grade points earned
     */
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

    /**
     * Calculates total credit hours for current semester
     * @returns {number} Total credit hours
     */
    function calculateTotalHours() {
        let totalHours = 0;

        subjects.forEach(subject => {
            const hours = parseFloat(subject.querySelector(".hours-input").value) || 0;
            totalHours += hours;
        });

        return totalHours;
    }

    /**
     * Converts letter grades to numerical grade points
     * Based on standard 4.0 scale used by AOU
     * @param {string} grade - Letter grade (A, B+, B, C+, C, D, F)
     * @returns {number} Grade point value
     */
    function getGradePoint(grade) {
        const gradePoints = {
            'A': 4.0,    // 90-100%
            'B+': 3.5,   // 85-89%
            'B': 3.0,    // 80-84%
            'C+': 2.5,   // 75-79%
            'C': 2.0,    // 70-74%
            'D': 1.5,    // 60-69%
            'F': 0.0     // Below 60%
        };
        return gradePoints[grade.toUpperCase()] || 0;
    }

    // ===== UI FEEDBACK FUNCTIONS =====
    
    /**
     * Displays calculation results or error messages with animations
     * @param {string} message - HTML content or error message to display
     * @param {string} type - Type of message ("success" or "error")
     */
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

        // Smooth scroll to results for better UX
        resultDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }

    /**
     * Updates the subjects array after elements are removed
     * Maintains synchronization between DOM and JavaScript state
     */
    function updateSubjectsArray() {
        subjects.length = 0;
        document.querySelectorAll(".subject").forEach(subject => {
            subjects.push(subject);
        });
    }

    // ===== INPUT VALIDATION =====
    
    /**
     * Real-time validation for previous GPA input
     * Ensures GPA doesn't exceed 4.0 scale maximum
     */
    const prevGPAInput = document.getElementById("prev-gpa");
    prevGPAInput.addEventListener('input', function() {
        if (this.value > 4) {
            this.classList.add('invalid');
        } else {
            this.classList.remove('invalid');
        }
    });

    // ===== KEYBOARD SHORTCUTS =====
    
    /**
     * Global keyboard event handler for shortcuts and accessibility
     */
    document.addEventListener('keydown', function(e) {
        // ESC key closes info panel
        if (e.key === 'Escape') {
            const infoPanel = document.getElementById('info-panel');
            if (infoPanel.classList.contains('active')) {
                toggleInfoPanel();
            }
        }
        
        // Ctrl/Cmd + I opens info panel
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
            e.preventDefault();
            toggleInfoPanel();
        }
        
        // Ctrl/Cmd + Enter calculates GPA (when not in input field)
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (e.target.tagName !== 'INPUT') {
                e.preventDefault();
                calculateGPA();
            }
        }
        
        // Ctrl/Cmd + N adds new subject
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            if (e.target.tagName !== 'INPUT') {
                e.preventDefault();
                addSubject();
            }
        }
    });

    // ===== INITIALIZATION =====
    
    /**
     * Initialize the calculator with one subject entry
     * Provides immediate usability without requiring user action
     */
    function initializeCalculator() {
        // Do NOT add a subject by default
        // addSubject();  <-- REMOVE THIS LINE
        
        // Focus on first input for immediate interaction (not needed now)
        // setTimeout(() => {
        //     const firstGradeInput = document.querySelector('.grade-input');
        //     if (firstGradeInput) {
        //         firstGradeInput.focus();
        //     }
        // }, 300);
    }

    // ===== ADVANCED FEATURES =====
    
    /**
     * Calculates what GPA is needed in remaining hours to reach a target
     * @param {number} targetGPA - Desired cumulative GPA
     * @param {number} currentGPA - Current cumulative GPA
     * @param {number} currentHours - Current total hours
     * @param {number} remainingHours - Hours left to complete
     * @returns {number} Required GPA for remaining hours
     */
    function calculateRequiredGPA(targetGPA, currentGPA, currentHours, remainingHours) {
        const totalHoursNeeded = currentHours + remainingHours;
        const totalPointsNeeded = targetGPA * totalHoursNeeded;
        const currentPoints = currentGPA * currentHours;
        const pointsNeeded = totalPointsNeeded - currentPoints;
        
        return remainingHours > 0 ? pointsNeeded / remainingHours : 0;
    }

    /**
     * Provides GPA improvement suggestions based on current performance
     * @param {number} currentGPA - Current GPA
     * @returns {string} Suggestion message
     */
    function getGPASuggestion(currentGPA) {
        if (currentGPA >= 3.5) {
            return "Excellent work! Maintain your high standards.";
        } else if (currentGPA >= 3.0) {
            return "Good performance. Consider targeting higher grades to improve further.";
        } else if (currentGPA >= 2.0) {
            return "You're meeting minimum requirements. Focus on improvement strategies.";
        } else {
            return "Consider seeking academic support and reviewing study strategies.";
        }
    }

    // ===== ERROR HANDLING AND RECOVERY =====
    
    /**
     * Global error handler for graceful failure recovery
     */
    window.addEventListener('error', function(e) {
        console.error('GPA Calculator Error:', e.error);
        showResult("An unexpected error occurred. Please refresh and try again.", "error");
    });

    /**
     * Validates all form data before processing
     * @returns {boolean} True if all data is valid
     */
    function validateAllData() {
        const subjects = document.querySelectorAll('.subject');
        let isValid = true;

        subjects.forEach(subject => {
            const gradeInput = subject.querySelector('.grade-input');
            const hoursInput = subject.querySelector('.hours-input');
            
            if (!gradeInput.value || gradeInput.classList.contains('invalid')) {
                isValid = false;
            }
            if (!hoursInput.value || hoursInput.classList.contains('invalid')) {
                isValid = false;
            }
        });

        return isValid;
    }

    // ===== INFO PANEL LANGUAGE SWITCHING =====
    const infoContent = {
        en: {
            title: "GPA Calculator Information",
            about: `
                <h3><i class="fas fa-info-circle"></i> About This Calculator</h3>
                <p>This GPA calculator is specifically designed for Arab Open University (AOU) students. It helps you calculate both your semester GPA and cumulative GPA based on the university's grading system.</p>
                <p>The calculator uses the standard 4.0 scale and supports both English and Arabic interfaces for better accessibility.</p>
            `,
            grading: `
                <h3><i class="fas fa-graduation-cap"></i> Grading Scale</h3>
                <table class="grade-table">
                    <thead>
                        <tr>
                            <th>Letter Grade</th>
                            <th>Grade Points</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>A</td><td>4.0</td><td>90-100%</td></tr>
                        <tr><td>B+</td><td>3.5</td><td>82-89%</td></tr>
                        <tr><td>B</td><td>3.0</td><td>74-81%</td></tr>
                        <tr><td>C+</td><td>2.5</td><td>66-73%</td></tr>
                        <tr><td>C</td><td>2.0</td><td>58-65%</td></tr>
                        <tr><td>D</td><td>1.5</td><td>50-57%</td></tr>
                        <tr><td>F</td><td>0.0</td><td>Below 50%</td></tr>
                    </tbody>
                </table>
            `,
            faq: `
                <h3><i class="fas fa-question-circle"></i> Frequently Asked Questions</h3>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> How do I use this calculator?</div>
                <div class="faq-answer">1. Enter your previous GPA and total hours completed<br>2. Click "Add Subject" to add current semester courses<br>3. Enter the grade and credit hours for each subject<br>4. Click "Calculate" to see your semester and cumulative GPA</div></div>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> What if I don't have a previous GPA?</div>
                <div class="faq-answer">If this is your first semester, leave the previous GPA and hours fields empty or enter 0. The calculator will only compute your semester GPA.</div></div>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> Can I calculate GPA for multiple semesters?</div>
                <div class="faq-answer">Yes! Enter your cumulative GPA and total hours from all previous semesters, then add your current semester courses to get an updated cumulative GPA.</div></div>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> What grades are accepted?</div>
                <div class="faq-answer">The calculator accepts: A, B+, B, C+, C, D, F. Make sure to enter grades exactly as shown (case-insensitive).</div></div>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> Is my data saved or shared?</div>
                <div class="faq-answer">No, all calculations are performed locally in your browser. No data is saved, stored, or transmitted to any server.</div></div>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> What's the difference between Semester and Cumulative GPA?</div>
                <div class="faq-answer">Semester GPA is calculated only from current semester courses. Cumulative GPA includes all courses from all semesters combined.</div></div>
            `,
            tips: `
                <h3><i class="fas fa-lightbulb"></i> Tips for Success</h3>
                <p>• Double-check your grades and credit hours before calculating</p>
                <p>• Use this calculator to plan your future semester course loads</p>
            `
        },
        ar: {
            title: "معلومات حول حاسبة المعدل",
            about: `
                <h3><i class="fas fa-info-circle"></i> حول هذه الحاسبة</h3>
                <p>هذه الحاسبة مخصصة لطلاب الجامعة العربية المفتوحة. تساعدك في حساب المعدل الفصلي والمعدل التراكمي بناءً على نظام الدرجات في الجامعة.</p>
                <p>تستخدم الحاسبة مقياس 4.0 القياسي وتدعم اللغتين العربية والإنجليزية لسهولة الاستخدام.</p>
            `,
            grading: `
                <h3><i class="fas fa-graduation-cap"></i> سلم الدرجات</h3>
                <table class="grade-table">
                    <thead>
                        <tr>
                            <th>الدرجة</th>
                            <th>النقاط</th>
                            <th>النسبة المئوية</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>A</td><td>4.0</td><td>90-100%</td></tr>
                        <tr><td>B+</td><td>3.5</td><td>82-89%</td></tr>
                        <tr><td>B</td><td>3.0</td><td>74-81%</td></tr>
                        <tr><td>C+</td><td>2.5</td><td>66-73%</td></tr>
                        <tr><td>C</td><td>2.0</td><td>58-65%</td></tr>
                        <tr><td>D</td><td>1.5</td><td>50-57%</td></tr>
                        <tr><td>F</td><td>0.0</td><td>أقل من 50%</td></tr>
                    </tbody>
                </table>
            `,
            faq: `
                <h3><i class="fas fa-question-circle"></i> الأسئلة الشائعة</h3>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> كيف أستخدم هذه الحاسبة؟</div>
                <div class="faq-answer">1. أدخل المعدل السابق وعدد الساعات المكتملة<br>2. اضغط "أضف مادة" لإضافة مواد الفصل الحالي<br>3. أدخل الدرجة وعدد الساعات لكل مادة<br>4. اضغط "احسب" لعرض المعدل الفصلي والتراكمي</div></div>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> ماذا أفعل إذا لم يكن لدي معدل سابق؟</div>
                <div class="faq-answer">إذا كان هذا أول فصل لك، اترك حقول المعدل والساعات السابقة فارغة أو أدخل 0. سيتم حساب المعدل الفصلي فقط.</div></div>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> هل يمكنني حساب المعدل لأكثر من فصل؟</div>
                <div class="faq-answer">نعم! أدخل المعدل التراكمي وعدد الساعات لجميع الفصول السابقة، ثم أضف مواد الفصل الحالي للحصول على المعدل الجديد.</div></div>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> ما هي الدرجات المقبولة؟</div>
                <div class="faq-answer">الحاسبة تقبل: A, B+, B, C+, C, D, F. تأكد من إدخال الدرجات كما هي (غير حساسة لحالة الأحرف).</div></div>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> هل يتم حفظ أو مشاركة بياناتي؟</div>
                <div class="faq-answer">لا، جميع العمليات تتم محليًا في متصفحك ولا يتم حفظ أو إرسال أي بيانات.</div></div>
                <div class="faq-item"><div class="faq-question"><i class="fas fa-chevron-right"></i> ما الفرق بين المعدل الفصلي والتراكمي؟</div>
                <div class="faq-answer">المعدل الفصلي يحسب فقط من مواد الفصل الحالي. المعدل التراكمي يشمل جميع المواد من كل الفصول.</div></div>
            `,
            tips: `
                <h3><i class="fas fa-lightbulb"></i> نصائح للنجاح</h3>
                <p>• تحقق من الدرجات والساعات قبل الحساب</p>
                <p>• استخدم الحاسبة لتخطيط عبء المواد في الفصول القادمة</p>
            `
        }
    };

    let currentInfoLang = 'en';

    window.setInfoLang = function(lang) {
        currentInfoLang = lang;
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        document.getElementById('lang-ar').classList.toggle('active', lang === 'ar');
        document.getElementById('info-title').innerHTML = infoContent[lang].title;
        document.getElementById('about-section').innerHTML = infoContent[lang].about;
        document.getElementById('grading-section').innerHTML = infoContent[lang].grading;
        document.getElementById('faq-section').innerHTML = infoContent[lang].faq;
        document.getElementById('tips-section').innerHTML = infoContent[lang].tips;
        // Set direction only for content, not the whole modal
        const sections = ['info-title', 'about-section', 'grading-section', 'faq-section', 'tips-section'];
        sections.forEach(id => {
            document.getElementById(id).dir = (lang === 'ar') ? 'rtl' : 'ltr';
            document.getElementById(id).style.textAlign = (lang === 'ar') ? 'right' : 'left';
        });
    };

    // Show English by default when info panel opens
    const originalToggleInfoPanel = window.toggleInfoPanel;
    window.toggleInfoPanel = function() {
        originalToggleInfoPanel();
        if (document.getElementById('info-panel').classList.contains('active')) {
            setInfoLang(currentInfoLang);
        }
    };

    // ===== INITIALIZATION =====
    
    /**
     * Initialize the calculator with one subject entry
     * Provides immediate usability without requiring user action
     */
    function initializeCalculator() {
        // Do NOT add a subject by default
        // addSubject();  <-- REMOVE THIS LINE
        
        // Focus on first input for immediate interaction (not needed now)
        // setTimeout(() => {
        //     const firstGradeInput = document.querySelector('.grade-input');
        //     if (firstGradeInput) {
        //         firstGradeInput.focus();
        //     }
        // }, 300);
    }

    // Start the application
    initializeCalculator();
    
    // Log successful initialization (for debugging)
    console.log('GPA Calculator v2.0 initialized successfully');
});

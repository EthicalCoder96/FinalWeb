// script.js
let semesters = [];

function initializeSemesters() {
    const semNumber = document.getElementById('semNumber').value;
    if (semNumber < 1 || semNumber > 8) {
        alert("Please enter a valid number of semesters between 1 and 8.");
        return;
    }
    semesters = Array.from({ length: semNumber }, (_, i) => ({
        numberOfSubjects: 0,
        totalCredits: 0,
        data: [],
        SGPA: 0,
        semNumber: i + 1
    }));
    renderSemesters();
}

function renderSemesters() {
    const container = document.getElementById('semestersContainer');
    container.innerHTML = '';
    semesters.forEach((semester, index) => {
        const semesterDiv = document.createElement('div');
        semesterDiv.classList.add('semester');
        semesterDiv.innerHTML = `
            <h2>Semester ${semester.semNumber}</h2>
            <label for="credits${index}">Total Credits:</label>
            <input type="number" id="credits${index}" min="0" onchange="setCredits(${index}, this.value)">
            <label for="subjects${index}">Number of Subjects:</label>
            <input type="number" id="subjects${index}" min="1" onchange="setNumberOfSubjects(${index}, this.value)">
            <div id="subjectsContainer${index}"></div>
        `;
        container.appendChild(semesterDiv);
    });
}

function setCredits(index, value) {
    semesters[index].totalCredits = parseFloat(value);
}

function setNumberOfSubjects(index, value) {
    semesters[index].numberOfSubjects = parseInt(value);
    renderSubjects(index);
}

function renderSubjects(index) {
    const container = document.getElementById(`subjectsContainer${index}`);
    container.innerHTML = '';
    for (let i = 0; i < semesters[index].numberOfSubjects; i++) {
        const subjectDiv = document.createElement('div');
        subjectDiv.classList.add('subject');
        subjectDiv.innerHTML = `
            <h3>Subject ${i + 1}</h3>
            <label for="credits${index}-${i}">Credits:</label>
            <input type="number" id="credits${index}-${i}" min="0" onchange="setSubjectCredits(${index}, ${i}, this.value)">
            <label for="marks${index}-${i}">Marks (out of 100):</label>
            <input type="number" id="marks${index}-${i}" min="0" max="100" onchange="setSubjectMarks(${index}, ${i}, this.value)">
        `;
        container.appendChild(subjectDiv);
    }
}

function setSubjectCredits(semIndex, subIndex, value) {
    if (!semesters[semIndex].data[subIndex]) {
        semesters[semIndex].data[subIndex] = { credits: 0, marks: 0, gradePoints: 0 };
    }
    semesters[semIndex].data[subIndex].credits = parseFloat(value);
}

function setSubjectMarks(semIndex, subIndex, value) {
    if (!semesters[semIndex].data[subIndex]) {
        semesters[semIndex].data[subIndex] = { credits: 0, marks: 0, gradePoints: 0 };
    }
    const marks = parseFloat(value);
    semesters[semIndex].data[subIndex].marks = marks;
    semesters[semIndex].data[subIndex].gradePoints = getGradePoints(marks);
    calculateSGPA(semIndex);
}

function getGradePoints(total) {
    if (total >= 90 && total < 101) return 10.0;
    if (total >= 80 && total < 90) return 9.0;
    if (total >= 70 && total < 80) return 8.0;
    if (total >= 60 && total < 70) return 7.0;
    if (total >= 50 && total < 60) return 6.0;
    if (total >= 45 && total < 50) return 5.0;
    if (total >= 40 && total < 45) return 4.0;
    return 1.0;
}

function calculateSGPA(semIndex) {
    const semester = semesters[semIndex];
    let numerator = 0;
    semester.data.forEach(subject => {
        numerator += subject.credits * subject.gradePoints;
    });
    semester.SGPA = numerator / semester.totalCredits;
    displayResults();
}

function displayResults() {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    let totalCredits = 0;
    let weightedSGPA = 0;
    semesters.forEach(semester => {
        const sgpaDiv = document.createElement('div');
        sgpaDiv.innerHTML = `SGPA of Semester ${semester.semNumber}: ${semester.SGPA.toFixed(2)}`;
        container.appendChild(sgpaDiv);
        totalCredits += semester.totalCredits;
        weightedSGPA += semester.SGPA * semester.totalCredits;
    });
    const cgpa = weightedSGPA / totalCredits;
    const cgpaDiv = document.createElement('div');
    cgpaDiv.innerHTML = `Overall CGPA: ${cgpa.toFixed(2)}`;
    container.appendChild(cgpaDiv);
}

/* =========================================
   BRIGHT ENGLISH ACADEMY
   STUDENT PROGRESS SYSTEM
   Created by José Simeão
========================================= */


/* -----------------------------------------
   Get student data
----------------------------------------- */

function getStudentData() {

    const savedStudent =
        localStorage.getItem(
            "brightAcademyStudent"
        );

    if (!savedStudent) {
        return null;
    }

    try {

        return JSON.parse(
            savedStudent
        );

    } catch (error) {

        console.error(
            "Could not read student data.",
            error
        );

        return null;

    }

}


/* -----------------------------------------
   Save student data
----------------------------------------- */

function saveStudentData(student) {

    localStorage.setItem(
        "brightAcademyStudent",
        JSON.stringify(student)
    );

}


/* -----------------------------------------
   Complete a lesson
----------------------------------------- */

function completeLesson(lessonNumber) {

    const student =
        getStudentData();


    if (!student) {

        alert(
            "Create or login to a student account to save your progress."
        );

        return;

    }


    if (!Array.isArray(
        student.completedLessons
    )) {

        student.completedLessons = [];

    }


    if (!student.completedLessons.includes(
        lessonNumber
    )) {

        student.completedLessons.push(
            lessonNumber
        );

    }


    student.progress =
        Math.round(
            (
                student.completedLessons.length
                / 30
            ) * 100
        );


    saveStudentData(
        student
    );


    alert(
        "✅ Lesson " +
        lessonNumber +
        " completed!"
    );

}


/* -----------------------------------------
   Save exercise score
----------------------------------------- */

function saveScore(score) {

    const student =
        getStudentData();


    if (!student) {

        alert(
            "Please login as a student first."
        );

        return;

    }


    if (!Array.isArray(
        student.scores
    )) {

        student.scores = [];

    }


    student.scores.push(
        Number(score)
    );


    saveStudentData(
        student
    );


    alert(
        "📊 Score saved: " +
        score +
        "%"
    );

}


/* -----------------------------------------
   Get course progress
----------------------------------------- */

function getProgress() {

    const student =
        getStudentData();


    if (!student) {

        return 0;

    }


    const completed =
        Array.isArray(
            student.completedLessons
        )
        ? student.completedLessons.length
        : 0;


    return Math.round(
        (
            completed / 30
        ) * 100
    );

}


/* -----------------------------------------
   Check if lesson is completed
----------------------------------------- */

function isLessonCompleted(
    lessonNumber
) {

    const student =
        getStudentData();


    if (!student) {

        return false;

    }


    if (!Array.isArray(
        student.completedLessons
    )) {

        return false;

    }


    return student.completedLessons.includes(
        lessonNumber
    );

}


/* -----------------------------------------
   Open student dashboard
----------------------------------------- */

function openStudentDashboard() {

    const student =
        getStudentData();


    if (!student) {

        window.location.href =
            "student-register.html";

        return;

    }


    window.location.href =
        "student-dashboard.html";

}
/* =========================================
   BRIGHT ENGLISH ACADEMY
   STUDENT PROGRESS SYSTEM
   Created by José Simeão
========================================= */


/* -----------------------------------------
   Course settings
----------------------------------------- */

const TOTAL_LESSONS = 30;


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

        return JSON.parse(savedStudent);

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

    if (!student) {
        return false;
    }

    try {

        localStorage.setItem(
            "brightAcademyStudent",
            JSON.stringify(student)
        );

        return true;

    } catch (error) {

        console.error(
            "Could not save student data.",
            error
        );

        return false;

    }

}


/* -----------------------------------------
   Prepare student progress
----------------------------------------- */

function initializeStudentProgress(student) {

    if (!student) {
        return null;
    }

    if (!Array.isArray(
        student.completedLessons
    )) {

        student.completedLessons = [];

    }


    if (!student.lessonScores ||
        typeof student.lessonScores !== "object") {

        student.lessonScores = {};

    }


    if (!Array.isArray(
        student.scores
    )) {

        student.scores = [];

    }


    if (!Array.isArray(
        student.completedDates
    )) {

        student.completedDates = [];

    }


    student.progress =
        calculateProgress(
            student.completedLessons
        );


    return student;

}


/* -----------------------------------------
   Calculate progress
----------------------------------------- */

function calculateProgress(
    completedLessons
) {

    if (!Array.isArray(
        completedLessons
    )) {

        return 0;

    }


    const validLessons =
        completedLessons.filter(
            function (lesson) {

                return (
                    Number(lesson) >= 1 &&
                    Number(lesson) <= TOTAL_LESSONS
                );

            }
        );


    const uniqueLessons =
        [...new Set(
            validLessons.map(
                Number
            )
        )];


    return Math.min(
        100,
        Math.round(
            (
                uniqueLessons.length /
                TOTAL_LESSONS
            ) * 100
        )
    );

}


/* -----------------------------------------
   Complete a lesson
----------------------------------------- */

function completeLesson(
    lessonNumber
) {

    const student =
        getStudentData();


    if (!student) {

        alert(
            "Create or login to a student account to save your progress."
        );

        return false;

    }


    lessonNumber =
        Number(lessonNumber);


    if (
        lessonNumber < 1 ||
        lessonNumber > TOTAL_LESSONS
    ) {

        console.error(
            "Invalid lesson number."
        );

        return false;

    }


    initializeStudentProgress(
        student
    );


    if (
        !student.completedLessons.includes(
            lessonNumber
        )
    ) {

        student.completedLessons.push(
            lessonNumber
        );


        student.completedLessons.sort(
            function (a, b) {
                return a - b;
            }
        );


        student.completedDates.push({

            lesson:
                lessonNumber,

            date:
                new Date().toISOString()

        });

    }


    student.progress =
        calculateProgress(
            student.completedLessons
        );


    saveStudentData(
        student
    );


    alert(
        "✅ Lesson " +
        lessonNumber +
        " completed!\n\n" +
        "Course progress: " +
        student.progress +
        "%"
    );


    return true;

}


/* -----------------------------------------
   Save lesson score
----------------------------------------- */

function saveLessonScore(
    lessonNumber,
    score
) {

    const student =
        getStudentData();


    if (!student) {

        alert(
            "Please login as a student first."
        );

        return false;

    }


    lessonNumber =
        Number(lessonNumber);

    score =
        Number(score);


    if (
        lessonNumber < 1 ||
        lessonNumber > TOTAL_LESSONS
    ) {

        return false;

    }


    if (
        isNaN(score) ||
        score < 0 ||
        score > 100
    ) {

        alert(
            "Score must be between 0 and 100."
        );

        return false;

    }


    initializeStudentProgress(
        student
    );


    student.lessonScores[
        lessonNumber
    ] = score;


    student.scores.push({

        lesson:
            lessonNumber,

        score:
            score,

        date:
            new Date().toISOString()

    });


    saveStudentData(
        student
    );


    return true;

}


/* -----------------------------------------
   Save general exercise score
----------------------------------------- */

function saveScore(score) {

    const student =
        getStudentData();


    if (!student) {

        alert(
            "Please login as a student first."
        );

        return false;

    }


    score =
        Number(score);


    if (
        isNaN(score) ||
        score < 0 ||
        score > 100
    ) {

        alert(
            "Score must be between 0 and 100."
        );

        return false;

    }


    initializeStudentProgress(
        student
    );


    student.scores.push({

        score:
            score,

        date:
            new Date().toISOString()

    });


    saveStudentData(
        student
    );


    alert(
        "📊 Score saved: " +
        score +
        "%"
    );


    return true;

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


    return calculateProgress(
        student.completedLessons
    );

}


/* -----------------------------------------
   Get completed lessons
----------------------------------------- */

function getCompletedLessons() {

    const student =
        getStudentData();


    if (!student) {

        return [];

    }


    if (!Array.isArray(
        student.completedLessons
    )) {

        return [];

    }


    return [
        ...new Set(
            student.completedLessons
                .map(Number)
                .filter(
                    function (lesson) {

                        return (
                            lesson >= 1 &&
                            lesson <= TOTAL_LESSONS
                        );

                    }
                )
        )
    ].sort(
        function (a, b) {
            return a - b;
        }
    );

}


/* -----------------------------------------
   Check if lesson is completed
----------------------------------------- */

function isLessonCompleted(
    lessonNumber
) {

    lessonNumber =
        Number(lessonNumber);


    return getCompletedLessons()
        .includes(
            lessonNumber
        );

}


/* -----------------------------------------
   Get lesson score
----------------------------------------- */

function getLessonScore(
    lessonNumber
) {

    const student =
        getStudentData();


    if (
        !student ||
        !student.lessonScores
    ) {

        return null;

    }


    return student.lessonScores[
        Number(lessonNumber)
    ] ?? null;

}


/* -----------------------------------------
   Calculate average score
----------------------------------------- */

function getAverageScore() {

    const student =
        getStudentData();


    if (
        !student ||
        !Array.isArray(student.scores) ||
        student.scores.length === 0
    ) {

        return 0;

    }


    const scores =
        student.scores
            .map(function (item) {

                if (
                    typeof item === "object"
                ) {

                    return Number(
                        item.score
                    );

                }

                return Number(item);

            })
            .filter(function (score) {

                return (
                    !isNaN(score) &&
                    score >= 0 &&
                    score <= 100
                );

            });


    if (scores.length === 0) {

        return 0;

    }


    const total =
        scores.reduce(
            function (sum, score) {

                return sum + score;

            },
            0
        );


    return Math.round(
        total / scores.length
    );

}


/* -----------------------------------------
   Get next lesson
----------------------------------------- */

function getNextLesson() {

    const completed =
        getCompletedLessons();


    for (
        let lesson = 1;
        lesson <= TOTAL_LESSONS;
        lesson++
    ) {

        if (
            !completed.includes(
                lesson
            )
        ) {

            return lesson;

        }

    }


    return null;

}


/* -----------------------------------------
   Check if course is complete
----------------------------------------- */

function isCourseCompleted() {

    return (
        getCompletedLessons().length ===
        TOTAL_LESSONS
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


/* -----------------------------------------
   Initialize current student
----------------------------------------- */

function initializeProgressSystem() {

    const student =
        getStudentData();


    if (!student) {
        return;
    }


    initializeStudentProgress(
        student
    );


    saveStudentData(
        student
    );

}


/* -----------------------------------------
   Automatic initialization
----------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeProgressSystem();

    }
);

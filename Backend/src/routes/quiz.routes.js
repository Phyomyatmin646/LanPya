const express = require("express");
const router = express.Router({ mergeParams: true });
const { getQuizByLesson, createQuiz, addQuestion, submitAttempt, getAttempts } = require("../controllers/quiz.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.get("/lesson/:lessonId", protect, getQuizByLesson);
router.post("/lesson/:lessonId", protect, authorize("admin", "instructor"), createQuiz);
router.post("/:quizId/questions", protect, authorize("admin", "instructor"), addQuestion);
router.post("/:quizId/submit", protect, submitAttempt);
router.get("/:quizId/attempts", protect, getAttempts);

module.exports = router;

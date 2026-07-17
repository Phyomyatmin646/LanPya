const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Quiz = require("../models/quiz.model");
const QuizQuestion = require("../models/quizQuestion.model");
const QuizAttempt = require("../models/quizAttempt.model");

exports.getQuizByLesson = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ lesson_id: req.params.lessonId });
  if (!quiz) return res.status(404).json(ApiResponse.error("Quiz not found", 404));
  const questions = await QuizQuestion.find({ quiz_id: quiz._id }).select("-answer -explanation");
  res.status(200).json(ApiResponse.success({ quiz, questions }));
});

exports.createQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.create({ ...req.body, lesson_id: req.params.lessonId });
  res.status(201).json(ApiResponse.success(quiz, "Quiz created", 201));
});

exports.addQuestion = asyncHandler(async (req, res) => {
  const question = await QuizQuestion.create({ ...req.body, quiz_id: req.params.quizId });
  res.status(201).json(ApiResponse.success(question, "Question added", 201));
});

exports.submitAttempt = asyncHandler(async (req, res) => {
  const { answers } = req.body; // { questionId: "a" | "b" | "c" | "d" }
  const questions = await QuizQuestion.find({ quiz_id: req.params.quizId });
  let correct = 0;
  questions.forEach((q) => {
    if (answers[q._id.toString()] === q.answer) correct++;
  });
  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
  const attempt = await QuizAttempt.create({ quiz_id: req.params.quizId, user_id: req.user._id, score });
  res.status(201).json(ApiResponse.success({ attempt, correct, total: questions.length, score }, "Quiz submitted", 201));
});

exports.getAttempts = asyncHandler(async (req, res) => {
  const attempts = await QuizAttempt.find({ quiz_id: req.params.quizId, user_id: req.user._id }).sort({ attempted_at: -1 });
  res.status(200).json(ApiResponse.success(attempts));
});

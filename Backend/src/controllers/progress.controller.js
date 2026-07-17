const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const LessonProgress = require("../models/lessonProgress.model");
const Lesson = require("../models/lesson.model");
const Module = require("../models/module.model");
const roadmapService = require("../services/roadmap.service");
const LearningStreak = require("../models/learningStreak.model");

// @route   POST /api/v1/progress/:lessonId
exports.markLesson = asyncHandler(async (req, res) => {
  const { watch_time = 0, completed = false } = req.body;
  const lesson = await Lesson.findById(req.params.lessonId).populate("module_id");
  if (!lesson) return res.status(404).json(ApiResponse.error("Lesson not found", 404));

  const progress = await LessonProgress.findOneAndUpdate(
    { user_id: req.user._id, lesson_id: lesson._id },
    { watch_time, completed, ...(completed && { completed_at: new Date() }) },
    { upsert: true, new: true }
  );

  // Recalculate roadmap progress
  const roadmapId = lesson.module_id.roadmap_id;
  await roadmapService.recalculateProgress(req.user._id, roadmapId);

  // Update learning streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await LearningStreak.findOneAndUpdate(
    { user_id: req.user._id },
    { last_active_date: today, $inc: { current_streak: 1 } },
    { upsert: true }
  );

  res.status(200).json(ApiResponse.success(progress, "Progress saved"));
});

// @route   GET /api/v1/progress/roadmap/:roadmapId
exports.getRoadmapProgress = asyncHandler(async (req, res) => {
  const modules = await Module.find({ roadmap_id: req.params.roadmapId });
  const moduleIds = modules.map((m) => m._id);
  const lessons = await Lesson.find({ module_id: { $in: moduleIds } });
  const lessonIds = lessons.map((l) => l._id);
  const progressDocs = await LessonProgress.find({
    user_id: req.user._id,
    lesson_id: { $in: lessonIds },
  });
  res.status(200).json(ApiResponse.success({ lessons: lessons.length, progress: progressDocs }));
});

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Lesson = require("../models/lesson.model");
const LessonResource = require("../models/lessonResource.model");

exports.getByModule = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find({ module_id: req.params.moduleId }).sort({ lesson_order: 1 });
  res.status(200).json(ApiResponse.success(lessons));
});

exports.getById = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id).populate("module_id", "title roadmap_id");
  if (!lesson) return res.status(404).json(ApiResponse.error("Lesson not found", 404));
  const resources = await LessonResource.find({ lesson_id: lesson._id });
  res.status(200).json(ApiResponse.success({ lesson, resources }));
});

exports.create = asyncHandler(async (req, res) => {
  const lesson = await Lesson.create({ ...req.body, module_id: req.params.moduleId });
  res.status(201).json(ApiResponse.success(lesson, "Lesson created", 201));
});

exports.update = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!lesson) return res.status(404).json(ApiResponse.error("Lesson not found", 404));
  res.status(200).json(ApiResponse.success(lesson, "Lesson updated"));
});

exports.remove = asyncHandler(async (req, res) => {
  await Lesson.findByIdAndDelete(req.params.id);
  await LessonResource.deleteMany({ lesson_id: req.params.id });
  res.status(200).json(ApiResponse.success(null, "Lesson deleted"));
});

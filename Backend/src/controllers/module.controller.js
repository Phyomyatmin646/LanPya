const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Module = require("../models/module.model");
const Lesson = require("../models/lesson.model");

exports.getByRoadmap = asyncHandler(async (req, res) => {
  const modules = await Module.find({ roadmap_id: req.params.roadmapId }).sort({ module_order: 1 });
  res.status(200).json(ApiResponse.success(modules));
});

exports.create = asyncHandler(async (req, res) => {
  const module = await Module.create({ ...req.body, roadmap_id: req.params.roadmapId });
  res.status(201).json(ApiResponse.success(module, "Module created", 201));
});

exports.update = asyncHandler(async (req, res) => {
  const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!module) return res.status(404).json(ApiResponse.error("Module not found", 404));
  res.status(200).json(ApiResponse.success(module, "Module updated"));
});

exports.remove = asyncHandler(async (req, res) => {
  await Module.findByIdAndDelete(req.params.id);
  // Cascade delete lessons
  await Lesson.deleteMany({ module_id: req.params.id });
  res.status(200).json(ApiResponse.success(null, "Module and its lessons deleted"));
});

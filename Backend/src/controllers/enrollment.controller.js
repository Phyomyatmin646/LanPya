const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Enrollment = require("../models/enrollment.model");
const roadmapService = require("../services/roadmap.service");

// @route   POST /api/v1/enrollments/:roadmapId
exports.enroll = asyncHandler(async (req, res) => {
  const existing = await Enrollment.findOne({ user_id: req.user._id, roadmap_id: req.params.roadmapId });
  if (existing) return res.status(409).json(ApiResponse.error("Already enrolled", 409));
  const enrollment = await Enrollment.create({ user_id: req.user._id, roadmap_id: req.params.roadmapId });
  res.status(201).json(ApiResponse.success(enrollment, "Enrolled successfully", 201));
});

// @route   GET /api/v1/enrollments/my
exports.getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user_id: req.user._id })
    .populate("roadmap_id", "title thumbnail difficulty estimated_duration")
    .sort({ enrolled_at: -1 });
  res.status(200).json(ApiResponse.success(enrollments));
});

// @route   DELETE /api/v1/enrollments/:roadmapId
exports.unenroll = asyncHandler(async (req, res) => {
  await Enrollment.findOneAndDelete({ user_id: req.user._id, roadmap_id: req.params.roadmapId });
  res.status(200).json(ApiResponse.success(null, "Unenrolled successfully"));
});

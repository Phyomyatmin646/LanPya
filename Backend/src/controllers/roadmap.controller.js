const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const roadmapService = require("../services/roadmap.service");
const Roadmap = require("../models/roadmap.model");
const { getPagination, paginationMeta } = require("../utils/pagination");

exports.getAll = asyncHandler(async (req, res) => {
  const { page, limit } = getPagination(req.query);
  const { roadmaps, total } = await roadmapService.getAllRoadmaps({
    page, limit, search: req.query.search || "", difficulty: req.query.difficulty || "",
  });
  res.status(200).json(ApiResponse.paginated(roadmaps, paginationMeta(total, page, limit)));
});

exports.getById = asyncHandler(async (req, res) => {
  const roadmap = await roadmapService.getRoadmapById(req.params.id);
  res.status(200).json(ApiResponse.success(roadmap));
});

exports.create = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.create({ ...req.body, created_by: req.user._id });
  res.status(201).json(ApiResponse.success(roadmap, "Roadmap created", 201));
});

exports.update = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!roadmap) return res.status(404).json(ApiResponse.error("Roadmap not found", 404));
  res.status(200).json(ApiResponse.success(roadmap, "Roadmap updated"));
});

exports.remove = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findByIdAndDelete(req.params.id);
  if (!roadmap) return res.status(404).json(ApiResponse.error("Roadmap not found", 404));
  res.status(200).json(ApiResponse.success(null, "Roadmap deleted"));
});

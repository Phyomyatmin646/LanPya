const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const roadmapService = require("../services/roadmap.service");
const Roadmap = require("../models/roadmap.model");
const Module = require("../models/module.model");
const Lesson = require("../models/lesson.model");
const LessonResource = require("../models/lessonResource.model");
const Category = require("../models/category.model");
const Skill = require("../models/skill.model");
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

// ── Full roadmap with modules + lessons + resources ──────────────
exports.getFullRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findById(req.params.id)
    .populate("category_id", "name slug icon")
    .populate("created_by", "full_name username avatar")
    .lean();

  if (!roadmap) return res.status(404).json(ApiResponse.error("Roadmap not found", 404));

  const modules = await Module.find({ roadmap_id: roadmap._id }).sort({ module_order: 1 }).lean();

  const modulesWithLessons = await Promise.all(
    modules.map(async (mod) => {
      const lessons = await Lesson.find({ module_id: mod._id }).sort({ lesson_order: 1 }).lean();
      const lessonsWithResources = await Promise.all(
        lessons.map(async (lesson) => {
          const resources = await LessonResource.find({ lesson_id: lesson._id }).lean();
          return { ...lesson, resources };
        })
      );
      return { ...mod, lessons: lessonsWithResources };
    })
  );

  res.status(200).json(ApiResponse.success({ ...roadmap, modules: modulesWithLessons }, "Roadmap fetched with full detail"));
});

// ── All categories with their skills and roadmaps ────────────────
exports.getCategoriesWithRoadmaps = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();

  const result = await Promise.all(
    categories.map(async (cat) => {
      const skills = await Skill.find({ category_id: cat._id }).sort({ name: 1 }).lean();
      const skillsWithRoadmaps = await Promise.all(
        skills.map(async (skill) => {
          const roadmap = await Roadmap.findOne({ title: skill.name, is_public: true })
            .populate("category_id", "name icon")
            .lean();
          if (!roadmap) return { ...skill, roadmap: null };

          const modules = await Module.find({ roadmap_id: roadmap._id }).sort({ module_order: 1 }).lean();
          const modulesWithCount = await Promise.all(
            modules.map(async (mod) => {
              const lessonCount = await Lesson.countDocuments({ module_id: mod._id });
              return { ...mod, lesson_count: lessonCount };
            })
          );
          return { ...skill, roadmap: { ...roadmap, modules: modulesWithCount } };
        })
      );
      return { ...cat, skills: skillsWithRoadmaps };
    })
  );

  res.status(200).json(ApiResponse.success(result, "Categories with roadmaps fetched"));
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

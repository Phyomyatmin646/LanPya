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

// ── Save Custom AI Roadmap ──────────────────────────────────────────
exports.saveCustomRoadmap = asyncHandler(async (req, res) => {
  const { title, description, modules } = req.body;
  if (!title || !modules || !Array.isArray(modules)) {
    return res.status(400).json(ApiResponse.error("Invalid custom roadmap data", 400));
  }

  // Find a generic category or the first available category
  let category = await Category.findOne({ name: "AI Recommended" });
  if (!category) {
    category = await Category.findOne();
  }
  if (!category) {
    category = await Category.create({ name: "AI Recommended", slug: "ai-recommended", icon: "🤖", description: "AI generated paths" });
  }

  const roadmap = await Roadmap.create({
    category_id: category._id,
    created_by: req.user._id,
    title,
    description: description || "Custom AI Path",
    difficulty: "intermediate",
    is_public: false // User specific
  });

  const Quiz = require("../models/quiz.model");
  const QuizQuestion = require("../models/quizQuestion.model");
  const Enrollment = require("../models/enrollment.model");

  const modulePromises = modules.map(async (mod, mIdx) => {
    if (typeof mod === "string") {
      mod = { name: mod, tech: "" };
    }
    const module = await Module.create({
      roadmap_id: roadmap._id,
      title: mod.name || "Untitled Module",
      description: mod.tech || "",
      module_order: mIdx + 1
    });

    const lessonTitles = [
      `Introduction to ${mod.tech || mod.name}`,
      `Deep Dive into ${mod.tech || mod.name}`,
      `Building Projects with ${mod.tech || mod.name}`,
      `Advanced ${mod.tech || mod.name} Concepts`
    ];

    let lastLessonId = null;
    const lessonPromises = lessonTitles.map(async (lTitle, lIdx) => {
      const lesson = await Lesson.create({
        module_id: module._id,
        title: lTitle,
        lesson_order: lIdx + 1,
        estimated_minutes: 15
      });
      if (lIdx === lessonTitles.length - 1) lastLessonId = lesson._id;

      let videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(lTitle + ' tutorial')}`;
      try {
        const ytRes = await fetch(videoUrl);
        const ytText = await ytRes.text();
        const match = ytText.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
        if (match && match[1]) {
          videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
        }
      } catch (err) {
        console.error('Failed to fetch youtube video ID for', lTitle);
      }

      await LessonResource.create({
        lesson_id: lesson._id,
        title: 'Video Tutorial',
        type: 'video',
        url: videoUrl
      });
    });

    await Promise.all(lessonPromises);

    // Create a mock quiz for the last lesson of this module
    if (lastLessonId) {
      const quiz = await Quiz.create({
        lesson_id: lastLessonId,
        title: `${mod.name} Quiz`,
        passing_score: 50
      });
      
      await QuizQuestion.insertMany([
        {
          quiz_id: quiz._id,
          question: `What is the primary use case of the technologies discussed in ${mod.name}?`,
          option_a: 'To build modern applications',
          option_b: 'To process legacy data',
          option_c: 'To format text documents',
          option_d: 'None of the above',
          answer: 'a'
        },
        {
          quiz_id: quiz._id,
          question: `Which of the following is a best practice when working with ${mod.tech || mod.name}?`,
          option_a: 'Ignoring security guidelines',
          option_b: 'Writing modular and reusable components',
          option_c: 'Putting all logic in one file',
          option_d: 'Avoiding version control',
          answer: 'b'
        }
      ]);
    }
  });

  await Promise.all(modulePromises);

  // Enroll the user in this new custom roadmap
  await Enrollment.create({
    user_id: req.user._id,
    roadmap_id: roadmap._id,
    status: "enrolled"
  });

  res.status(201).json(ApiResponse.success(roadmap, "Custom AI Roadmap saved successfully", 201));
});

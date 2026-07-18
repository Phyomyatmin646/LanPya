const Roadmap = require("../models/roadmap.model");
const Enrollment = require("../models/enrollment.model");
const LessonProgress = require("../models/lessonProgress.model");
const Lesson = require("../models/lesson.model");
const Module = require("../models/module.model");
const User = require("../models/user.model");

exports.getAllRoadmaps = async ({ page = 1, limit = 10, search = "", difficulty = "" }) => {
  const query = { is_public: true };
  if (search) query.title = new RegExp(search, "i");
  if (difficulty) query.difficulty = difficulty;

  const skip = (page - 1) * limit;
  const [roadmaps, total] = await Promise.all([
    Roadmap.find(query)
      .populate("category_id", "name slug icon")
      .populate("created_by", "full_name avatar")
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 }),
    Roadmap.countDocuments(query),
  ]);
  return { roadmaps, total };
};

exports.getRoadmapById = async (id) => {
  const roadmap = await Roadmap.findById(id)
    .populate("category_id", "name slug icon")
    .populate("created_by", "full_name avatar");
  if (!roadmap) {
    const err = new Error("Roadmap not found");
    err.statusCode = 404;
    throw err;
  }
  return roadmap;
};

/**
 * Recalculate and update enrollment progress for a user in a roadmap
 */
exports.recalculateProgress = async (userId, roadmapId) => {
  const modules = await Module.find({ roadmap_id: roadmapId });
  const moduleIds = modules.map((m) => m._id);
  const lessons = await Lesson.find({ module_id: { $in: moduleIds } });
  const totalLessons = lessons.length;
  if (totalLessons === 0) return;

  const lessonIds = lessons.map((l) => l._id);
  const completed = await LessonProgress.countDocuments({
    user_id: userId,
    lesson_id: { $in: lessonIds },
    completed: true,
  });

  const existingEnrollment = await Enrollment.findOne({ user_id: userId, roadmap_id: roadmapId });
  const wasAlreadyCompleted = existingEnrollment?.status === "completed";

  const progress = Math.round((completed / totalLessons) * 100);
  const status = progress === 100 ? "completed" : progress > 0 ? "in_progress" : "enrolled";

  await Enrollment.findOneAndUpdate(
    { user_id: userId, roadmap_id: roadmapId },
    { progress, status, ...(status === "completed" && { completed_at: new Date() }) }
  );

  // Trigger n8n webhook if newly completed
  if (status === "completed" && !wasAlreadyCompleted) {
    try {
      const user = await User.findById(userId);
      const roadmap = await Roadmap.findById(roadmapId);
      if (user && roadmap) {
        fetch("http://n8n:5678/webhook/roadmap-completed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.full_name,
            roadmap_title: roadmap.title,
            completed_at: new Date().toISOString()
          })
        }).catch(err => console.error("Webhook trigger failed:", err.message));
      }
    } catch (error) {
      console.error("Error triggering completion webhook:", error);
    }
  }
};

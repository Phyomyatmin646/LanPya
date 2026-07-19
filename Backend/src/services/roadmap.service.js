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
        
        const longMessage = `Dear ${user.full_name},\n\nCongratulations on successfully completing the "${roadmap.title}" roadmap on LanPya! 🎉\n\nYour dedication, consistency, and passion for learning have truly paid off. We are thrilled to see you achieve this milestone. The skills you have gained will undoubtedly serve as a strong foundation for your future endeavors.\n\nKeep pushing boundaries and exploring new horizons. We can't wait to see what you achieve next!\n\nBest regards,\nThe LanPya Team`;
        
        const htmlMessage = `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #4F46E5;">Congratulations, ${user.full_name}! 🎉</h2>
            <p>We are absolutely thrilled to inform you that you have successfully completed the <strong>"${roadmap.title}"</strong> roadmap on LanPya.</p>
            <p>Your dedication, consistency, and passion for learning have truly paid off. We are incredibly proud to see you achieve this milestone. The skills you have gained throughout this journey will undoubtedly serve as a strong foundation for your future endeavors and career growth.</p>
            <p>Remember, learning is a continuous journey. Keep pushing boundaries, exploring new horizons, and building amazing things!</p>
            <br/>
            <p>We can't wait to see what you achieve next.</p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="font-size: 14px; color: #666;">Best regards,<br/><strong>The LanPya Team</strong></p>
          </div>
        `;

        fetch("http://n8n:5678/webhook/roadmap-completed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.full_name,
            roadmap_title: roadmap.title,
            completed_at: new Date().toISOString(),
            message: longMessage,
            html_message: htmlMessage
          })
        }).catch(err => console.error("Webhook trigger failed:", err.message));
      }
    } catch (error) {
      console.error("Error triggering completion webhook:", error);
    }
  }
};

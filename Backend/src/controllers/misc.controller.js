const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const aiService = require("../services/ai.service");
const Bookmark = require("../models/bookmark.model");
const Rating = require("../models/rating.model");
const Announcement = require("../models/announcement.model");
const Roadmap = require("../models/roadmap.model");
const Enrollment = require("../models/enrollment.model");
const LessonProgress = require("../models/lessonProgress.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

exports.getComments = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success([], "Comments fetched successfully"));
});

exports.addComment = asyncHandler(async (req, res) => {
  res.status(201).json(ApiResponse.success({ id: 1, ...req.body }, "Comment added", 201));
});

exports.deleteComment = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success(null, "Comment deleted"));
});

exports.getRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({ roadmap_id: req.params.roadmapId }).populate("user_id", "username");
  res.status(200).json(ApiResponse.success(ratings, "Ratings fetched successfully"));
});

exports.rateRoadmap = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;
  const newRating = await Rating.create({
    roadmap_id: req.params.roadmapId,
    user_id: req.user._id,
    rating,
    review
  });
  res.status(201).json(ApiResponse.success(newRating, "Rating submitted", 201));
});

exports.getMyBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user_id: req.user._id }).populate("lesson_id", "title description");
  res.status(200).json(ApiResponse.success(bookmarks, "Bookmarks fetched successfully"));
});

exports.addBookmark = asyncHandler(async (req, res) => {
  const bookmark = await Bookmark.create({
    user_id: req.user._id,
    lesson_id: req.params.lessonId
  });
  res.status(201).json(ApiResponse.success(bookmark, "Lesson bookmarked", 201));
});

exports.removeBookmark = asyncHandler(async (req, res) => {
  await Bookmark.findOneAndDelete({ user_id: req.user._id, lesson_id: req.params.lessonId });
  res.status(200).json(ApiResponse.success(null, "Bookmark removed"));
});

exports.getAnnouncements = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const announcements = await Announcement.find({ is_active: true }).sort({ created_at: -1 }).limit(limit);
  res.status(200).json(ApiResponse.success(announcements, "Announcements fetched successfully"));
});

exports.createAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.create({
    title: req.body.title,
    content: req.body.content,
    created_by: req.user._id
  });
  res.status(201).json(ApiResponse.success(announcement, "Announcement created", 201));
});

exports.search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const regex = new RegExp(q, "i");
  const roadmaps = await Roadmap.find({ $or: [{ title: regex }, { description: regex }] }).limit(10);
  res.status(200).json(ApiResponse.success({ roadmaps }, "Search results"));
});

exports.getAiRecommendations = asyncHandler(async (req, res) => {
  const prompt = `Based on a user interested in web development and AI, recommend 3 learning topics. Format as a JSON array of strings.`;
  const response = await aiService.chatWithAI(prompt);
  let topics = [];
  try {
    topics = JSON.parse(response);
  } catch (e) {
    topics = ["Web Development", "AI Basics", "Cloud Computing"];
  }
  res.status(200).json(ApiResponse.success({ recommended_topics: topics }, "AI Recommendations generated"));
});

exports.generateGuestAssessment = asyncHandler(async (req, res) => {
  const { goal, currentLevel, interests } = req.body;
  
  const prompt = `You are an expert technical learning advisor. A user has provided their learning profile:
  Goal: ${goal}
  Current Level: ${currentLevel}
  Interests: ${interests.join(", ")}
  
  Generate a personalized learning roadmap summary for this user. Output ONLY valid JSON in the following format:
  {
    "title": "A catchy title for their roadmap (e.g., Full Stack Master)",
    "description": "A short, encouraging 2-sentence description of what they will achieve.",
    "modules": [
      { "title": "Module 1 Name", "description": "Short desc" },
      { "title": "Module 2 Name", "description": "Short desc" }
    ]
  }
  Do not include markdown blocks or any other text. Return raw JSON.`;

  const aiResponse = await aiService.chatWithAI(prompt);
  
  let roadmapData;
  try {
    const cleanJsonStr = aiResponse.replace(/```json|```/g, "").trim();
    roadmapData = JSON.parse(cleanJsonStr);
  } catch (e) {
    // Fallback if parsing fails
    roadmapData = {
      title: "Custom Learning Path",
      description: "Based on your answers, we've crafted a unique path for you to achieve your goals.",
      modules: [
        { title: "Fundamentals", description: "Core concepts based on your level." },
        { title: "Advanced Topics", description: "Diving deeper into your interests." }
      ]
    };
  }

  res.status(200).json(ApiResponse.success({ roadmap: roadmapData }, "Guest roadmap generated successfully"));
});

// ── Trending Roadmaps (public) ────────────────────────────────
exports.getTrendingRoadmaps = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 6;

  const enrollmentCounts = await Enrollment.aggregate([
    { $group: { _id: "$roadmap_id", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);

  const roadmapIds = enrollmentCounts.map((e) => e._id);
  const countMap = {};
  enrollmentCounts.forEach((e) => { countMap[e._id.toString()] = e.count; });

  let roadmaps = [];
  if (roadmapIds.length > 0) {
    const found = await Roadmap.find({ _id: { $in: roadmapIds }, is_public: true })
      .populate("category_id", "name slug icon")
      .populate("created_by", "full_name avatar")
      .lean();
    roadmaps = found
      .map((r) => ({ ...r, enrollment_count: countMap[r._id.toString()] || 0 }))
      .sort((a, b) => b.enrollment_count - a.enrollment_count);
  }

  // Fallback: pad with newest public roadmaps if not enough
  if (roadmaps.length < limit) {
    const existingIds = roadmaps.map((r) => r._id.toString());
    const extra = await Roadmap.find({ is_public: true, _id: { $nin: roadmapIds } })
      .populate("category_id", "name slug icon")
      .populate("created_by", "full_name avatar")
      .sort({ created_at: -1 })
      .limit(limit - roadmaps.length)
      .lean();
    roadmaps = [...roadmaps, ...extra.map((r) => ({ ...r, enrollment_count: 0 }))];
  }

  res.status(200).json(ApiResponse.success(roadmaps, "Trending roadmaps"));
});

// ── Leaderboard (public) ──────────────────────────────────────
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;

  const ranked = await LessonProgress.aggregate([
    { $match: { completed: true } },
    { $group: { _id: "$user_id", completed_lessons: { $sum: 1 } } },
    { $sort: { completed_lessons: -1 } },
    { $limit: limit },
  ]);

  const userIds = ranked.map((r) => r._id);
  const users = await User.find({ _id: { $in: userIds } })
    .select("username full_name avatar")
    .lean();

  const userMap = {};
  users.forEach((u) => { userMap[u._id.toString()] = u; });

  const leaderboard = ranked.map((r, idx) => ({
    rank: idx + 1,
    completed_lessons: r.completed_lessons,
    ...(userMap[r._id.toString()] || { username: "learner", full_name: "LanPya Learner", avatar: "" }),
  }));

  res.status(200).json(ApiResponse.success(leaderboard, "Leaderboard fetched"));
});

// ── Guest Recommendations (public) ───────────────────────────
exports.getGuestRecommendations = asyncHandler(async (req, res) => {
  const { interests } = req.query;
  const limit = parseInt(req.query.limit, 10) || 6;

  let roadmaps = [];

  if (interests) {
    const keywords = interests.split(",").map((k) => k.trim()).filter(Boolean);
    const regexList = keywords.map((k) => new RegExp(k, "i"));

    roadmaps = await Roadmap.find({
      is_public: true,
      $or: [
        { title: { $in: regexList } },
        { description: { $in: regexList } },
      ],
    })
      .populate("category_id", "name slug icon")
      .populate("created_by", "full_name avatar")
      .limit(limit)
      .lean();
  }

  // Fallback: pad with newest public roadmaps if not enough matches
  if (roadmaps.length < limit) {
    const existingIds = roadmaps.map((r) => r._id);
    const extra = await Roadmap.find({ is_public: true, _id: { $nin: existingIds } })
      .populate("category_id", "name slug icon")
      .populate("created_by", "full_name avatar")
      .sort({ created_at: -1 })
      .limit(limit - roadmaps.length)
      .lean();
    roadmaps = [...roadmaps, ...extra];
  }

  res.status(200).json(ApiResponse.success(roadmaps, "Guest recommendations fetched"));
});

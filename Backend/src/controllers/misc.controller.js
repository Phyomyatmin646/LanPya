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
  const { topTracks } = req.body;
  
  // 1. RAG Context: Fetch available public roadmaps from the database
  const availableRoadmaps = await Roadmap.find({ is_public: true })
    .select("title description difficulty")
    .limit(20)
    .lean();
    
  const dbContext = availableRoadmaps.length > 0 
    ? `Available platform roadmaps for reference:\n${availableRoadmaps.map(r => `- ${r.title}: ${r.description} (${r.difficulty})`).join("\n")}`
    : "No existing roadmaps available yet. Generate generic ones.";

  const systemInstruction = `You are an expert technical learning advisor for the LanPya platform.
Your task is to recommend exactly 5 learning roadmaps based on the user's top tracked interests and the platform's available roadmaps.
The first roadmap should be the absolute best match (Top choice), and the remaining 4 should be optional alternative paths.

Output ONLY valid JSON containing an array of exactly 5 roadmap objects.
Format:
[
  {
    "title": "Roadmap Title",
    "description": "Short description of the path",
    "modules": [ "Module 1", "Module 2", "Module 3", "Module 4", "Module 5" ],
    "isTopMatch": true // ONLY true for the first one
  },
  ...
]`;

  const prompt = `User's Top Tracks/Interests: ${topTracks.join(", ")}
  
${dbContext}

Please generate the 5 roadmaps array now.`;

  let roadmapsArray = [];
  try {
    const aiResponse = await aiService.generateStructuredData(prompt, systemInstruction);
    
    // Sometimes local models still wrap in markdown despite format: "json"
    const cleanJsonStr = aiResponse.replace(/```json|```/g, "").trim();
    roadmapsArray = JSON.parse(cleanJsonStr);
    
    // Ensure it's an array of 5
    if (!Array.isArray(roadmapsArray)) roadmapsArray = [roadmapsArray];
    if (roadmapsArray.length > 5) roadmapsArray = roadmapsArray.slice(0, 5);
  } catch (e) {
    // Fallback if local AI fails or parsing fails
    roadmapsArray = [
      {
        title: `${topTracks[0] || "Custom"} Master Path`,
        description: "Your personalized top recommendation based on your quiz.",
        modules: ["Basics", "Intermediate Concepts", "Advanced Projects"],
        isTopMatch: true
      },
      { title: "Alternative Path 1", description: "Optional path", modules: ["Concept 1", "Concept 2"], isTopMatch: false },
      { title: "Alternative Path 2", description: "Optional path", modules: ["Concept 1", "Concept 2"], isTopMatch: false },
      { title: "Alternative Path 3", description: "Optional path", modules: ["Concept 1", "Concept 2"], isTopMatch: false },
      { title: "Alternative Path 4", description: "Optional path", modules: ["Concept 1", "Concept 2"], isTopMatch: false }
    ];
  }

  res.status(200).json(ApiResponse.success({ roadmaps: roadmapsArray }, "Guest roadmaps generated successfully"));
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

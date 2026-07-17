const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Comment = require("../models/comment.model");
const Rating = require("../models/rating.model");
const Bookmark = require("../models/bookmark.model");
const SearchHistory = require("../models/searchHistory.model");
const Announcement = require("../models/announcement.model");
const AiRecommendation = require("../models/aiRecommendation.model");
const Skill = require("../models/skill.model");

// ─── Comments ────────────────────────────────────────────────────
exports.getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ lesson_id: req.params.lessonId })
    .populate("user_id", "full_name avatar")
    .sort({ created_at: -1 });
  res.status(200).json(ApiResponse.success(comments));
});

exports.addComment = asyncHandler(async (req, res) => {
  const comment = await Comment.create({ lesson_id: req.params.lessonId, user_id: req.user._id, comment: req.body.comment });
  res.status(201).json(ApiResponse.success(comment, "Comment added", 201));
});

exports.deleteComment = asyncHandler(async (req, res) => {
  await Comment.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
  res.status(200).json(ApiResponse.success(null, "Comment deleted"));
});

// ─── Ratings ─────────────────────────────────────────────────────
exports.rateRoadmap = asyncHandler(async (req, res) => {
  const rating = await Rating.findOneAndUpdate(
    { roadmap_id: req.params.roadmapId, user_id: req.user._id },
    { rating: req.body.rating, review: req.body.review },
    { upsert: true, new: true }
  );
  res.status(200).json(ApiResponse.success(rating, "Rating saved"));
});

exports.getRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({ roadmap_id: req.params.roadmapId }).populate("user_id", "full_name avatar");
  res.status(200).json(ApiResponse.success(ratings));
});

// ─── Bookmarks ───────────────────────────────────────────────────
exports.addBookmark = asyncHandler(async (req, res) => {
  const bm = await Bookmark.findOneAndUpdate(
    { user_id: req.user._id, lesson_id: req.params.lessonId },
    {},
    { upsert: true, new: true }
  );
  res.status(200).json(ApiResponse.success(bm, "Bookmarked"));
});

exports.removeBookmark = asyncHandler(async (req, res) => {
  await Bookmark.findOneAndDelete({ user_id: req.user._id, lesson_id: req.params.lessonId });
  res.status(200).json(ApiResponse.success(null, "Bookmark removed"));
});

exports.getMyBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user_id: req.user._id }).populate("lesson_id", "title module_id");
  res.status(200).json(ApiResponse.success(bookmarks));
});

// ─── Announcements ───────────────────────────────────────────────
exports.getAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().populate("created_by", "full_name").sort({ created_at: -1 });
  res.status(200).json(ApiResponse.success(announcements));
});

exports.createAnnouncement = asyncHandler(async (req, res) => {
  const ann = await Announcement.create({ ...req.body, created_by: req.user._id });
  res.status(201).json(ApiResponse.success(ann, "Announcement created", 201));
});

// ─── Search ──────────────────────────────────────────────────────
exports.search = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json(ApiResponse.error("Search keyword required", 400));
  if (req.user) await SearchHistory.create({ user_id: req.user._id, keyword: q });
  const skills = await Skill.find({ name: new RegExp(q, "i") }).populate("category_id", "name");
  res.status(200).json(ApiResponse.success({ skills }));
});

// ─── AI Recommendations ──────────────────────────────────────────
exports.getAiRecommendations = asyncHandler(async (req, res) => {
  const recs = await AiRecommendation.find({ user_id: req.user._id })
    .populate("roadmap_id", "title thumbnail difficulty")
    .sort({ confidence: -1 });
  res.status(200).json(ApiResponse.success(recs));
});

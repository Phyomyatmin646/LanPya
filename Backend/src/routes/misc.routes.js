const express = require("express");
const router = express.Router();
const misc = require("../controllers/misc.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

// Comments
router.get("/comments/lesson/:lessonId", misc.getComments);
router.post("/comments/lesson/:lessonId", protect, misc.addComment);
router.delete("/comments/:id", protect, misc.deleteComment);

// Ratings
router.get("/ratings/roadmap/:roadmapId", misc.getRatings);
router.post("/ratings/roadmap/:roadmapId", protect, misc.rateRoadmap);

// Bookmarks
router.get("/bookmarks", protect, misc.getMyBookmarks);
router.post("/bookmarks/lesson/:lessonId", protect, misc.addBookmark);
router.delete("/bookmarks/lesson/:lessonId", protect, misc.removeBookmark);

// Announcements
router.get("/announcements", misc.getAnnouncements);
router.post("/announcements", protect, authorize("admin"), misc.createAnnouncement);

// Search
router.get("/search", misc.search);

// Guest AI Assessment (Public)
router.post("/guest-assessment", misc.generateGuestAssessment);

// AI Recommendations
router.get("/recommendations", protect, misc.getAiRecommendations);

module.exports = router;

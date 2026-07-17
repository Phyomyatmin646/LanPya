const express = require("express");
const router = express.Router();
const { markLesson, getRoadmapProgress } = require("../controllers/progress.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);
router.post("/lesson/:lessonId", markLesson);
router.get("/roadmap/:roadmapId", getRoadmapProgress);

module.exports = router;

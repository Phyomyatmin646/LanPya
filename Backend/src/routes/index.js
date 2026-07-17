const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const roadmapRoutes = require("./roadmap.routes");
const moduleRoutes = require("./module.routes");
const lessonRoutes = require("./lesson.routes");
const enrollmentRoutes = require("./enrollment.routes");
const progressRoutes = require("./progress.routes");
const quizRoutes = require("./quiz.routes");
const chatRoutes = require("./chat.routes");
const ragRoutes = require("./rag.routes");
const notificationRoutes = require("./notification.routes");
const miscRoutes = require("./misc.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/roadmaps", roadmapRoutes);
router.use("/roadmaps/:roadmapId/modules", moduleRoutes);
router.use("/modules/:moduleId/lessons", lessonRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/progress", progressRoutes);
router.use("/quizzes", quizRoutes);
router.use("/chat", chatRoutes);
router.use("/rag", ragRoutes);
router.use("/notifications", notificationRoutes);
router.use("/", miscRoutes);

module.exports = router;

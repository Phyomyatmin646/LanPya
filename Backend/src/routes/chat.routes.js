const express = require("express");
const router = express.Router();
const { createSession, getMySessions, getHistory, sendMessage, deleteSession, rateMessage } = require("../controllers/chat.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);
router.post("/sessions", createSession);
router.get("/sessions", getMySessions);
router.get("/sessions/:sessionId/history", getHistory);
router.post("/sessions/:sessionId/message", sendMessage);
router.post("/history/:id/feedback", rateMessage);
router.delete("/sessions/:sessionId", deleteSession);

module.exports = router;

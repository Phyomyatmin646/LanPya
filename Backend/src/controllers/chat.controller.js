const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ChatSession = require("../models/chatSession.model");
const ChatHistory = require("../models/chatHistory.model");
const aiService = require("../services/ai.service");

exports.createSession = asyncHandler(async (req, res) => {
  const session = await ChatSession.create({ user_id: req.user._id, title: req.body.title || "New Chat" });
  res.status(201).json(ApiResponse.success(session, "Chat session created", 201));
});

exports.getMySessions = asyncHandler(async (req, res) => {
  const sessions = await ChatSession.find({ user_id: req.user._id }).sort({ created_at: -1 });
  res.status(200).json(ApiResponse.success(sessions));
});

exports.getHistory = asyncHandler(async (req, res) => {
  const history = await ChatHistory.find({ session_id: req.params.sessionId }).sort({ created_at: 1 });
  res.status(200).json(ApiResponse.success(history));
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const session = await ChatSession.findOne({ _id: req.params.sessionId, user_id: req.user._id });
  if (!session) return res.status(404).json(ApiResponse.error("Chat session not found", 404));

  const history = await ChatHistory.find({ session_id: session._id }).sort({ created_at: 1 }).limit(20);
  const formattedHistory = history.flatMap((h) => [
    { role: "user", parts: [{ text: h.user_message }] },
    { role: "model", parts: [{ text: h.ai_response }] },
  ]);

  const aiResponse = await aiService.chatWithAI(message, formattedHistory);
  const chat = await ChatHistory.create({
    session_id: session._id,
    user_message: message,
    ai_response: aiResponse,
    model_name: "gemini-pro",
  });

  res.status(201).json(ApiResponse.success(chat, "Message sent", 201));
});

exports.deleteSession = asyncHandler(async (req, res) => {
  await ChatSession.findByIdAndDelete(req.params.sessionId);
  await ChatHistory.deleteMany({ session_id: req.params.sessionId });
  res.status(200).json(ApiResponse.success(null, "Session deleted"));
});

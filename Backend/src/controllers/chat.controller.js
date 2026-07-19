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

  // Setup SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Pass userId in context so AI tools can fetch user-specific data (e.g. progress)
  const context = { userId: req.user._id };

  try {
    const aiResponse = await aiService.chatWithAI(message, formattedHistory, context, res);
    
    // Auto-generate title for the first message if still "New Chat"
    let newTitle = session.title;
    if (session.title === "New Chat" && history.length === 0) {
      try {
        const titlePrompt = `Summarize this user message into a short 2-4 word title in Myanmar (or English if technical). Output ONLY a valid JSON object with a single key 'title'. Message: "${message}"`;
        // Use the existing generateStructuredData which enforces format: json
        const titleData = await aiService.generateStructuredData(titlePrompt, "You are a summarization AI. Output strictly in JSON format.");
        // We can parse if it returns JSON, or just use the string if we disable format: json. Let's just use it as string.
        // Actually, generateStructuredData expects JSON output. Let's write a quick inline fetch or let's just parse it if it wrapped it in JSON, or update aiService.
        let parsedTitle = "Chat Session";
        try {
          // generateStructuredData returns a JSON string since format="json"
          const parsed = typeof titleData === 'string' ? JSON.parse(titleData) : titleData;
          parsedTitle = parsed.title || parsedTitle;
        } catch(err) {
          parsedTitle = titleData;
        }
        console.log("Parsed generated title:", parsedTitle);
        // Clean out {thought...} or <think...> blocks just in case
        let cleanedTitle = typeof parsedTitle === 'string' ? parsedTitle.replace(/<[^>]*>/g, '').replace(/["']/g, '').trim() : "New Chat";
        if (!cleanedTitle || cleanedTitle === 'Chat Session') cleanedTitle = "New Chat";
        newTitle = cleanedTitle.substring(0, 30);
        await ChatSession.findByIdAndUpdate(session._id, { title: newTitle });
      } catch (e) {
        console.error("Failed to auto-generate title:", e);
      }
    }

    const chat = await ChatHistory.create({
      session_id: session._id,
      user_message: message,
      ai_response: aiResponse || "Sorry, I encountered an error and couldn't generate a response.",
      model_name: process.env.OLLAMA_MODEL || "gemma4:12b",
    });

    // Send final completion message with full chat data and updated title
    res.write(`data: ${JSON.stringify({ done: true, chat, title: newTitle })}\n\n`);
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
  } finally {
    res.end();
  }
});

exports.deleteSession = asyncHandler(async (req, res) => {
  await ChatSession.findByIdAndDelete(req.params.sessionId);
  await ChatHistory.deleteMany({ session_id: req.params.sessionId });
  res.status(200).json(ApiResponse.success(null, "Session deleted"));
});

exports.rateMessage = asyncHandler(async (req, res) => {
  const { feedback_rating, feedback_text } = req.body;
  const history = await ChatHistory.findById(req.params.id);
  
  if (!history) {
    return res.status(404).json(ApiResponse.error("Chat history not found", 404));
  }
  
  history.feedback_rating = feedback_rating;
  if (feedback_text) history.feedback_text = feedback_text;
  
  await history.save();
  res.status(200).json(ApiResponse.success(history, "Feedback saved successfully"));
});

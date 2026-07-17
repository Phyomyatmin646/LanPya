const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(
  {
    session_id: { type: mongoose.Schema.Types.ObjectId, ref: "ChatSession", required: true },
    user_message: { type: String, required: true },
    ai_response: { type: String, required: true },
    model_name: { type: String, default: "gemini-pro" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("ChatHistory", chatHistorySchema);

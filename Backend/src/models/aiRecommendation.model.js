const mongoose = require("mongoose");

const aiRecommendationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roadmap_id: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },
    reason: { type: String, default: "" },
    confidence: { type: Number, min: 0, max: 1, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("AiRecommendation", aiRecommendationSchema);

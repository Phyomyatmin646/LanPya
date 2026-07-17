const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    roadmap_id: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: "" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ratingSchema.index({ roadmap_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);

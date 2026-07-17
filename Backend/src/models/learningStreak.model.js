const mongoose = require("mongoose");

const learningStreakSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    current_streak: { type: Number, default: 0 },
    longest_streak: { type: Number, default: 0 },
    last_active_date: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningStreak", learningStreakSchema);

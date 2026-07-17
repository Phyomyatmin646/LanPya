const mongoose = require("mongoose");

const lessonProgressSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    watch_time: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    completed_at: { type: Date, default: null },
  },
  { timestamps: true }
);

lessonProgressSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });

module.exports = mongoose.model("LessonProgress", lessonProgressSchema);

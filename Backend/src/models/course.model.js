const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    provider: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    url: { type: String, required: true },
    duration: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    is_free: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);

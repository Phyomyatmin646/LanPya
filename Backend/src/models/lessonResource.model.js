const mongoose = require("mongoose");

const lessonResourceSchema = new mongoose.Schema(
  {
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["video", "article", "pdf", "link", "exercise"],
      required: true,
    },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LessonResource", lessonResourceSchema);

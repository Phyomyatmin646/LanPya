const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    module_id: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    content: { type: String, default: "" },
    lesson_order: { type: Number, default: 0 },
    estimated_minutes: { type: Number, default: 0 },
    is_preview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);

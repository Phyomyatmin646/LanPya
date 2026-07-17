const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

bookmarkSchema.index({ user_id: 1, lesson_id: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);

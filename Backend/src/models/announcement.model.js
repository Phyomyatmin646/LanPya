const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Announcement", announcementSchema);

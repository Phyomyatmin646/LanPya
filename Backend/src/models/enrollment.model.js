const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roadmap_id: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      enum: ["enrolled", "in_progress", "completed", "dropped"],
      default: "enrolled",
    },
    enrolled_at: { type: Date, default: Date.now },
    completed_at: { type: Date, default: null },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user_id: 1, roadmap_id: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);

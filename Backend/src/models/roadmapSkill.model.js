const mongoose = require("mongoose");

const roadmapSkillSchema = new mongoose.Schema(
  {
    roadmap_id: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },
    skill_id: { type: mongoose.Schema.Types.ObjectId, ref: "Skill", required: true },
    sequence: { type: Number, default: 0 },
  },
  { timestamps: true }
);

roadmapSkillSchema.index({ roadmap_id: 1, skill_id: 1 }, { unique: true });

module.exports = mongoose.model("RoadmapSkill", roadmapSkillSchema);

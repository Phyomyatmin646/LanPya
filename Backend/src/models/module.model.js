const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    roadmap_id: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    module_order: { type: Number, default: 0 },
    estimated_minutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);

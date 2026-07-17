const mongoose = require("mongoose");

const userSettingSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    language: { type: String, default: "en" },
    email_notification: { type: Boolean, default: true },
    ai_recommendation: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSetting", userSettingSchema);

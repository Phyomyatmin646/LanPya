const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password_hash: { type: String, required: true, select: false },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    learning_level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    preferred_language: { type: String, default: "en" },
    is_active: { type: Boolean, default: true },
    email_verified: { type: Boolean, default: false },
    reset_password_token: { type: String, select: false },
    reset_password_expires: { type: Date, select: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash")) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = mongoose.model("User", userSchema);

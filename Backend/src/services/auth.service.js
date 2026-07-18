const User = require("../models/user.model");
const UserSetting = require("../models/userSetting.model");
const LearningStreak = require("../models/learningStreak.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");

/**
 * Register a new user
 */
exports.registerUser = async ({ full_name, username, email, password, role_id }) => {
  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    const field = existing.email === email ? "Email" : "Username";
    const err = new Error(`${field} already in use`);
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ full_name, username, email, password_hash: password, role_id });

  // Create default settings and streak for new user
  await UserSetting.create({ user_id: user._id });
  await LearningStreak.create({ user_id: user._id });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return { user, accessToken, refreshToken };
};

/**
 * Login user with email and password
 */
exports.loginUser = async ({ email, password }) => {
  console.log("=== LOGIN DEBUG ===");
  console.log("Attempting login for email:", email);
  
  const user = await User.findOne({ email }).select("+password_hash").populate("role_id");
  console.log("User found in DB?", !!user);
  
  if (!user) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  console.log("Password match?", isMatch);
  
  if (!isMatch) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  return { user, accessToken, refreshToken };
};

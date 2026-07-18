const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const authService = require("../services/auth.service");
const emailService = require("../services/email.service");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const crypto = require("crypto");

// @route   POST /api/v1/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { full_name, username, email, password, role_name = "student" } = req.body;
  const role = await Role.findOne({ name: role_name });
  if (!role) return res.status(400).json(ApiResponse.error("Invalid role", 400));

  const { user, accessToken, refreshToken } = await authService.registerUser({
    full_name, username, email, password, role_id: role._id,
  });
  await emailService.sendWelcomeEmail(user).catch(() => {}); // non-blocking
  res.status(201).json(ApiResponse.success({ user, accessToken, refreshToken }, "Registered successfully", 201));
});

// @route   POST /api/v1/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email ? email.trim().toLowerCase() : email;
  const { user, accessToken, refreshToken } = await authService.loginUser({ email: normalizedEmail, password });
  res.status(200).json(ApiResponse.success({ user, accessToken, refreshToken }, "Login successful"));
});

// @route   GET /api/v1/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json(ApiResponse.success(req.user, "Profile fetched"));
});

// @route   POST /api/v1/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json(ApiResponse.error("No user with that email", 404));

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.reset_password_token = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.reset_password_expires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await emailService.sendPasswordResetEmail(user, resetUrl);
  res.status(200).json(ApiResponse.success(null, "Password reset email sent"));
});

// @route   POST /api/v1/auth/reset-password/:token
exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    reset_password_token: hashedToken,
    reset_password_expires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json(ApiResponse.error("Token invalid or expired", 400));

  user.password_hash = req.body.password;
  user.reset_password_token = undefined;
  user.reset_password_expires = undefined;
  await user.save();
  res.status(200).json(ApiResponse.success(null, "Password reset successful"));
});

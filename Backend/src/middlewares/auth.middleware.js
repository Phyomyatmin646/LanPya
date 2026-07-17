const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const User = require("../models/user.model");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json(ApiResponse.error("Not authorized, no token", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate("role_id").select("-password_hash");
    if (!req.user) {
      return res.status(401).json(ApiResponse.error("User no longer exists", 401));
    }
    next();
  } catch (err) {
    return res.status(401).json(ApiResponse.error("Not authorized, token failed", 401));
  }
});

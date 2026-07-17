const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const userService = require("../services/user.service");
const { getPagination, paginationMeta } = require("../utils/pagination");

// @route   GET /api/v1/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { users, total } = await userService.getAllUsers({ page, limit, search: req.query.search });
  res.status(200).json(ApiResponse.paginated(users, paginationMeta(total, page, limit)));
});

// @route   GET /api/v1/users/:id
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json(ApiResponse.error("User not found", 404));
  res.status(200).json(ApiResponse.success(user));
});

// @route   PUT /api/v1/users/:id
exports.updateUser = asyncHandler(async (req, res) => {
  const { password_hash, role_id, email, ...safeFields } = req.body;
  const user = await userService.updateUser(req.params.id, safeFields);
  res.status(200).json(ApiResponse.success(user, "User updated"));
});

// @route   DELETE /api/v1/users/:id
exports.deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(200).json(ApiResponse.success(null, "User deleted"));
});

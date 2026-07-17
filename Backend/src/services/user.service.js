const User = require("../models/user.model");

exports.getUserById = async (id) => {
  return await User.findById(id).populate("role_id", "name").select("-password_hash");
};

exports.updateUser = async (id, updateData) => {
  const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    .populate("role_id", "name")
    .select("-password_hash");
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

exports.getAllUsers = async ({ page = 1, limit = 10, search = "" }) => {
  const query = search
    ? { $or: [{ full_name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
    : {};
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query).populate("role_id", "name").select("-password_hash").skip(skip).limit(limit),
    User.countDocuments(query),
  ]);
  return { users, total };
};

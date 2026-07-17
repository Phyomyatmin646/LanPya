const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const Category = require("../models/category.model");

exports.getAll = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.status(200).json(ApiResponse.success(categories));
});

exports.getById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json(ApiResponse.error("Category not found", 404));
  res.status(200).json(ApiResponse.success(category));
});

exports.create = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(ApiResponse.success(category, "Category created", 201));
});

exports.update = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) return res.status(404).json(ApiResponse.error("Category not found", 404));
  res.status(200).json(ApiResponse.success(category, "Category updated"));
});

exports.remove = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json(ApiResponse.error("Category not found", 404));
  res.status(200).json(ApiResponse.success(null, "Category deleted"));
});

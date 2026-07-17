const { body } = require("express-validator");

exports.createRoadmapValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("category_id").notEmpty().withMessage("Category is required"),
  body("difficulty").isIn(["beginner", "intermediate", "advanced"]).withMessage("Invalid difficulty"),
];

exports.updateRoadmapValidation = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("difficulty").optional().isIn(["beginner", "intermediate", "advanced"]).withMessage("Invalid difficulty"),
];

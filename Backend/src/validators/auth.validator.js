const { body } = require("express-validator");

exports.registerValidation = [
  body("full_name").trim().notEmpty().withMessage("Full name is required"),
  body("username").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

exports.loginValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

exports.forgotPasswordValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
];

exports.resetPasswordValidation = [
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

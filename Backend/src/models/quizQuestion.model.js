const mongoose = require("mongoose");

const quizQuestionSchema = new mongoose.Schema(
  {
    quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    question: { type: String, required: true },
    option_a: { type: String, required: true },
    option_b: { type: String, required: true },
    option_c: { type: String, required: true },
    option_d: { type: String, required: true },
    answer: { type: String, enum: ["a", "b", "c", "d"], required: true },
    explanation: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizQuestion", quizQuestionSchema);

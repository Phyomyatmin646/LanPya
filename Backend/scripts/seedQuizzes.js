require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Lesson = require('../src/models/lesson.model');
const Quiz = require('../src/models/quiz.model');
const QuizQuestion = require('../src/models/quizQuestion.model');
const aiService = require('../src/services/ai.service');

const systemInstruction = `You are a strict technical quiz generator. 
Output ONLY valid JSON containing an array of exactly 3 multiple-choice questions based on the provided lesson title and description.
Format:
[
  {
    "question": "The question text",
    "options": {
      "a": "Option A text",
      "b": "Option B text",
      "c": "Option C text",
      "d": "Option D text"
    },
    "answer": "a", // Must be one of a, b, c, or d
    "explanation": "Why this is correct"
  }
]`;

const generateGenericQuiz = (title) => {
  return [
    {
      question: `What is the primary purpose of ${title}?`,
      options: {
        a: "To style web pages",
        b: `To solve problems related to ${title}`,
        c: "To manage databases",
        d: "To configure servers"
      },
      answer: "b",
      explanation: `The main goal is to understand and apply ${title} correctly.`
    },
    {
      question: `Which of the following is a key feature of ${title}?`,
      options: {
        a: "It is entirely hardware-based",
        b: "It requires no prior knowledge",
        c: `It provides specialized tools for ${title}`,
        d: "It replaces all programming languages"
      },
      answer: "c",
      explanation: "Key features are specifically designed for its domain."
    },
    {
      question: `When should you typically use ${title}?`,
      options: {
        a: "Never",
        b: "Only on mobile devices",
        c: `When building applications requiring ${title}`,
        d: "Only during the design phase"
      },
      answer: "c",
      explanation: "Use the right tool for the specific domain requirements."
    }
  ];
};

async function seedQuizzes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const lessons = await Lesson.find();
    console.log(`Found ${lessons.length} lessons. Clearing old quizzes...`);

    await Quiz.deleteMany({});
    await QuizQuestion.deleteMany({});

    let generatedCount = 0;

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      
      console.log(`[${i+1}/${lessons.length}] Generating quiz for: ${lesson.title}`);
      
      let questionsArray = [];
      try {
        const prompt = `Lesson Title: ${lesson.title}\nDescription: ${lesson.content || 'Basic concepts'}\nGenerate a 3-question quiz.`;
        
        const aiResponse = await aiService.generateStructuredData(prompt, systemInstruction);
        const cleanJsonStr = aiResponse.replace(/```json|```/g, "").trim();
        questionsArray = JSON.parse(cleanJsonStr);

        if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
          throw new Error("Invalid array");
        }
      } catch (err) {
        console.log(`AI generation failed or timed out for ${lesson.title}, using generic fallback. Error: ${err.message}`);
        questionsArray = generateGenericQuiz(lesson.title);
      }

      const quiz = await Quiz.create({
        lesson_id: lesson._id,
        title: `Quiz: ${lesson.title}`,
        passing_score: 60
      });

      for (const q of questionsArray) {
        await QuizQuestion.create({
          quiz_id: quiz._id,
          question: q.question,
          option_a: q.options.a,
          option_b: q.options.b,
          option_c: q.options.c,
          option_d: q.options.d,
          answer: q.answer,
          explanation: q.explanation || "Correct answer."
        });
      }

      generatedCount++;
    }

    console.log(`\nSuccess! Generated ${generatedCount} new quizzes.`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding quizzes:", error);
    process.exit(1);
  }
}

seedQuizzes();

const Roadmap = require("../models/roadmap.model");
const Enrollment = require("../models/enrollment.model");
const LessonProgress = require("../models/lessonProgress.model");
const Module = require("../models/module.model");
const Bookmark = require("../models/bookmark.model");
const User = require("../models/user.model");
const ragService = require("./rag.service");
const logger = require("../utils/logger");

// Define tools in standard JSON schema format compatible with Ollama/OpenAI
exports.toolDefinitions = [
  {
    type: "function",
    function: {
      name: "search_roadmaps",
      description: "Search for available learning roadmaps on the LanPya platform by keyword.",
      parameters: {
        type: "object",
        properties: {
          keyword: {
            type: "string",
            description: "The keyword to search for (e.g., 'web', 'AI', 'design')."
          }
        },
        required: ["keyword"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_roadmap_details",
      description: "Get detailed information about a specific roadmap, including its modules.",
      parameters: {
        type: "object",
        properties: {
          roadmap_id: {
            type: "string",
            description: "The unique ID of the roadmap."
          }
        },
        required: ["roadmap_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_my_progress",
      description: "Get the current user's learning progress and enrolled roadmaps.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "enroll_in_roadmap",
      description: "Enroll the current user into a specific roadmap.",
      parameters: {
        type: "object",
        properties: {
          roadmap_id: { type: "string", description: "The ID of the roadmap to enroll in." }
        },
        required: ["roadmap_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "add_bookmark",
      description: "Bookmark a specific lesson for the current user.",
      parameters: {
        type: "object",
        properties: {
          lesson_id: { type: "string", description: "The ID of the lesson to bookmark." }
        },
        required: ["lesson_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "update_profile",
      description: "Update the current user's profile information.",
      parameters: {
        type: "object",
        properties: {
          learning_level: { type: "string", enum: ["beginner", "intermediate", "advanced"], description: "The user's learning level" },
          preferred_language: { type: "string", description: "Preferred language code (e.g. 'my' for Myanmar, 'en' for English)" }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_knowledge_base",
      description: "Search the advanced RAG knowledge base for technical content, learning materials, and platform rules.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The search query." }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_detailed_learning_review",
      description: "Get a detailed review of the user's learning progress, including completed lessons, bookmarks, and overall roadmap stats.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  }
];

// Execute the requested tool and return the result as a string/JSON
exports.executeTool = async (name, args, context) => {
  logger.info(`[AI Tools] Executing tool ${name} with args:`, args);
  try {
    switch (name) {
      case "search_roadmaps": {
        const { keyword } = args;
        const roadmaps = await Roadmap.find({
          is_public: true,
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } }
          ]
        }).select("title description difficulty _id").limit(5).lean();
        
        if (roadmaps.length === 0) return JSON.stringify({ message: "No roadmaps found." });
        return JSON.stringify({ roadmaps });
      }
      
      case "get_roadmap_details": {
        const { roadmap_id } = args;
        const roadmap = await Roadmap.findById(roadmap_id).select("-__v").lean();
        if (!roadmap) return JSON.stringify({ error: "Roadmap not found." });
        
        const modules = await Module.find({ roadmap_id }).select("title description order").sort({ order: 1 }).lean();
        return JSON.stringify({ roadmap, modules });
      }
      
      case "get_my_progress": {
        const userId = context.userId;
        if (!userId) return JSON.stringify({ error: "User context not provided." });
        
        const enrollments = await Enrollment.find({ user_id: userId })
          .populate("roadmap_id", "title")
          .lean();
          
        if (enrollments.length === 0) return JSON.stringify({ message: "You are not enrolled in any roadmaps yet." });
        
        const progressSummary = enrollments.map(e => ({
          roadmap: e.roadmap_id?.title || "Unknown",
          progress: `${e.progress}%`,
          status: e.status
        }));
        
        return JSON.stringify({ enrollments: progressSummary });
      }

      case "get_detailed_learning_review": {
        const userId = context.userId;
        if (!userId) return JSON.stringify({ error: "User context not provided." });
        
        const enrollments = await Enrollment.find({ user_id: userId }).populate("roadmap_id", "title difficulty").lean();
        const completedLessons = await LessonProgress.find({ user_id: userId, completed: true }).populate("lesson_id", "title module_id").lean();
        const bookmarks = await Bookmark.find({ user_id: userId }).populate("lesson_id", "title").lean();
        
        if (enrollments.length === 0) return JSON.stringify({ message: "You haven't started any roadmaps yet." });
        
        const review = {
          active_roadmaps: enrollments.map(e => ({
            title: e.roadmap_id?.title || "Unknown",
            difficulty: e.roadmap_id?.difficulty || "beginner",
            progress_percent: e.progress,
            status: e.status
          })),
          total_completed_lessons: completedLessons.length,
          recently_completed: completedLessons.slice(-5).map(l => l.lesson_id?.title),
          total_bookmarks: bookmarks.length
        };
        
        return JSON.stringify({ learning_review: review });
      }

      case "enroll_in_roadmap": {
        const userId = context.userId;
        if (!userId) return JSON.stringify({ error: "User context not provided." });
        
        const { roadmap_id } = args;
        const exists = await Enrollment.findOne({ user_id: userId, roadmap_id });
        if (exists) return JSON.stringify({ message: "You are already enrolled in this roadmap." });
        
        await Enrollment.create({ user_id: userId, roadmap_id });
        return JSON.stringify({ success: true, message: "Successfully enrolled in the roadmap!" });
      }

      case "add_bookmark": {
        const userId = context.userId;
        if (!userId) return JSON.stringify({ error: "User context not provided." });
        
        const { lesson_id } = args;
        const exists = await Bookmark.findOne({ user_id: userId, lesson_id });
        if (exists) return JSON.stringify({ message: "Lesson is already bookmarked." });
        
        await Bookmark.create({ user_id: userId, lesson_id });
        return JSON.stringify({ success: true, message: "Lesson bookmarked successfully!" });
      }

      case "update_profile": {
        const userId = context.userId;
        if (!userId) return JSON.stringify({ error: "User context not provided." });
        
        const updateData = {};
        if (args.learning_level) updateData.learning_level = args.learning_level;
        if (args.preferred_language) updateData.preferred_language = args.preferred_language;
        
        if (Object.keys(updateData).length === 0) return JSON.stringify({ message: "No valid profile data provided to update." });
        
        await User.findByIdAndUpdate(userId, updateData);
        return JSON.stringify({ success: true, message: "Profile updated successfully!" });
      }

      case "search_knowledge_base": {
        const { query } = args;
        const chunks = await ragService.retrieveChunks(query, 3);
        if (chunks.length === 0) return JSON.stringify({ message: "No relevant knowledge found." });
        
        const contextData = chunks.map(c => c.chunk_text).join("\n\n---\n\n");
        return JSON.stringify({ retrieved_context: contextData });
      }
      
      default:
        return JSON.stringify({ error: `Unknown tool: ${name}` });
    }
  } catch (error) {
    logger.error(`[AI Tools] Error executing ${name}: ${error.message}`);
    return JSON.stringify({ error: `Failed to execute ${name}. Please try again.` });
  }
};

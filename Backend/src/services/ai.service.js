const logger = require("../utils/logger");

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const AI_MODEL = "gemma4:12b";

const { toolDefinitions, executeTool } = require("./ai.tools");

/**
 * Send a message to Local AI via Ollama and get a response (with Tool Calling support)
 * @param {string} userMessage
 * @param {Array} history - [{role: 'user'|'model', parts: [{text}]}]
 * @param {Object} context - Context object (e.g., userId)
 */
exports.chatWithAI = async (userMessage, history = [], context = {}, res = null) => {
  try {
    let systemPrompt = process.env.AI_SYSTEM_PROMPT || "You are a helpful AI.";
    if (!systemPrompt.includes('YouTube search links')) {
      systemPrompt += " - If the user asks about courses or lessons related to their roadmap or learning steps, recommend relevant courses by providing YouTube search links in this format: [Watch Course on YouTube](https://www.youtube.com/results?search_query=Learn+[Topic]+full+course).";
    }
    
    // Fetch recent negative feedbacks for this user to inject as "mistakes to avoid"
    const ChatHistory = require("../models/chatHistory.model");
    const badFeedbacks = await ChatHistory.find({ 
      session_id: { $in: await require("../models/chatSession.model").find({ user_id: context.userId }).distinct("_id") },
      feedback_rating: -1 
    }).sort({ created_at: -1 }).limit(3).lean();
    
    let learningContext = "";
    if (badFeedbacks.length > 0) {
      learningContext = "\n\nPAST MISTAKES TO AVOID based on user feedback:\n" + 
        badFeedbacks.map(f => `- You said: "${f.ai_response.substring(0, 50)}..." which the user disliked.`).join("\n");
    }

    // Intercept exact FAQs to skip model tool evaluation roundtrips
    let preExecutedToolContext = "";
    if (userMessage === "ကျွန်တော် ဘာ course တွေ တက်နေလဲ?") {
      const toolRes = await executeTool("get_my_progress", {}, context);
      preExecutedToolContext = `\nSystem context from 'get_my_progress' tool: ${toolRes}\nUse this data to answer the user.`;
    } else if (userMessage === "Web Development roadmap တွေ ဘာရှိလဲရှာပေးပါ") {
      const toolRes = await executeTool("search_roadmaps", { keyword: "Web" }, context);
      preExecutedToolContext = `\nSystem context from 'search_roadmaps' tool: ${toolRes}\nUse this data to answer the user.`;
    } else if (userMessage === "ကျွန်တော် မှတ်ထားတဲ့ lesson တွေ ပြပေးပါ") {
      const toolRes = await executeTool("get_detailed_learning_review", {}, context);
      preExecutedToolContext = `\nSystem context from 'get_detailed_learning_review' tool: ${toolRes}\nUse this data to answer the user regarding bookmarks.`;
    } else if (userMessage === "နောက်တက်ရမယ့်သင်ခန်းစာ အကြံပေးပါ") {
      const toolRes = await executeTool("get_detailed_learning_review", {}, context);
      preExecutedToolContext = `\nSystem context from 'get_detailed_learning_review' tool: ${toolRes}\nUse this data to suggest next lessons.`;
    } else if (userMessage === "ဒီ Website ကို ဘယ်လိုအသုံးပြုရမလဲ?") {
      const toolRes = await executeTool("search_knowledge_base", { query: "How to use LanPya website" }, context);
      preExecutedToolContext = `\nSystem context from 'search_knowledge_base' tool: ${toolRes}\nUse this data to answer the user.`;
    }

    const messages = [
      { role: "system", content: systemPrompt + learningContext + preExecutedToolContext }
    ];
    
    history.forEach(h => {
      messages.push({
        role: h.role === 'model' ? 'assistant' : 'user',
        content: h.parts[0].text
      });
    });
    
    messages.push({ role: "user", content: userMessage });

    // Only enable tools if we didn't pre-execute an FAQ tool
    const enableTools = process.env.AI_ENABLE_TOOLS === 'true' && !preExecutedToolContext;

    // Loop for tool calls (max 3 iterations to prevent infinite loops)
    let iteration = 0;
    while (iteration < 3) {
      const payload = {
        model: process.env.OLLAMA_MODEL || AI_MODEL,
        messages: messages,
        stream: true,
        options: {
          num_ctx: 1024, // Greatly reduced context for speed
          num_predict: 256, // Limit output length
          num_thread: 8, // Maximize CPU threads
          temperature: 0.6 // Slightly lower temperature for faster, more deterministic generation
        }
      };
      
      if (enableTools) {
        payload.tools = toolDefinitions;
      }

      const response = await fetch(`${process.env.OLLAMA_BASE_URL || OLLAMA_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      let fullContent = "";
      let toolCalls = [];

      // Node.js native fetch streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message) {
              if (data.message.tool_calls) {
                // Ollama tool calls usually come in a single chunk at the end
                toolCalls = data.message.tool_calls;
              }
              if (data.message.content) {
                fullContent += data.message.content;
                // Only stream if there are no tool calls detected yet
                if (res && toolCalls.length === 0) {
                  // If it's the first text chunk, we might want to log it, but for SSE we just write
                  res.write(`data: ${JSON.stringify({ content: data.message.content })}\n\n`);
                }
              }
            }
          } catch (e) {
            // Ignore parse errors for incomplete chunks
          }
        }
      }

      if (toolCalls && toolCalls.length > 0) {
        logger.info(`[AI Service] Model requested ${toolCalls.length} tool calls.`);
        messages.push({
          role: "assistant",
          content: fullContent,
          tool_calls: toolCalls
        });

        // Execute all requested tools
        for (const toolCall of toolCalls) {
          const toolName = toolCall.function.name;
          const toolArgs = toolCall.function.arguments;
          
          const toolResult = await executeTool(toolName, toolArgs, context);
          
          messages.push({
            role: "tool",
            content: toolResult,
            name: toolName 
          });
        }
        iteration++;
        continue; // Loop back to send tool results to model
      } else {
        // No more tool calls, we are done
        messages.push({ role: "assistant", content: fullContent });
        return fullContent;
      }
    }
    
    return messages[messages.length - 1].content || "I needed to think too long. Please try again.";
  } catch (error) {
    logger.error(`[AI Service] Chat Error: ${error.message}`);
    throw error;
  }
};

/**
 * Generate AI-based recommendations or structured JSON
 */
exports.generateStructuredData = async (prompt, systemInstruction = "") => {
  try {
    const baseUrl = process.env.OLLAMA_BASE_URL || OLLAMA_URL;
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: AI_MODEL,
        prompt: prompt,
        system: systemInstruction,
        stream: false,
        format: "json"
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    logger.error(`[AI Service] Generate Error: ${error.message}`);
    throw error;
  }
};

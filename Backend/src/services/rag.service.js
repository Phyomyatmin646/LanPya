const RagDocument = require("../models/ragDocument.model");
const RagChunk = require("../models/ragChunk.model");
const logger = require("../utils/logger");

/**
 * Save a document and its chunks to MongoDB
 */
exports.saveDocument = async ({ title, source, document_type, file_url, uploaded_by, chunks }) => {
  const doc = await RagDocument.create({
    title,
    source,
    document_type,
    file_url,
    uploaded_by,
    chunk_count: chunks.length,
    embedding_model: "text-embedding-004",
  });

  const chunkDocs = chunks.map((chunk, i) => ({
    document_id: doc._id,
    chunk_text: chunk.text,
    embedding_id: chunk.embeddingId || "",
    chunk_order: i,
  }));
  await RagChunk.insertMany(chunkDocs);
  logger.info(`[RAG] Saved document "${title}" with ${chunks.length} chunks`);
  return doc;
};

/**
 * Retrieve chunks by keyword (basic text search)
 * TODO: Replace with vector similarity search (e.g., MongoDB Atlas Vector Search)
 */
exports.retrieveChunks = async (query, limit = 5) => {
  return await RagChunk.find({ chunk_text: new RegExp(query, "i") })
    .limit(limit)
    .populate("document_id", "title source");
};

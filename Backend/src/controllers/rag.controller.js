const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const RagDocument = require("../models/ragDocument.model");
const RagChunk = require("../models/ragChunk.model");
const ragService = require("../services/rag.service");

exports.getDocuments = asyncHandler(async (req, res) => {
  const docs = await RagDocument.find().populate("uploaded_by", "full_name").sort({ created_at: -1 });
  res.status(200).json(ApiResponse.success(docs));
});

exports.uploadDocument = asyncHandler(async (req, res) => {
  const { title, source, document_type } = req.body;
  // TODO: process file from req.file, split into chunks, generate embeddings
  const doc = await ragService.saveDocument({
    title, source, document_type,
    file_url: req.file ? req.file.originalname : "",
    uploaded_by: req.user._id,
    chunks: [{ text: req.body.sample_text || "Sample chunk" }],
  });
  res.status(201).json(ApiResponse.success(doc, "Document uploaded", 201));
});

exports.queryRAG = asyncHandler(async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json(ApiResponse.error("Query is required", 400));
  const chunks = await ragService.retrieveChunks(query);
  res.status(200).json(ApiResponse.success(chunks));
});

exports.deleteDocument = asyncHandler(async (req, res) => {
  await RagDocument.findByIdAndDelete(req.params.id);
  await RagChunk.deleteMany({ document_id: req.params.id });
  res.status(200).json(ApiResponse.success(null, "Document deleted"));
});

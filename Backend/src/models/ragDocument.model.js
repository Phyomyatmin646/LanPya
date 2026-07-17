const mongoose = require("mongoose");

const ragDocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    source: { type: String, default: "" },
    document_type: {
      type: String,
      enum: ["pdf", "markdown", "text", "web", "docx"],
      required: true,
    },
    file_url: { type: String, default: "" },
    chunk_count: { type: Number, default: 0 },
    embedding_model: { type: String, default: "text-embedding-004" },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("RagDocument", ragDocumentSchema);

const mongoose = require("mongoose");

const ragChunkSchema = new mongoose.Schema(
  {
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: "RagDocument", required: true },
    chunk_text: { type: String, required: true },
    embedding_id: { type: String, default: "" },
    chunk_order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RagChunk", ragChunkSchema);

const express = require("express");
const router = express.Router();
const { getDocuments, uploadDocument, queryRAG, deleteDocument } = require("../controllers/rag.controller");
const { protect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

router.use(protect);
router.get("/", authorize("admin"), getDocuments);
router.post("/upload", authorize("admin"), upload.single("file"), uploadDocument);
router.post("/query", queryRAG);
router.delete("/:id", authorize("admin"), deleteDocument);

module.exports = router;

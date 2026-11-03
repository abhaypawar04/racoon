const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  uploadDocument,
  getDocuments,
  getDocumentChunks,
  generateDocumentEmbeddings,
} = require("../controllers/documentController");

router.post("/upload", upload.single("pdf"), uploadDocument);

router.get("/", getDocuments);

router.get("/:documentId/chunks", getDocumentChunks);
router.post("/:documentId/embed", generateDocumentEmbeddings);
module.exports = router;
// demo v23 v24 v35

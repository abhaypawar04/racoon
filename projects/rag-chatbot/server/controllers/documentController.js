const fs = require("fs");
const pdfParse = require("pdf-parse");
const generateEmbedding = require("../services/embeddingService");

const Document = require("../models/Document");
const DocumentChunk = require("../models/DocumentChunk");
const chunkText = require("../services/chunkService");

// Upload, extract and chunk PDF
exports.uploadDocument = async (req, res) => {
  const uploadedFile = req.file;

  try {
    if (!uploadedFile) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    // 1. Read PDF
    const pdfBuffer = fs.readFileSync(uploadedFile.path);

    // 2. Extract text
    const pdfData = await pdfParse(pdfBuffer);

    if (!pdfData.text.trim()) {
      throw new Error("No readable text found in PDF");
    }

    // 3. Save document
    const document = await Document.create({
      originalName: uploadedFile.originalname,
      filename: uploadedFile.filename,
      filePath: uploadedFile.path,
      fileSize: uploadedFile.size,
      extractedText: pdfData.text,
      pageCount: pdfData.numpages,
      status: "processed",
    });

    // 4. Divide text into chunks
    const chunks = chunkText(pdfData.text, 500, 100);

    // 5. Save chunks in MongoDB
    const chunkDocuments = chunks.map((chunk) => ({
      documentId: document._id,
      chunkIndex: chunk.chunkIndex,
      content: chunk.content,
    }));

    await DocumentChunk.insertMany(chunkDocuments);

    // 6. Send response
    res.status(201).json({
      success: true,
      message: "PDF uploaded and chunked successfully",
      document: {
        id: document._id,
        name: document.originalName,
        pages: document.pageCount,
        status: document.status,
      },
      chunkCount: chunks.length,
    });
  } catch (error) {
    console.error("PDF processing error:", error.message);

    if (uploadedFile && fs.existsSync(uploadedFile.path)) {
      fs.unlinkSync(uploadedFile.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || "PDF processing failed",
    });
  }
};

// Get uploaded documents
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .select("-extractedText")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get chunks for a document
exports.getDocumentChunks = async (req, res) => {
  try {
    const chunks = await DocumentChunk.find({
      documentId: req.params.documentId,
    }).sort({ chunkIndex: 1 });

    res.json({
      success: true,
      totalChunks: chunks.length,
      chunks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate embeddings for existing document chunks
exports.generateDocumentEmbeddings = async (req, res) => {
  try {
    const { documentId } = req.params;

    const chunks = await DocumentChunk.find({
      documentId,
      embedding: { $size: 0 },
    }).sort({ chunkIndex: 1 });

    if (chunks.length === 0) {
      return res.json({
        success: true,
        message: "No chunks need embeddings",
        processed: 0,
      });
    }

    let processed = 0;

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk.content);

      chunk.embedding = embedding;
      await chunk.save();

      processed++;
    }

    res.json({
      success: true,
      message: "Embeddings generated successfully",
      processed,
      dimensions: 768,
    });
  } catch (error) {
    console.error("Embedding error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

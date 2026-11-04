const generateEmbedding = require("./embeddingService");
const DocumentChunk = require("../models/DocumentChunk");

// Calculate cosine similarity
const cosineSimilarity = (vectorA, vectorB) => {
  if (
    !Array.isArray(vectorA) ||
    !Array.isArray(vectorB) ||
    vectorA.length === 0 ||
    vectorA.length !== vectorB.length
  ) {
    return 0;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] ** 2;
    magnitudeB += vectorB[i] ** 2;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

// Find relevant PDF chunks
const retrieveRelevantChunks = async (question, documentId, limit = 3) => {
  // Generate embedding for the question
  const questionEmbedding = await generateEmbedding(question);

  if (!Array.isArray(questionEmbedding) || questionEmbedding.length === 0) {
    throw new Error("Question embedding could not be generated.");
  }

  // Find document chunks with embeddings
  const chunks = await DocumentChunk.find({
    documentId,
    embedding: { $exists: true, $ne: [] },
  });

  console.log("Document ID:", documentId);
  console.log("Question embedding dimensions:", questionEmbedding.length);
  console.log("Chunks found:", chunks.length);

  if (chunks.length === 0) {
    console.log("No embedded chunks found for this document.");
    return [];
  }

  // Calculate similarity scores
  const results = chunks
    .map((chunk) => ({
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
      score: cosineSimilarity(questionEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score);

  // Log scores without printing private PDF content
  console.log(
    "Similarity scores:",
    results.map((item) => ({
      chunkIndex: item.chunkIndex,
      score: Number(item.score.toFixed(4)),
    })),
  );

  return results.slice(0, limit);
};

module.exports = retrieveRelevantChunks;

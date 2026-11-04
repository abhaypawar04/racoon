const axios = require("axios");
const retrieveRelevantChunks = require("../services/retrievalService");

// Generate an answer using Llama 3.1
exports.askQuestion = async (req, res) => {
  try {
    const { question, documentId } = req.body;

    if (!question || !documentId) {
      return res.status(400).json({
        success: false,
        message: "Question and documentId are required",
      });
    }

    // Step 1: Retrieve relevant PDF chunks
    const relevantChunks = await retrieveRelevantChunks(
      question,
      documentId,
      3,
    );

    if (relevantChunks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No relevant PDF content found",
      });
    }

    // Step 2: Prepare PDF context
    const context = relevantChunks.map((chunk) => chunk.content).join("\n\n");

    // Step 3: Ask Llama 3.1
    const response = await axios.post("http://127.0.0.1:11434/api/generate", {
      model: "llama3.1:8b",
      prompt: `
You are a helpful PDF assistant.

Answer the question using ONLY the provided PDF context.

If the answer is not available in the context, say:
"I could not find this information in the uploaded PDF."

PDF CONTEXT:
${context}

QUESTION:
${question}

ANSWER:
        `,
      stream: false,
    });

    // Step 4: Return AI answer
    res.json({
      success: true,
      question,
      answer: response.data.response,
      sources: relevantChunks.map((chunk) => ({
        chunkIndex: chunk.chunkIndex,
        score: chunk.score,
      })),
    });
  } catch (error) {
    console.error("RAG error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

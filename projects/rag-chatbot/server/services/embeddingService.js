const axios = require("axios");

const generateEmbedding = async (text) => {
  try {
    const response = await axios.post("http://127.0.0.1:11434/api/embed", {
      model: "nomic-embed-text",
      input: text,
    });

    const embedding = response.data.embeddings[0];

    if (!embedding || !Array.isArray(embedding)) {
      throw new Error("Invalid embedding response from Ollama");
    }

    return embedding;
  } catch (error) {
    console.error(
      "Embedding generation failed:",
      error.response?.data || error.message,
    );

    throw error;
  }
};

module.exports = generateEmbedding;

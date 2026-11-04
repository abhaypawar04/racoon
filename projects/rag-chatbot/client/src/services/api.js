import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Upload PDF
export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await API.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Get uploaded documents
export const getDocuments = async () => {
  const response = await API.get("/documents");
  return response.data;
};

// Ask a question
export const askQuestion = async (question, documentId) => {
  const response = await API.post("/rag/ask", {
    question,
    documentId,
  });

  return response.data;
};

// Generate embeddings for uploaded PDF
export const generateEmbeddings = async (documentId) => {
  const response = await API.post(`/documents/${documentId}/embed`);
  return response.data;
};

export default API;

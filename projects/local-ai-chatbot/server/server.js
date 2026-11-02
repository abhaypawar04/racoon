const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const chatRoutes = require("./routes/chatRoutes");
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Test API
app.get("/", (req, res) => {
  res.send("Local AI Chatbot Backend Running!");
});

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await axios.post("http://localhost:11434/api/chat", {
      model: "llama3.1:8b",
      messages,
      stream: false,
    });

    res.json({
      reply: response.data.message.content,
    });
  } catch (error) {
    console.error("Chat Error:", error.message);

    res.status(500).json({
      error: "AI response failed",
    });
  }
});

// Start server after database connection
const startServer = async () => {
  await connectDB();
  app.use("/api/chats", chatRoutes);
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

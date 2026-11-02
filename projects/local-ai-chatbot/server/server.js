const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

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
      messages: messages,
      stream: false,
    });

    res.json({
      reply: response.data.message.content,
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      error: "AI response failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

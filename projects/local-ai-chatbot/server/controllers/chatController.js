const Chat = require("../models/Chat");
const axios = require("axios");

// Create new chat
exports.createChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      title: "New Chat",
      messages: [],
    });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all chats
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .select("title createdAt updatedAt")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single chat
exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        error: "Chat not found",
      });
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send message and get AI response
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        error: "Chat not found",
      });
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: message.trim(),
    });

    if (chat.title === "New Chat") {
      chat.title = message.trim().slice(0, 40);
    }

    await chat.save();

    // Send conversation to Ollama
    const response = await axios.post("http://localhost:11434/api/chat", {
      model: "llama3.1:8b",
      messages: chat.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: false,
    });

    const aiReply = response.data.message.content;

    // Save AI response
    chat.messages.push({
      role: "assistant",
      content: aiReply,
    });

    await chat.save();

    res.json({
      chatId: chat._id,
      reply: aiReply,
      messages: chat.messages,
    });
  } catch (error) {
    console.error("Chat error:", error.message);

    res.status(500).json({
      error: "Failed to generate AI response",
    });
  }
};

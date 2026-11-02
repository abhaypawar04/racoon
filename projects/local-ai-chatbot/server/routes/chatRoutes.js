const express = require("express");
const router = express.Router();

const {
  createChat,
  getChats,
  getChat,
  sendMessage,
} = require("../controllers/chatController");

router.post("/", createChat);
router.get("/", getChats);
router.get("/:id", getChat);

// Send message to AI
router.post("/:id/message", sendMessage);

module.exports = router;

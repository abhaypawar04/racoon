const express = require("express");
const router = express.Router();

const { askQuestion } = require("../controllers/ragController");

router.post("/ask", askQuestion);

module.exports = router;

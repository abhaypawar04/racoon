const express = require("express");
const cors = require("cors");
require("dotenv").config();
const documentRoutes = require("./routes/documentRoutes");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use("/api/documents", documentRoutes);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "PDF RAG Chatbot Backend Running!",
    status: "success",
  });
});

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();

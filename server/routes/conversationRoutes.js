const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createConversation,
  getConversations,
} = require("../controllers/conversationController");
const router = express.Router();

router.post("/", protect, createConversation);
router.get("/", protect, getConversations);
module.exports = router;
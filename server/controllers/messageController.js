const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    const message = await Message.create({
  conversationId,
  sender: req.user._id,
  content,
});

// IMPORTANT FIX
await Conversation.findByIdAndUpdate(conversationId, {
  lastMessage: content,
  lastMessageSender: req.user._id, // 🔥 THIS WAS MISSING
  updatedAt: Date.now(),
});

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id,
    })
      .populate("sender", "username email avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  sendMessage,
  getMessages,
};
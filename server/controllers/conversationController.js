const Conversation = require("../models/Conversation");

const createConversation = async (req, res) => {
  try {
    const { userId } = req.body;

    const myId = req.user._id;

    // ❌ prevent self-chat
    if (!userId || userId === myId.toString()) {
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    // check existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [myId, userId] },
    });

    if (conversation) return res.json(conversation);

    // create proper 2-person conversation
    conversation = await Conversation.create({
      participants: [myId, userId],
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
  participants: req.user._id,
})
  .populate(
    "participants",
    "username email avatar lastSeen"
  )
  .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createConversation,
  getConversations,
};
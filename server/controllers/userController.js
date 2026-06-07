const User = require("../models/User");

const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.username;

    const users = await User.find({
  username: keyword,
  _id: { $ne: req.user._id },
}).select("username email avatar");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  searchUsers,
};
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");

// create a new user
const createUser = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.create({ username, email, userId: uuidv4() });
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ userId: id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// update user and delete user for next time

module.exports = {
  createUser,
  getUserById,
};

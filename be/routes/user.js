const express = require("express");

const { createUser, getUserById } = require("../controllers/userController");

const router = express.Router();

// POST a new user
router.post("/users", createUser);

// GET user by ID
router.get("/users/:id", getUserById);

module.exports = router;

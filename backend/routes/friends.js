const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userModel = new User();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = user;
      next();
    }
  );
};

// Add friend
router.post("/", authenticateToken, (req, res) => {
  try {
    const { friendId } = req.body;
    const users = userModel.getAll();

    const userIndex = users.findIndex((u) => u.id === req.user.id);
    const friendIndex = users.findIndex((u) => u.id === friendId);

    if (friendIndex === -1) {
      return res.status(404).json({ message: "Friend not found" });
    }

    if (!users[userIndex].friends.includes(friendId)) {
      users[userIndex].friends.push(friendId);
      userModel.saveUsers(users);
    }

    res.json({ message: "Friend added successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get friend list
router.get("/", authenticateToken, (req, res) => {
  try {
    const users = userModel.getAll();
    const user = users.find((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = users
      .filter((u) => user.friends.includes(u.id))
      .map(({ password, ...friend }) => friend);

    res.json(friends);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove friend
router.delete("/:friendId", authenticateToken, (req, res) => {
  try {
    const { friendId } = req.params;
    const users = userModel.getAll();

    const userIndex = users.findIndex((u) => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users[userIndex].friends = users[userIndex].friends.filter(
      (id) => id !== friendId
    );
    userModel.saveUsers(users);

    res.json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

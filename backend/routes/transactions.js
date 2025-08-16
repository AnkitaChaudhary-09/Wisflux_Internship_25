const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

const transactionModel = new Transaction();
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

// Create new transaction
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productName, amount, place, remarks, splitWith } = req.body;

    // Validate inputs
    if (!productName || !amount || !splitWith || !Array.isArray(splitWith)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Calculate split amount
    const splitAmount = transactionModel.calculateSplit(
      amount,
      splitWith.length + 1
    );

    // Check if all users have sufficient balance
    for (const userId of splitWith) {
      const user = userModel.getById(userId);
      if (!user || user.wallet < splitAmount) {
        return res.status(400).json({
          message: `User ${userId} has insufficient balance`,
        });
      }
    }

    // Create transaction
    const transaction = transactionModel.create({
      productName,
      amount,
      place,
      remarks,
      paidBy: req.user.id,
      splitWith,
      splitAmount,
      status: "completed",
    });

    // Update balances
    await userModel.updateWallet(req.user.id, -amount + splitAmount);
    for (const userId of splitWith) {
      await userModel.updateWallet(userId, -splitAmount);
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's transactions
router.get("/", authenticateToken, (req, res) => {
  try {
    const transactions = transactionModel.getByUserId(req.user.id);
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

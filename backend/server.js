const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes will be imported here
const userRoutes = require("./routes/users");
const transactionRoutes = require("./routes/transactions");
const friendRoutes = require("./routes/friends");

// Route middleware
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/friends", friendRoutes);

// Data storage path
const DATA_DIR = path.join(__dirname, "data");
if (!require("fs").existsSync(DATA_DIR)) {
  require("fs").mkdirSync(DATA_DIR);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

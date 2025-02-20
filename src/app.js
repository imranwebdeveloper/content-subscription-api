require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const subscriptionRoutes = require("./routes/subscription.routes");
// const contentRoutes = require("./routes/content.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subscription", subscriptionRoutes);
// app.use("/api/content", contentRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Content Subscription API is running!");
});

module.exports = app;

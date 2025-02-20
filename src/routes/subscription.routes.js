const express = require("express");
const {
  subscribe,
  unsubscribe,
  getSubscriptions,
} = require("../controllers/subscription.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Routes
router.post("/subscribe", authMiddleware, subscribe);
router.post("/unsubscribe", authMiddleware, unsubscribe);
router.get("/", authMiddleware, getSubscriptions);

module.exports = router;

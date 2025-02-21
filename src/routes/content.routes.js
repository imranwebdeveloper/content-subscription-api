const express = require("express");
const {
  getPersonalizedContent,
  getRecommendedContent,
} = require("../controllers/content.controller");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/subscribed", authenticate, getPersonalizedContent);

router.get("/recommended", authenticate, getRecommendedContent);

module.exports = router;

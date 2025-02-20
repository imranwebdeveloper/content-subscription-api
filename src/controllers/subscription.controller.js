const User = require("../models/user.model");
const sendEmail = require("../services/email.service"); // For email notifications

// Subscribe to categories
exports.subscribe = async (req, res) => {
  try {
    const { categories } = req.body;
    const userId = req.user.userId;

    if (!categories || !categories.length) {
      return res
        .status(400)
        .json({ message: "Please provide categories to subscribe to." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Merge new categories with existing ones
    user.subscribedCategories = [
      ...new Set([...user.subscribedCategories, ...categories]),
    ];

    await user.save();

    // Send email notification
    await sendEmail(
      user.email,
      "Subscription Update",
      `You have subscribed to: ${categories.join(", ")}`
    );

    res.json({
      message: "Successfully subscribed",
      subscribedCategories: user.subscribedCategories,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Unsubscribe from categories
exports.unsubscribe = async (req, res) => {
  try {
    const { categories } = req.body;
    const userId = req.user.userId;

    if (!categories || !categories.length) {
      return res
        .status(400)
        .json({ message: "Please provide categories to unsubscribe from." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove selected categories
    user.subscribedCategories = user.subscribedCategories.filter(
      (cat) => !categories.includes(cat)
    );

    await user.save();

    res.json({
      message: "Successfully unsubscribed",
      subscribedCategories: user.subscribedCategories,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user's subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ subscribedCategories: user.subscribedCategories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

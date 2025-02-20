const User = require("../models/user.model");
const { generateToken } = require("../config/auth");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already in use", success: false });
    }
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: { email, name },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }
    const isPasswordValid = await user.comparePassword(password);
    delete user.password;

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }
    const token = generateToken(user._id);
    res.json({
      data: {
        token,
        user: { name: user.name, email: user.email, _id: user._id },
      },
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

module.exports = { register, login };

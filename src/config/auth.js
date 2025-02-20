const jwt = require("jsonwebtoken");

function generateToken(userId) {
  const JWT_SECRET = process.env.JWT_SECRET;
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };

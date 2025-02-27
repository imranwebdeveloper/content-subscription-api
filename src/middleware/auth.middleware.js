const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "Access Denied", success: false });

  try {
    const verified = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const user = await prisma.user.findUnique({
      where: { id: verified.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user)
      return res.status(401).json({ message: "Access Denied", success: false });

    req.user = user;
    next();
  } catch (err) {
    // console.log(err);
    res.status(400).json({ message: "Invalid Token", success: false });
  }
};

module.exports = authMiddleware;

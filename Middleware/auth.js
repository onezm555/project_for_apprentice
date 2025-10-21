const jwt = require("jsonwebtoken");
const User = require("../Models/user");

exports.authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    const user = await User.findById(decoded.id).select("_id userId name");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; 
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

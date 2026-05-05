import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Extract token - handle both "Bearer token" and just "token" formats
    let token = authHeader;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.replace("Bearer ", "").trim();
    }

    // Validate token format (basic check)
    if (!token || token === "null" || token === "undefined" || token.length < 10) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if decoded has id
    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // attach full user object
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    
    // Provide specific error messages
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    
    return res.status(401).json({ message: "Token verification failed" });
  }
};

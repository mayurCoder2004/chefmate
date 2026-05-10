import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getTokenFromHeader = (req) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) return null;

  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return authHeader.trim();
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token || token === "null" || token === "undefined" || token.length < 10) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Token verification failed" });
  }
};

export const authOptional = async (req, _res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token || token === "null" || token === "undefined" || token.length < 10) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return next();
    }

    const user = await User.findById(decoded.id);

    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore invalid or expired tokens and continue as guest
  }

  next();
};
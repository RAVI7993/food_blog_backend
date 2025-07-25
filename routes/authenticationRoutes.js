// File: routes/authenticationRoutes.js
import express from "express";
import { LoginAppCtrl, createUserCtrl } from '../controllers/authenticationController.js';
import Jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * Verify that the request has a valid Bearer JWT.
 * If anything is wrong—missing header, malformed Bearer string, token === 'undefined'—
 * we immediately return 401. Only then do we call jwt.verify.
 */
export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ status:401, message: "No Authorization header" });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ status:401, message: "Malformed Authorization header" });
  }

  const [scheme, token] = parts;
  if (scheme !== 'Bearer') {
    return res.status(401).json({ status:401, message: "Expected Bearer scheme" });
  }
  if (!token || token === 'null' || token === 'undefined') {
    return res.status(401).json({ status:401, message: "No token provided" });
  }

  try {
    const payload = Jwt.verify(token, process.env.SecretKey);
    // Attach the user ID (or whatever you embedded) to the request
    req.userId = payload.subject;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ status:401, message: "Invalid or expired token" });
  }
}

// Public routes
router.post("/login",  LoginAppCtrl);
router.post("/create", createUserCtrl);

export default router;

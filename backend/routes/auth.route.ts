import express from "express";
import { register, login, getMe, registerValidation, loginValidation } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post("/register", registerValidation, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginValidation, login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", authenticate, getMe);

export default router;

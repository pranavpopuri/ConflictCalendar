import express from "express";
import {
    register,
    login,
    getMe,
    registerValidation,
    loginValidation,
    requestPasswordReset,
    resetPassword,
    passwordResetRequestValidation,
    passwordResetValidation,
    testEmail
} from "../controllers/auth.controller";
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

// @route   POST /api/auth/request-password-reset
// @desc    Request password reset
// @access  Public
router.post("/request-password-reset", passwordResetRequestValidation, requestPasswordReset);

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post("/reset-password", passwordResetValidation, resetPassword);

// @route   POST /api/auth/test-email
// @desc    Test email configuration (development only)
// @access  Public
router.post("/test-email", testEmail);

export default router;

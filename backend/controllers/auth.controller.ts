/**
 * @fileoverview Authentication controller for ConflictCalendar application
 * Handles user registration, login, password reset, and authentication validation
 * @author ConflictCalendar Team
 * @version 1.0.0
 */

import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import User from "../models/user.model";
import { generateToken, AuthRequest } from "../middleware/auth";
import emailService from "../services/emailService";
import crypto from "crypto";

/**
 * Validation rules for user registration
 * @description Validates username, email, and password fields for new user registration
 * @type {ValidationChain[]}
 */
export const registerValidation = [
    body("username")
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("Username must be between 3 and 50 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Username can only contain letters, numbers, and underscores"),
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];

/**
 * Validation rules for user login
 * @description Validates email and password fields for user authentication
 * @type {ValidationChain[]}
 */
export const loginValidation = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

/**
 * Validation rules for password reset request
 * @description Validates email field for password reset initiation
 * @type {ValidationChain[]}
 */
export const passwordResetRequestValidation = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Please enter a valid email")
];

/**
 * Validation rules for password reset completion
 * @description Validates reset token and new password for password reset completion
 * @type {ValidationChain[]}
 */
export const passwordResetValidation = [
    body("token")
        .notEmpty()
        .withMessage("Reset token is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
];

/**
 * Registers a new user account
 * @description Creates a new user account with validation and duplicate checking
 * @param {Request} req - Express request object containing user registration data
 * @param {string} req.body.username - Unique username (3-50 chars, alphanumeric + underscore)
 * @param {string} req.body.email - Valid email address
 * @param {string} req.body.password - Password (minimum 6 characters)
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with user data and JWT token on success
 * @throws {400} Validation errors or duplicate username/email
 * @throws {500} Internal server error
 * @example
 * POST /api/auth/register
 * {
 *   "username": "johndoe",
 *   "email": "john@example.com",
 *   "password": "securepass123"
 * }
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
            return;
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? "User with this email already exists"
                    : "Username is already taken"
            });
            return;
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        // Explicitly type user as any to avoid TypeScript error on _id
        const token = generateToken((user._id as any).toString());

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration"
        });
    }
};

/**
 * Authenticates a user and provides access token
 * @description Validates user credentials and returns JWT token for authentication
 * @param {Request} req - Express request object containing login credentials
 * @param {string} req.body.email - User's registered email address
 * @param {string} req.body.password - User's password
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with user data and JWT token on success
 * @throws {400} Validation errors or invalid credentials
 * @throws {500} Internal server error
 * @example
 * POST /api/auth/login
 * {
 *   "email": "john@example.com",
 *   "password": "securepass123"
 * }
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
            return;
        }

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }

        // Generate token
        const token = generateToken((user._id as any).toString());

        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login"
        });
    }
};

/**
 * Retrieves the currently authenticated user's profile
 * @description Returns user profile information for the authenticated user
 * @param {AuthRequest} req - Express request object with authenticated user
 * @param {User} req.user - Authenticated user object from middleware
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with user profile data
 * @throws {401} User not authenticated
 * @throws {500} Internal server error
 * @example
 * GET /api/auth/me
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: req.user._id,
                    username: req.user.username,
                    email: req.user.email
                }
            }
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

/**
 * Initiates password reset process for a user
 * @description Generates and sends password reset token via email
 * @param {Request} req - Express request object containing email
 * @param {string} req.body.email - Email address for password reset
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response confirming reset email sent
 * @throws {400} Validation errors
 * @throws {500} Internal server error
 * @note Always returns success to prevent email enumeration attacks
 * @example
 * POST /api/auth/forgot-password
 * {
 *   "email": "john@example.com"
 * }
 */
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    console.log('🔐 Password reset request received');
    console.log('📧 Request body:', req.body);

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('❌ Validation errors:', errors.array());
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
            return;
        }

        const { email } = req.body;
        console.log('🔍 Looking for user with email:', email);

        // Find user by email
        const user = await User.findOne({ email });

        // Always return success to prevent email enumeration
        if (!user) {
            console.log('⚠️ User not found for email:', email);
            res.json({
                success: true,
                message: "If an account with that email exists, a password reset link has been sent."
            });
            return;
        }

        console.log('✅ User found:', user.username, 'generating reset token...');

        // Generate reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        console.log('🎫 Reset token generated, attempting to send email...');

        // Send reset email
        try {
            await emailService.sendPasswordResetEmail(email, resetToken);
            console.log('✅ Password reset email sent successfully');

            res.json({
                success: true,
                message: "If an account with that email exists, a password reset link has been sent."
            });
        } catch (error) {
            console.error("❌ Failed to send password reset email:", error);

            // Clear the reset token if email fails
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            res.status(500).json({
                success: false,
                message: "Failed to send password reset email. Please try again."
            });
        }
    } catch (error) {
        console.error("❌ Password reset request error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during password reset request"
        });
    }
};

/**
 * Completes password reset process with token validation
 * @description Validates reset token and updates user password
 * @param {Request} req - Express request object containing reset token and new password
 * @param {string} req.body.token - Password reset token from email
 * @param {string} req.body.password - New password (minimum 6 characters)
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response confirming password reset
 * @throws {400} Validation errors or invalid/expired token
 * @throws {500} Internal server error
 * @example
 * POST /api/auth/reset-password
 * {
 *   "token": "abc123...",
 *   "password": "newsecurepass123"
 * }
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors.array()
            });
            return;
        }

        const { token, password } = req.body;

        console.log('🔑 Reset password attempt with token:', token?.substring(0, 10) + '...');

        // Hash the token to compare with the stored hashed token
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        console.log('🔐 Hashed token for comparison:', hashedToken.substring(0, 10) + '...');

        // Find user with valid reset token
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            console.log('❌ No user found with matching token or token expired');
            res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
            return;
        }

        console.log('✅ Valid reset token found for user:', user.email);

        // Update password and clear reset token
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // Generate new auth token
        const authToken = generateToken((user._id as any).toString());

        res.json({
            success: true,
            message: "Password reset successful",
            data: {
                token: authToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during password reset"
        });
    }
};

/**
 * Tests email service configuration (development only)
 * @description Sends a test email to verify email service is working correctly
 * @param {Request} req - Express request object containing test email address
 * @param {string} req.body.email - Email address to send test email to
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response confirming test email sent
 * @throws {400} Email address required
 * @throws {500} Email service configuration error
 * @note This endpoint should only be available in development environment
 * @example
 * POST /api/auth/test-email
 * {
 *   "email": "test@example.com"
 * }
 */
export const testEmail = async (req: Request, res: Response): Promise<void> => {
    console.log('🧪 Test email endpoint called');
    console.log('📧 Request body:', req.body);

    try {
        const { email } = req.body;

        if (!email) {
            console.log('❌ No email provided in request');
            res.status(400).json({
                success: false,
                message: "Email is required"
            });
            return;
        }

        console.log(`🎯 Testing email configuration by sending to: ${email}`);

        await emailService.sendEmail({
            to: email,
            subject: "Test Email - Conflict Calendar",
            text: "This is a test email from your Conflict Calendar application. If you received this, your email configuration is working correctly!",
            html: `
                <h2>🧪 Test Email</h2>
                <p>This is a test email from your <strong>Conflict Calendar</strong> application.</p>
                <p>If you received this, your email configuration is working correctly!</p>
                <hr>
                <p><small>This is a test email sent from your development environment.</small></p>
            `
        });

        console.log('✅ Test email sent successfully!');
        res.json({
            success: true,
            message: "Test email sent successfully! Check your email or console for preview URL."
        });
    } catch (error) {
        console.error("❌ Test email failed:", error);
        res.status(500).json({
            success: false,
            message: "Test email failed: " + (error as Error).message
        });
    }
};

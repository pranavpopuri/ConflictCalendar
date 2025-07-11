/**
 * @fileoverview Authentication Middleware - JWT token validation and user authentication
 * @description Provides middleware functions for JWT token verification, user authentication,
 * and token generation. Extends Express Request interface to include authenticated user data.
 * @author ConflictCalendar Team
 * @version 1.0.0
 */

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";

/**
 * Extended Express Request interface with authenticated user
 * @interface AuthRequest
 * @extends {Request}
 * @description Extends the standard Express Request to include optional user data
 */
export interface AuthRequest extends Request {
    /** Authenticated user object (populated by authenticate middleware) */
    user?: IUser;
}

/**
 * Authentication middleware for JWT token verification
 * @description Validates JWT tokens from Authorization header and attaches user to request
 * @param {AuthRequest} req - Express request object (extended with user property)
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} Calls next() on success, sends error response on failure
 * @throws {401} No token provided, invalid token, or user not found
 * @throws {500} JWT secret not configured
 * @example
 * // Protect a route with authentication
 * router.get('/protected', authenticate, (req: AuthRequest, res) => {
 *   console.log('Authenticated user:', req.user?.username);
 * });
 */
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            res.status(401).json({ success: false, message: "No token, authorization denied" });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ success: false, message: "JWT secret not configured" });
            return;
        }

        const decoded = jwt.verify(token, jwtSecret) as { id: string };
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            res.status(401).json({ success: false, message: "Token is not valid" });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Token is not valid" });
    }
};

/**
 * Generates a JWT token for user authentication
 * @description Creates a signed JWT token with user ID and 7-day expiration
 * @param {string} userId - User's database ID to include in token payload
 * @returns {string} Signed JWT token string
 * @throws {Error} JWT secret not configured in environment variables
 * @example
 * const token = generateToken(user._id.toString());
 * res.json({ token, user: { id: user._id, username: user.username } });
 */
export const generateToken = (userId: string): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT secret not configured");
    }

    return jwt.sign({ id: userId }, jwtSecret, { expiresIn: "7d" });
};

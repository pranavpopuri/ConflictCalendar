/**
 * @fileoverview User Model - Database schema and interface for user management
 * @description Defines the user data structure, validation rules, and authentication methods
 * for the ConflictCalendar application. Includes password hashing, validation, and
 * password reset functionality.
 * @author ConflictCalendar Team
 * @version 1.0.0
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * User document interface extending Mongoose Document
 * @interface IUser
 * @extends {mongoose.Document}
 * @description Defines the structure and methods for user documents in MongoDB
 */
export interface IUser extends mongoose.Document {
    /** Unique username for the user (3-50 characters, alphanumeric + underscore) */
    username: string;
    /** User's email address (unique, validated format) */
    email: string;
    /** Hashed password (minimum 6 characters before hashing) */
    password: string;
    /** Optional hashed token for password reset functionality */
    passwordResetToken?: string;
    /** Optional expiration date for password reset token */
    passwordResetExpires?: Date;
    /** Document creation timestamp (automatically managed) */
    createdAt: Date;

    /**
     * Compares a plain text password with the hashed password
     * @param {string} candidatePassword - Plain text password to verify
     * @returns {Promise<boolean>} True if password matches, false otherwise
     */
    comparePassword(candidatePassword: string): Promise<boolean>;

    /**
     * Generates a password reset token and sets expiration
     * @returns {string} Plain text reset token (also saves hashed version to database)
     */
    generatePasswordResetToken(): string;
}

/**
 * User schema definition with validation rules
 * @description Mongoose schema defining user document structure and validation
 */

const UserSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [50, "Username cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    passwordResetToken: {
        type: String,
        default: undefined
    },
    passwordResetExpires: {
        type: Date,
        default: undefined
    }
}, {
    timestamps: true
});

/**
 * Pre-save middleware to hash passwords
 * @description Automatically hashes the password before saving to database
 * @param {Function} next - Mongoose middleware next function
 * @throws {Error} Bcrypt hashing errors
 */
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

/**
 * Instance method to compare password with hashed version
 * @description Compares a plain text password with the stored hashed password
 * @param {string} candidatePassword - The plain text password to verify
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 * @example
 * const isValid = await user.comparePassword('userInputPassword');
 */
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Instance method to generate password reset token
 * @description Creates a secure password reset token and sets expiration (10 minutes)
 * @returns {string} Plain text reset token to be sent via email
 * @note The hashed version is stored in the database for security
 * @example
 * const resetToken = user.generatePasswordResetToken();
 * await user.save();
 * // Send resetToken via email
 */
UserSchema.methods.generatePasswordResetToken = function (): string {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    return resetToken;
};

/**
 * User model for database operations
 * @description Mongoose model for user collection with all validation and methods
 * @example
 * const user = new User({ username: 'john', email: 'john@example.com', password: 'secret' });
 * await user.save();
 */
export default mongoose.model<IUser>("User", UserSchema);

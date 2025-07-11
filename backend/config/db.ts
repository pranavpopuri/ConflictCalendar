/**
 * @fileoverview Database Configuration - MongoDB connection setup
 * @description Handles MongoDB connection using Mongoose with error handling and logging.
 * Connects to MongoDB Atlas or local MongoDB instance based on environment configuration.
 * @author ConflictCalendar Team
 * @version 1.0.0
 */

import mongoose, { Mongoose } from 'mongoose';

/**
 * Establishes connection to MongoDB database
 * @description Connects to MongoDB using the MONGO_URI environment variable
 * @returns {Promise<void>} Promise that resolves when connection is established
 * @throws {Error} Database connection errors (exits process on failure)
 * @example
 * // In server.ts
 * app.listen(PORT, () => {
 *   connectDB();
 *   console.log('Server running');
 * });
 */
export const connectDB = async (): Promise<void> => {
    try {
        const conn: Mongoose = await mongoose.connect(process.env.MONGO_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

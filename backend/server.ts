/**
 * @fileoverview Express Server Configuration - Main application entry point
 * @description Sets up Express server with API routes, static file serving, and SPA routing.
 * Handles both development and production environments with automatic frontend build detection.
 * @author ConflictCalendar Team
 * @version 1.0.0
 */

import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db';
import courseRoutes from './routes/course.route';
import authRoutes from './routes/auth.route';
import path from "path";
import fs from "fs";

// Load environment variables
dotenv.config();

/**
 * Express application instance
 * @description Main Express application with JSON parsing middleware
 */
const app: Application = express();
app.use(express.json());

/** Server port from environment or default to 5000 */
const PORT = process.env.PORT || 5000;
/** Resolved directory path for static file serving */
const __dirname = path.resolve();

console.log("🚀 Starting ConflictCalendar Server...");

/**
 * API Routes Configuration
 * @description Mount API routes before static file serving to ensure proper routing
 */
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

/**
 * Static File Serving and SPA Routing Configuration
 * @description Serves React frontend build files and handles client-side routing
 */
const staticPath = path.join(__dirname, "frontend", "dist");
const indexPath = path.resolve(__dirname, "frontend", "dist", "index.html");

console.log("📁 Static path:", staticPath);
console.log("📄 Index path:", indexPath);
console.log("✅ Static exists:", fs.existsSync(staticPath));
console.log("✅ Index exists:", fs.existsSync(indexPath));

/**
 * Conditional frontend serving based on build availability
 * @description Serves React frontend if build exists, otherwise shows build instruction
 */
if (fs.existsSync(staticPath) && fs.existsSync(indexPath)) {
    /**
     * Static file middleware
     * @description Serves CSS, JS, images, and other static assets
     */
    app.use(express.static(staticPath));

    /**
     * SPA routing handler
     * @description Serves index.html for all non-API, non-static routes to support client-side routing
     */
    app.use('/', (req: Request, res: Response, next) => {
        // Skip API routes
        if (req.path.startsWith('/api/')) {
            return next();
        }

        // Skip static files (they have extensions)
        if (req.path.includes('.')) {
            return next();
        }

        console.log("📄 Serving index.html for:", req.path);
        res.sendFile(indexPath);
    });
} else {
    console.log("❌ Frontend build not found!");
    /**
     * Development fallback route
     * @description Shows build instruction when frontend build is not available
     */
    app.get("/", (req: Request, res: Response) => {
        res.status(404).send("Frontend build not found. Please run 'npm run build' first.");
    });
}

/**
 * Server startup and database connection
 * @description Starts the Express server and connects to MongoDB
 */
app.listen(PORT, () => {
    connectDB();
    console.log(`🌟 Server running at http://localhost:${PORT}`);
    console.log(`🔗 Test reset password: http://localhost:${PORT}/reset-password`);
});

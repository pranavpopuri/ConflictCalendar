import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db';
import courseRoutes from './routes/course.route';
import authRoutes from './routes/auth.route';
import path from "path";
import fs from "fs";

dotenv.config();

const app: Application = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

console.log("🚀 Starting ConflictCalendar Server...");

// API routes MUST come first
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// Static files and SPA routing
const staticPath = path.join(__dirname, "frontend", "dist");
const indexPath = path.resolve(__dirname, "frontend", "dist", "index.html");

console.log("📁 Static path:", staticPath);
console.log("📄 Index path:", indexPath);
console.log("✅ Static exists:", fs.existsSync(staticPath));
console.log("✅ Index exists:", fs.existsSync(indexPath));

if (fs.existsSync(staticPath) && fs.existsSync(indexPath)) {
    // Serve static files (CSS, JS, images, etc.)
    app.use(express.static(staticPath));

    // Handle SPA routing - serve index.html for all non-API routes
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
    app.get("/", (req: Request, res: Response) => {
        res.status(404).send("Frontend build not found. Please run 'npm run build' first.");
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log(`🌟 Server running at http://localhost:${PORT}`);
    console.log(`🔗 Test reset password: http://localhost:${PORT}/reset-password`);
});

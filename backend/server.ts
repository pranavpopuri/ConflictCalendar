import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db';
import courseRoutes from './routes/course.route';
import authRoutes from './routes/auth.route';
import path from "path";

dotenv.config();

const app: Application = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("__dirname:", __dirname);

// Serve static files in production
const isProduction = process.env.NODE_ENV?.trim() === "production";
console.log("isProduction:", isProduction);

// API routes (put these BEFORE the catch-all route)
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

if (isProduction) {
    console.log("Running in production mode - serving static files");
    const staticPath = path.join(__dirname, "frontend", "dist");
    console.log("Static files path:", staticPath);

    app.use(express.static(staticPath));

    // Simple fallback to index.html for SPA routing
    app.get("/", (req: Request, res: Response) => {
        const indexPath = path.resolve(__dirname, "frontend", "dist", "index.html");
        console.log("Serving index.html from:", indexPath);
        res.sendFile(indexPath);
    });
} else {
    console.log("Running in development mode - no static files served");
    app.get("/", (req: Request, res: Response) => {
        res.json({ message: "API server running in development mode" });
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});

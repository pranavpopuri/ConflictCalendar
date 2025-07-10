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

console.log("Starting server...");

// API routes FIRST (very important!)
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// Static files and frontend routing
const staticPath = path.join(__dirname, "frontend", "dist");
const indexPath = path.resolve(__dirname, "frontend", "dist", "index.html");

console.log("Static path:", staticPath);
console.log("Index path:", indexPath);
console.log("Static exists:", fs.existsSync(staticPath));
console.log("Index exists:", fs.existsSync(indexPath));

if (fs.existsSync(staticPath) && fs.existsSync(indexPath)) {
    console.log("✅ Frontend build found, setting up routing...");

    // Serve static files
    app.use(express.static(staticPath));

    // ALL non-API routes should serve index.html
    
    //@ts-ignore dw abt it
    app.get('*', (req: Request, res: Response) => {
        // Skip API routes
        if (req.path.startsWith('/api/')) {
            return res.status(404).json({ error: 'API route not found' });
        }

        console.log("📄 Serving index.html for:", req.path);
        res.sendFile(indexPath);
    });

    console.log("✅ Frontend routing configured");
} else {
    console.log("❌ Frontend build not found");
    app.get("/", (req: Request, res: Response) => {
        res.json({ message: "API server running - no frontend build found" });
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log(`🚀 Server started at http://localhost:${PORT}`);
    console.log(`🔗 Test reset password: http://localhost:${PORT}/reset-password`);
});

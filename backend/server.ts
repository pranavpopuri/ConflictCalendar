import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db';
import courseRoutes from './routes/course.route';

const app: Application = express();
app.use(express.json());

app.use("/api/courses", courseRoutes);

dotenv.config();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});

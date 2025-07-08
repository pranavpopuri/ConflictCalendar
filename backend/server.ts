import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from './config/db';
import Course from './models/course.model';

dotenv.config();

const app: Application = express();
app.use(express.json());

app.post("/api/courses", async (req: Request, res: Response): Promise<void> => {
    const course = req.body;

    if (
        !course.name ||
        !course.startTime ||
        !course.endTime ||
        !course.days
    ) {
        res.status(400).json({ success: false, message: "Please provide all fields" });
        return;
    }

    const newCourse = new Course(course);

    try {
        await newCourse.save();
        res.status(201).json({ success: true, data: newCourse });
    } catch (error: any) {
        console.error("Error in Create course:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }

    // Placeholder for course creation logic
    res.status(201).json({ success: true, message: "Course created", course });
});

app.get("/courses", (req: Request, res: Response): void => {
    const course: any = req.body;
    res.send("Courses endpoint");
});

const mongoUri: string | undefined = process.env.MONGO_URI;
console.log(mongoUri);

app.listen(5000, (): void => {
    connectDB();
    console.log("Server running on http://localhost:5000");
});

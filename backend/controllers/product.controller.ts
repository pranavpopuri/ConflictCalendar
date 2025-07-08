import { Request, Response } from "express";
import mongoose from "mongoose";
import Course from "../models/course.model";

export const getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const courses = await Course.find({});
        res.status(200).json({ success: true, data: courses });
    } catch (error: any) {
        console.log("error in fetching courses:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
    const course = req.body as { name?: string; id?: string; startTime?: number; endTime?: number; days?: string[] };

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
};

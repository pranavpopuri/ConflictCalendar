import { Response } from "express";
import mongoose from "mongoose";
import Course from "../models/course.model";
import { AuthRequest } from "../middleware/auth";

export const getCourses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }

        const courses = await Course.find({ user: req.user._id });
        res.status(200).json({ success: true, data: courses });
    } catch (error: any) {
        console.log("error in fetching courses:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    const course = req.body as { name?: string; id?: string; startTime?: number; endTime?: number; days?: string[] };

    if (!req.user) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
    }

    if (
        !course.name ||
        !course.startTime ||
        !course.endTime ||
        !course.days
    ) {
        res.status(400).json({ success: false, message: "Please provide all fields" });
        return;
    }

    const newCourse = new Course({
        ...course,
        user: req.user._id
    });

    try {
        await newCourse.save();
        res.status(201).json({ success: true, data: newCourse });
    } catch (error: any) {
        console.error("Error in Create course:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const course = req.body as { name?: string; id?: string; startTime?: number; endTime?: number; days?: string[] };

    if (!req.user) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Invalid Course Id" });
        return;
    }

    try {
        const existingCourse = await Course.findById(id);
        if (!existingCourse) {
            res.status(404).json({ success: false, message: "Course not found" });
            return;
        }

        // Check if the course belongs to the authenticated user
        if (existingCourse.user.toString() !== (req.user as { _id: mongoose.Types.ObjectId | string })._id.toString()) {
            res.status(403).json({ success: false, message: "Not authorized to update this course" });
            return;
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, course, { new: true });
        res.status(200).json({ success: true, data: updatedCourse });
    } catch (error: any) {
        console.error("Error in updating course:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!req.user) {
        res.status(401).json({ success: false, message: "User not authenticated" });
        return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Invalid Course Id" });
        return;
    }

    try {
        const existingCourse = await Course.findById(id);
        if (!existingCourse) {
            res.status(404).json({ success: false, message: "Course not found" });
            return;
        }

        // Check if the course belongs to the authenticated user
        if (existingCourse.user.toString() !== (req.user as { _id: mongoose.Types.ObjectId | string })._id.toString()) {
            res.status(403).json({ success: false, message: "Not authorized to delete this course" });
            return;
        }

        await Course.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Course deleted" });
    } catch (error: any) {
        console.error("Error in deleting course:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

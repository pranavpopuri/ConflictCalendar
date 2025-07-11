/**
 * @fileoverview Course Controller - Handles course management operations
 * @description Provides CRUD operations for course management including creation,
 * retrieval, updating, and deletion of courses. All operations are user-scoped
 * to ensure data isolation between users.
 * @author ConflictCalendar Team
 * @version 1.0.0
 */

import { Response } from "express";
import mongoose from "mongoose";
import Course from "../models/course.model";
import { AuthRequest } from "../middleware/auth";

/**
 * Retrieves all courses for the authenticated user
 * @description Fetches all courses associated with the current user's account
 * @param {AuthRequest} req - Express request object with authenticated user
 * @param {User} req.user - Authenticated user object from middleware
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with array of user's courses
 * @throws {401} User not authenticated
 * @throws {500} Internal server error
 * @example
 * GET /api/courses
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */
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

/**
 * Creates a new course for the authenticated user
 * @description Creates a new course with validation and associates it with the current user
 * @param {AuthRequest} req - Express request object with authenticated user and course data
 * @param {User} req.user - Authenticated user object from middleware
 * @param {Object} req.body - Course creation data
 * @param {string} req.body.name - Course name/title
 * @param {string} [req.body.id] - Optional course identifier
 * @param {number} req.body.startTime - Course start time (timestamp or time format)
 * @param {number} req.body.endTime - Course end time (timestamp or time format)
 * @param {string[]} req.body.days - Array of days when course occurs
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with created course data
 * @throws {400} Missing required fields or validation errors
 * @throws {401} User not authenticated
 * @throws {500} Internal server error
 * @example
 * POST /api/courses
 * Headers: { Authorization: "Bearer <jwt_token>" }
 * {
 *   "name": "Computer Science 101",
 *   "startTime": 900,
 *   "endTime": 1050,
 *   "days": ["Monday", "Wednesday", "Friday"]
 * }
 */
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

/**
 * Updates an existing course for the authenticated user
 * @description Updates course information with validation and ownership verification
 * @param {AuthRequest} req - Express request object with authenticated user and course data
 * @param {User} req.user - Authenticated user object from middleware
 * @param {string} req.params.id - Course ID to update
 * @param {Object} req.body - Updated course data
 * @param {string} [req.body.name] - Updated course name/title
 * @param {string} [req.body.id] - Updated course identifier
 * @param {number} [req.body.startTime] - Updated course start time
 * @param {number} [req.body.endTime] - Updated course end time
 * @param {string[]} [req.body.days] - Updated array of days when course occurs
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response with updated course data
 * @throws {401} User not authenticated
 * @throws {403} User not authorized to update this course
 * @throws {404} Invalid course ID or course not found
 * @throws {500} Internal server error
 * @example
 * PUT /api/courses/:id
 * Headers: { Authorization: "Bearer <jwt_token>" }
 * {
 *   "name": "Advanced Computer Science",
 *   "startTime": 930,
 *   "endTime": 1120
 * }
 */
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

/**
 * Deletes a course for the authenticated user
 * @description Removes a course with ownership verification to ensure users can only delete their own courses
 * @param {AuthRequest} req - Express request object with authenticated user
 * @param {User} req.user - Authenticated user object from middleware
 * @param {string} req.params.id - Course ID to delete
 * @param {Response} res - Express response object
 * @returns {Promise<void>} JSON response confirming course deletion
 * @throws {401} User not authenticated
 * @throws {403} User not authorized to delete this course
 * @throws {404} Invalid course ID or course not found
 * @throws {500} Internal server error
 * @example
 * DELETE /api/courses/:id
 * Headers: { Authorization: "Bearer <jwt_token>" }
 */
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

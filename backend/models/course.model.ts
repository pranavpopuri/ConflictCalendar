/**
 * @fileoverview Course Model - Database schema and interface for course management
 * @description Defines the course data structure and validation rules for the
 * ConflictCalendar application. Manages course scheduling information including
 * name, time slots, days, and user associations.
 * @author ConflictCalendar Team
 * @version 1.0.0
 */

import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * Course document interface extending Mongoose Document
 * @interface ICourse
 * @extends {Document}
 * @description Defines the structure for course documents in MongoDB
 */
export interface ICourse extends Document {
    /** Course name or title */
    name: string;
    /** Course start time (typically in minutes from midnight or time format) */
    startTime: number;
    /** Course end time (typically in minutes from midnight or time format) */
    endTime: number;
    /** Array of days when the course occurs */
    days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>;
    /** Reference to the user who owns this course */
    user: mongoose.Types.ObjectId;
    /** Document creation timestamp (automatically managed) */
    createdAt?: Date;
    /** Document update timestamp (automatically managed) */
    updatedAt?: Date;
}

/**
 * Course schema definition with validation rules
 * @description Mongoose schema defining course document structure and validation
 */

const courseSchema: Schema<ICourse> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        startTime: {
            type: Number,
            required: true,
        },
        endTime: {
            type: Number,
            required: true,
        },
        days: {
            type: [String],
            required: true,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

/**
 * Course model for database operations
 * @description Mongoose model for course collection with validation and user association
 * @example
 * const course = new Course({
 *   name: 'Computer Science 101',
 *   startTime: 900,
 *   endTime: 1050,
 *   days: ['Monday', 'Wednesday', 'Friday'],
 *   user: userId
 * });
 * await course.save();
 */
const Course: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);

export default Course;

import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICourse extends Document {
    name: string;
    id: string;
    startTime: number;
    endTime: number;
    days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>;
    createdAt?: Date;
    updatedAt?: Date;
}

const courseSchema: Schema<ICourse> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        id: {
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
        }
    },
    {
        timestamps: true,
    }
);

const Course: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);

export default Course;

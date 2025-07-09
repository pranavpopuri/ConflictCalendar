import { useCourseStore } from "../store/course";
import { useAuthStore } from "../store/auth";
import React from "react";

interface Course {
    _id: string,
    name: string;
    startTime: number;
    endTime: number;
    days: string[];
}

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const { deleteCourse, getConflictingCourses } = useCourseStore();
    const { token } = useAuthStore();
    const conflictingCourseIds = getConflictingCourses();
    const hasConflict = conflictingCourseIds.includes(course._id);

    const minutesToTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const handleDeleteCourse = async (cid: string) => {
        if (!token) {
            console.error("No authentication token available");
            return;
        }

        const { success, message } = await deleteCourse(cid, token);
        if (!success) {
            // @ts-ignore
            window.toast?.({
            title: "Error",
            description: message,
            variant: "destructive",
        });
        } else {
            // @ts-ignore
            window.toast?.({
                title: "Success",
                description: message,
                variant: "default",
            });
        }
    };
    return (
        <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full p-3 md:p-4 mb-3 md:mb-4 rounded-lg shadow-md transition-colors"
            style={{
                backgroundColor: hasConflict
                    ? "oklch(0.95 0.08 0)" // Light red background for conflicts
                    : "oklch(0.98 0.01 250)", // Normal light blue background
                borderLeft: hasConflict
                    ? "4px solid oklch(0.6 0.15 0)" // Red left border for conflicts
                    : "4px solid oklch(0.7 0.1 220)" // Blue left border for normal
            }}
        >
            <div className="flex flex-col mb-3 sm:mb-0">
                <span className="font-semibold text-base md:text-lg">{course.name}</span>
                <span className="text-xs md:text-sm text-muted-foreground">
                    <span className="sm:hidden">
                        {course.days.map(day => day.slice(0, 3)).join(", ")} | {minutesToTime(course.startTime)} - {minutesToTime(course.endTime)}
                    </span>
                    <span className="hidden sm:inline">
                        {course.days.join(", ")} | {minutesToTime(course.startTime)} - {minutesToTime(course.endTime)}
                    </span>
                </span>
            </div>
            <button
                className="w-full sm:w-auto sm:ml-4 inline-flex items-center justify-center px-3 py-1.5 text-xs md:text-sm font-medium text-destructive bg-destructive/10 rounded-md hover:bg-destructive/20 transition-colors"
                onClick={() => handleDeleteCourse(course._id)}
                type="button"
            >
                Delete
            </button>
        </div>
    )
};


export default CourseCard;

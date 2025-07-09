import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useCourseStore } from "../store/course";
import { useAuthStore } from "../store/auth";
import CourseCard from "../components/CourseCard";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const HomePage = () => {
    const { token } = useAuthStore();

    const [newCourse, setNewCourse] = useState({
        name: "",
        startTime: 0,
        endTime: 0,
        days: [] as string[]
    });

    const [startTimeValue, setStartTimeValue] = useState("");
    const [endTimeValue, setEndTimeValue] = useState("");

    const { createCourse, fetchCourses, courses } = useCourseStore();

    useEffect(() => {
        if (token) {
            fetchCourses(token);
        }
    }, [fetchCourses, token]);

    const handleDayChange = (day: string, checked: boolean) => {
        setNewCourse(prev => ({
            ...prev,
            days: checked
                ? [...prev.days, day]
                : prev.days.filter(d => d !== day)
        }));
    };

    const timeToMinutes = (timeString: string): number => {
        if (!timeString) return 0;
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const autofillCourse = () => {
        const sampleCourses = [
            { name: "Math 101", start: "09:00", end: "10:30", days: ["Monday", "Wednesday", "Friday"] },
            { name: "Physics 201", start: "11:00", end: "12:15", days: ["Tuesday", "Thursday"] },
            { name: "Chemistry 150", start: "14:00", end: "15:30", days: ["Monday", "Wednesday"] },
            { name: "Biology 120", start: "08:00", end: "09:30", days: ["Tuesday", "Thursday", "Friday"] },
            { name: "English 102", start: "13:00", end: "14:15", days: ["Monday", "Tuesday", "Wednesday"] },
            { name: "History 210", start: "10:00", end: "11:30", days: ["Thursday", "Friday"] },
            { name: "Computer Science 180", start: "15:30", end: "17:00", days: ["Monday", "Wednesday", "Friday"] },
            { name: "Psychology 101", start: "12:00", end: "13:30", days: ["Tuesday", "Thursday"] },
            { name: "Calculus II", start: "07:30", end: "08:45", days: ["Monday", "Wednesday", "Friday"] },
            { name: "Organic Chemistry", start: "16:00", end: "17:30", days: ["Tuesday", "Thursday"] },
            { name: "World Literature", start: "09:30", end: "10:45", days: ["Monday", "Wednesday"] },
            { name: "Microeconomics", start: "14:30", end: "16:00", days: ["Tuesday", "Thursday"] },
            { name: "Art History", start: "11:30", end: "12:45", days: ["Monday", "Friday"] },
            { name: "Statistics", start: "08:30", end: "09:45", days: ["Tuesday", "Thursday"] },
            { name: "Philosophy 101", start: "13:30", end: "14:45", days: ["Wednesday", "Friday"] },
            { name: "Sociology 200", start: "10:30", end: "11:45", days: ["Monday", "Wednesday"] },
            { name: "Linear Algebra", start: "15:00", end: "16:15", days: ["Tuesday", "Thursday"] },
            { name: "Business Ethics", start: "12:30", end: "13:45", days: ["Monday", "Wednesday", "Friday"] },
            { name: "Environmental Science", start: "09:00", end: "10:15", days: ["Tuesday", "Thursday"] },
            { name: "Spanish 201", start: "14:00", end: "15:15", days: ["Monday", "Wednesday", "Friday"] },
            { name: "Political Science", start: "11:00", end: "12:30", days: ["Tuesday", "Thursday"] },
            { name: "Anthropology 101", start: "16:30", end: "17:45", days: ["Monday", "Wednesday"] },
            { name: "Music Theory", start: "08:00", end: "09:15", days: ["Tuesday", "Thursday", "Friday"] },
            { name: "Data Structures", start: "13:00", end: "14:30", days: ["Monday", "Wednesday"] },
            { name: "International Relations", start: "15:30", end: "16:45", days: ["Tuesday", "Thursday"] },
            { name: "Creative Writing", start: "10:00", end: "11:15", days: ["Monday", "Friday"] },
            { name: "Astronomy", start: "17:00", end: "18:30", days: ["Wednesday", "Friday"] },
            { name: "Digital Marketing", start: "12:00", end: "13:15", days: ["Tuesday", "Thursday"] },
            { name: "French 102", start: "09:30", end: "10:45", days: ["Monday", "Wednesday", "Friday"] },
            { name: "Game Design", start: "14:30", end: "15:45", days: ["Tuesday", "Thursday"] }
        ];

        // Filter out courses that already exist (case-insensitive comparison)
        const existingCourseNames = courses.map(course => course.name.toLowerCase().trim());
        const availableCourses = sampleCourses.filter(course =>
            !existingCourseNames.includes(course.name.toLowerCase().trim())
        );

        if (availableCourses.length === 0) {
            // If all sample courses are already added, show a message
            // @ts-ignore
            window.toast?.({
                title: "Info",
                description: "All sample courses have already been added!",
                variant: "default",
            });
            return;
        }

        const randomCourse = availableCourses[Math.floor(Math.random() * availableCourses.length)];

        setNewCourse({
            name: randomCourse.name,
            startTime: timeToMinutes(randomCourse.start),
            endTime: timeToMinutes(randomCourse.end),
            days: randomCourse.days
        });

        setStartTimeValue(randomCourse.start);
        setEndTimeValue(randomCourse.end);
    };

    const handleAddProduct = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!token) {
            console.error("No authentication token available");
            return;
        }

        console.log("Sending course data:", newCourse); // Debug log
        const { success, message } = await createCourse(newCourse, token);
        console.log("Success", success);
        console.log("Message", message);

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
        setNewCourse({ name: "", startTime: 0, endTime: 0, days: [] });
        setStartTimeValue("");
        setEndTimeValue("");
    };

    // Calculate grid size n based on courses length (max 3 wide)
    const [gridSize, setGridSize] = useState(1);

    useEffect(() => {
        const calculateGridSize = () => {
            const courseCount = Math.min(courses.length, 9); // Max 9 courses before scroll
            let columns = Math.min(Math.ceil(Math.sqrt(courseCount)), 3); // Max 3 columns
            columns = Math.max(1, columns); // At least 1 column
            setGridSize(columns);
        };

        calculateGridSize();
    }, [courses.length]);

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                {/* Form Section - Top on mobile, Left on desktop */}
                <div className="w-full lg:w-1/3 lg:min-w-96">
                    <div className="flex items-center gap-2 mb-6">
                        <CalendarCheck className="text-[oklch(60%_0.15_250)]" size={32} />
                        <h1 className="text-2xl md:text-3xl font-bold">Welcome</h1>
                    </div>
                    <p className="mb-6 md:mb-8 text-sm md:text-base text-muted-foreground">
                        Welcome to the Conflict Calendar! Enter your courses to see if you have a schedule conflict.
                    </p>
                    <form className="space-y-4 md:space-y-5" onSubmit={handleAddProduct}>
                        {/* Autofill Button */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={autofillCourse}
                                className="text-xs md:text-sm px-2 md:px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                🎲 Autofill Example
                            </button>
                        </div>

                        <Input
                            id="courseName"
                            name="courseName"
                            placeholder="Course Name (e.g. Math 101)"
                            className="bg-[oklch(98%_0.01_250)] text-sm md:text-base"
                            value={newCourse.name}
                            onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <div className="flex gap-2 md:gap-4">
                            <Input
                                type="time"
                                id="startTime"
                                name="startTime"
                                className="bg-[oklch(98%_0.01_250)] text-sm md:text-base"
                                value={startTimeValue}
                                onChange={(e) => {
                                    setStartTimeValue(e.target.value);
                                    setNewCourse(prev => ({ ...prev, startTime: timeToMinutes(e.target.value) }));
                                }}
                            />
                            <Input
                                type="time"
                                id="endTime"
                                name="endTime"
                                className="bg-[oklch(98%_0.01_250)] text-sm md:text-base"
                                value={endTimeValue}
                                onChange={(e) => {
                                    setEndTimeValue(e.target.value);
                                    setNewCourse(prev => ({ ...prev, endTime: timeToMinutes(e.target.value) }));
                                }}
                            />
                        </div>
                        <div>
                            <span className="block font-medium mb-2 text-sm md:text-base">Days</span>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {days.map(day => (
                                    <label key={day} className="flex items-center gap-1 md:gap-2 cursor-pointer text-sm md:text-base">
                                        <Checkbox
                                            name="days"
                                            value={day}
                                            className="accent-[oklch(60%_0.15_250)]"
                                            checked={newCourse.days.includes(day)}
                                            onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                                        />
                                        <span className="sm:hidden">{day.slice(0, 3)}</span>
                                        <span className="hidden sm:inline">{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[oklch(60%_0.15_250)] hover:bg-[oklch(60%_0.21_250)] text-sm md:text-base py-2 md:py-3"
                        >
                            Add Course
                        </Button>
                    </form>
                </div>

                {/* Courses Section - Bottom on mobile, Right on desktop */}
                <div className="flex-1 mt-8 lg:mt-0">
                    {courses.length > 0 ? (
                        <>
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">Your Courses</h2>
                            <div
                                className="grid gap-3 md:gap-4"
                                style={{
                                    gridTemplateColumns: window.innerWidth < 640
                                        ? "1fr"
                                        : window.innerWidth < 1024
                                            ? "repeat(auto-fit, minmax(250px, 1fr))"
                                            : `repeat(${gridSize}, minmax(280px, 1fr))`,
                                    maxHeight: courses.length > 9 ? "400px" : "auto",
                                    overflowY: courses.length > 9 ? "auto" : "visible",
                                    paddingRight: courses.length > 9 ? "4px" : "0",
                                }}
                            >
                                {courses.map((course) => (
                                    <CourseCard key={course._id} course={course} />
                                ))}
                            </div>
                            {courses.length > 9 && (
                                <p className="text-center text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">
                                    Showing all {courses.length} courses. Scroll to see more.
                                </p>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-48 md:h-96 text-muted-foreground">
                            <div className="text-center">
                                <CalendarCheck size={window.innerWidth < 640 ? 32 : 48} className="mx-auto mb-3 md:mb-4 opacity-50" />
                                <p className="text-sm md:text-base">No courses yet. Add your first course to get started!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;

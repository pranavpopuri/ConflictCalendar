import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";
import { useState } from "react";
import { useCourseStore } from "../store/course";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const HomePage = () => {

    const [newCourse, setNewCourse] = useState({
        name: "",
        startTime: 0,
        endTime: 0,
        days: [] as string[]
    });

    const [startTimeValue, setStartTimeValue] = useState("");
    const [endTimeValue, setEndTimeValue] = useState("");

    const { createCourse } = useCourseStore();

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

    const minutesToTime = (minutes: number): string => {
        if (minutes === 0) return "00:00";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const handleAddProduct = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        console.log("Sending course data:", newCourse); // Debug log
        const { success, message } = await createCourse(newCourse);
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

    return (
        <div className="p-8 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <CalendarCheck className="text-[oklch(60%_0.15_250)]" size={32} />
                <h1 className="text-3xl font-bold">Welcome</h1>
            </div>
            <p className="mb-8 text-muted-foreground">
                Welcome to the Conflict Calendar! Enter your courses to see if you have a schedule conflict.
            </p>
            <form className="space-y-5" onSubmit={handleAddProduct}>
                <Input
                    id="courseName"
                    name="courseName"
                    placeholder="Course Name (e.g. Math 101)"
                    className="bg-[oklch(98%_0.01_250)]"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                />
                <div className="flex gap-4">
                    <Input
                        type="time"
                        id="startTime"
                        name="startTime"
                        className="bg-[oklch(98%_0.01_250)]"
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
                        className="bg-[oklch(98%_0.01_250)]"
                        value={endTimeValue}
                        onChange={(e) => {
                            setEndTimeValue(e.target.value);
                            setNewCourse(prev => ({ ...prev, endTime: timeToMinutes(e.target.value) }));
                        }}
                    />
                </div>
                <div>
                    <span className="block font-medium mb-2">Days</span>
                    <div className="flex gap-3">
                        {days.map(day => (
                            <label key={day} className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    name="days"
                                    value={day}
                                    className="accent-[oklch(60%_0.15_250)]"
                                    checked={newCourse.days.includes(day)}
                                    onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                                />
                                <span>{day}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full bg-[oklch(60%_0.15_250)] hover:bg-[oklch(60%_0.21_250)]"
                >
                    Add Course
                </Button>
            </form>
        </div>
    );
}

export default HomePage;

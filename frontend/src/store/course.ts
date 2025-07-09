import { create } from "zustand";

export interface Course {
	_id: string;
	name: string;
	startTime: number;
	endTime: number;
	days: string[];
}

export interface CourseStore {
	courses: Course[];
	setCourses: (courses: Course[]) => void;
	createCourse: (newCourse: Omit<Course, "_id">) => Promise<{ success: boolean; message: string }>;
	fetchCourses: () => Promise<void>;
	deleteCourse: (pid: string) => Promise<{ success: boolean; message: string }>;
	updateCourse: (pid: string, updatedCourse: Partial<Omit<Course, "_id">>) => Promise<{ success: boolean; message: string }>;
}

export const useCourseStore = create<CourseStore>((set) => ({
	courses: [],
	setCourses: (courses) => set({ courses }),
	createCourse: async (newCourse) => {
		if (!newCourse.name || !newCourse.startTime || !newCourse.endTime || !newCourse.days) {
			return { success: false, message: "Please fill in all fields." };
		}
		try {
			const res = await fetch("/api/courses", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newCourse),
			});

			if (!res.ok) {
				return { success: false, message: `Server error: ${res.status}` };
			}

			const data = await res.json();
			set((state) => ({ courses: [...state.courses, data.data] }));
			return { success: true, message: "Course created successfully" };
		} catch (error) {
			return { success: false, message: "Failed to connect to server. Make sure the backend is running." };
		}
	},
	fetchCourses: async () => {
		const res = await fetch("/api/courses");
		const data = await res.json();
		set({ courses: data.data });
	},
	deleteCourse: async (pid) => {
		const res = await fetch(`/api/courses/${pid}`, {
			method: "DELETE",
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		set((state) => ({ courses: state.courses.filter((course) => course._id !== pid) }));
		return { success: true, message: data.message };
	},
	updateCourse: async (pid, updatedCourse) => {
		const res = await fetch(`/api/courses/${pid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedCourse),
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		set((state) => ({
			courses: state.courses.map((course) => (course._id === pid ? data.data : course)),
		}));

		return { success: true, message: data.message };
	},
}));

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
	getConflictingCourses: () => string[];
	hasTimeConflict: (course1: Course, course2: Course) => boolean;
}

// Helper function to check if two courses have time conflicts
const hasTimeConflict = (course1: Course, course2: Course): boolean => {
	// Check if they share any common days
	const commonDays = course1.days.some(day => course2.days.includes(day));
	if (!commonDays) return false;

	// Check if times overlap
	// Convert to minutes for easier comparison
	const start1 = course1.startTime;
	const end1 = course1.endTime;
	const start2 = course2.startTime;
	const end2 = course2.endTime;

	// Check if there's any overlap: start1 < end2 && start2 < end1
	return start1 < end2 && start2 < end1;
};

export const useCourseStore = create<CourseStore>((set) => ({
	courses: [],
	setCourses: (courses) => set({ courses }),
	createCourse: async (newCourse) => {
		if (!newCourse.name || !newCourse.startTime || !newCourse.endTime || !newCourse.days) {
			return { success: false, message: "Please fill in all fields." };
		}

		// Check for duplicate course names (case-insensitive)
		const existingCourse = useCourseStore.getState().courses.find(
			course => course.name.toLowerCase().trim() === newCourse.name.toLowerCase().trim()
		);

		if (existingCourse) {
			return { success: false, message: "A course with this name already exists. Please choose a different name." };
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
	getConflictingCourses: () => {
		const state = useCourseStore.getState();
		const conflictingIds: string[] = [];

		for (let i = 0; i < state.courses.length; i++) {
			for (let j = i + 1; j < state.courses.length; j++) {
				if (hasTimeConflict(state.courses[i], state.courses[j])) {
					if (!conflictingIds.includes(state.courses[i]._id)) {
						conflictingIds.push(state.courses[i]._id);
					}
					if (!conflictingIds.includes(state.courses[j]._id)) {
						conflictingIds.push(state.courses[j]._id);
					}
				}
			}
		}

		return conflictingIds;
	},
	hasTimeConflict: hasTimeConflict,
}));

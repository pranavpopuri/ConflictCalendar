import express from "express";
import { createCourse, deleteCourse, getCourses, updateCourse } from "../controllers/course.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// All course routes require authentication
router.use(authenticate);

router.get("/", getCourses);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;

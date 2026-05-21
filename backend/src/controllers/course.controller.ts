import { Request, Response } from "express";
import * as CourseService from "../services/course.service";

export async function listCourses(req: Request, res: Response) {
  try {
    const courses = await CourseService.getAllCourses();
    res.json(courses);
  } catch {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
}

export async function getCourse(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const course = await CourseService.getCourseById(id);

    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
}

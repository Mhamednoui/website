import { Router } from "express";
import { protect } from "../middleware/protect";
import { requireSubscription } from "../middleware/requireSubscription";
import { listCourses, getCourse } from "../controllers/course.controller";

const router = Router();

router.get("/", protect, requireSubscription, listCourses);
router.get("/:id", protect, requireSubscription, getCourse);

export default router;

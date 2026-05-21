import { Router } from "express";
import { protect } from "../middleware/protect";
import { requireSubscription } from "../middleware/requireSubscription";
import {
  listVideosByCourse,
  getVideo,
  getStreamUrl,
} from "../controllers/video.controller";

const router = Router();

router.get(
  "/course/:courseId",
  protect,
  requireSubscription,
  listVideosByCourse,
);
router.get("/:id", protect, requireSubscription, getVideo);
router.post("/:id/stream-url", protect, requireSubscription, getStreamUrl);

export default router;

import { Request, Response } from "express";
import * as VideoService from "../services/video.service";
import { AuthRequest } from "../middleware/protect";

export async function listVideosByCourse(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const courseId = Array.isArray(req.params.courseId)
      ? req.params.courseId[0]
      : req.params.courseId;

    const videos = await VideoService.getVideosByCourse(courseId);

    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
}

export async function getVideo(req: Request, res: Response): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const video = await VideoService.getVideoById(id);

    if (!video) {
      res.status(404).json({ error: "Video not found" });
      return;
    }

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch video" });
  }
}

export async function getStreamUrl(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const url = await VideoService.getStreamUrl(id);
    res.json({ url });
  } catch (err: any) {
    if (err.message === "Video not found") {
      res.status(404).json({ error: "Video not found" });
      return;
    }
    if (err.message === "Stream not available") {
      res.status(503).json({ error: "Stream not available yet" });
      return;
    }
    res.status(500).json({ error: "Failed to get stream URL" });
  }
}

import { Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "./protect";

export async function requireSubscription(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const sub = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!sub) {
      res.status(403).json({ error: "No active subscription" });
      return;
    }

    const now = new Date();
    if (sub.expiresAt < now || sub.clicksRemaining <= 0) {
      res.status(403).json({ error: "Subscription expired" });
      return;
    }

    next();
  } catch {
    res.status(500).json({ error: "Subscription check failed" });
  }
}

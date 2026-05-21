import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import videoRoutes from "./routes/video.routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/videos", videoRoutes);

app.get("/health", (_, res) => res.json({ status: "ok" }));

export default app;

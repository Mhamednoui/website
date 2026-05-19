import { Request, Response } from "express";
import { z } from "zod";
import { registerUser, loginUser, logoutUser } from "../services/auth.service";
import { rotateRefreshToken } from "../utils/token";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response) {
  try {
    const body = registerSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await registerUser(
      body.name,
      body.email,
      body.password,
    );
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.status(201).json({ user, accessToken });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const body = loginSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await loginUser(
      body.email,
      body.password,
    );
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.status(200).json({ user, accessToken });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const { accessToken, newRefreshToken, user } =
      await rotateRefreshToken(token);
    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken;
    if (token) await logoutUser(token);
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}

import jwt, { SignOptions } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function generateAccessToken(userId: string, role: string) {
  const options: SignOptions = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ||
      "15m") as SignOptions["expiresIn"],
  };

  return jwt.sign({ userId, role }, ACCESS_SECRET, options);
}

export async function generateRefreshToken(userId: string): Promise<string> {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });

  return token;
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as { userId: string; role: string };
}

export async function rotateRefreshToken(oldToken: string) {
  const existing = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
    include: { user: true },
  });

  if (!existing || existing.expiresAt < new Date()) {
    throw new Error("Invalid or expired refresh token");
  }

  // Delete old token (rotation)
  await prisma.refreshToken.delete({ where: { token: oldToken } });

  const accessToken = generateAccessToken(existing.userId, existing.user.role);
  const newRefreshToken = await generateRefreshToken(existing.userId);

  return { accessToken, newRefreshToken, user: existing.user };
}

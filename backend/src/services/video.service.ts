import { prisma } from "../lib/prisma";

export async function getVideosByCourse(courseId: string) {
  return prisma.video.findMany({
    where: { courseId, published: true },
    orderBy: { order: "asc" },
  });
}

export async function getVideoById(id: string) {
  return prisma.video.findFirst({
    where: { id, published: true },
  });
}

export async function getStreamUrl(videoId: string): Promise<string> {
  const video = await prisma.video.findFirst({
    where: { id: videoId, published: true },
  });

  if (!video) throw new Error("Video not found");

  // Phase 1: if hlsUrl is set directly, return it
  // Phase 2 (when CloudFront is configured): replace this block with signed URL generation
  // using @aws-sdk/cloudfront-signer — zero changes to controller/routes needed
  if (video.hlsUrl) {
    return video.hlsUrl;
  }

  throw new Error("Stream not available");
}

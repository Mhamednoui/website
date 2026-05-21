import { prisma } from "../lib/prisma";

export async function getAllCourses() {
  return prisma.course.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { videos: { where: { published: true } } } },
    },
  });
}

export async function getCourseById(id: string) {
  return prisma.course.findFirst({
    where: { id, published: true },
    include: {
      videos: {
        where: { published: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

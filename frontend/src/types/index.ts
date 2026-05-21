export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  order: number;
  _count?: { videos: number };
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  hlsUrl: string | null;
  duration: number | null;
  order: number;
  courseId: string;
}

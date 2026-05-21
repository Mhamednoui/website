"use client";
import Link from "next/link";
import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Video as VideoIcon, Play, Clock } from "lucide-react";
import api from "@/lib/axios";
import { SubscriptionWall } from "@/components/SubscriptionWall";
import { Course, Video } from "@/types";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function VideosContent() {
  const searchParams = useSearchParams();
  const courseIdParam = searchParams.get("course");

  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(
    courseIdParam,
  );
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [noSub, setNoSub] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Load courses once
  useEffect(() => {
    api
      .get<Course[]>("/api/courses")
      .then((res) => {
        setCourses(res.data);
        if (!courseIdParam && res.data.length > 0) {
          setSelectedCourse(res.data[0].id);
        }
      })
      .catch((err) => {
        if (err.response?.status === 403) setNoSub(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // Load videos when selected course changes
  useEffect(() => {
    if (!selectedCourse) return;

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (!cancelled) setVideosLoading(true);
        return api.get<Video[]>(`/api/videos/course/${selectedCourse}`);
      })
      .then((res) => {
        if (!cancelled) setVideos(res.data);
      })
      .catch(() => {
        if (!cancelled) setVideos([]);
      })
      .finally(() => {
        if (!cancelled) setVideosLoading(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [selectedCourse]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 h-7 w-32 bg-slate-800 rounded animate-pulse" />
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-28 bg-slate-800 rounded-full animate-pulse shrink-0"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-xl h-48 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (noSub) return <SubscriptionWall />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Videos</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Select a course to browse its videos
        </p>
      </div>

      {/* Course filter tabs */}
      {courses.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCourse === course.id
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {course.title}
            </button>
          ))}
        </div>
      )}

      {/* Video grid */}
      {videosLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-xl h-48 animate-pulse"
            />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <VideoIcon size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            No videos in this course yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/videos/${video.id}`}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition-colors"
            >
              <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <VideoIcon size={32} className="text-slate-600" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="bg-indigo-600 rounded-full p-3">
                    <Play size={18} className="text-white fill-white" />
                  </div>
                </div>
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Clock size={10} />
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {video.title}
                </h3>
                {video.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {video.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense>
      <VideosContent />
    </Suspense>
  );
}

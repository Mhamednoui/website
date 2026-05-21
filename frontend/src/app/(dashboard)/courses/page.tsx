"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Video, ChevronRight } from "lucide-react";
import api from "@/lib/axios";
import { SubscriptionWall } from "@/components/SubscriptionWall";
import { Course } from "@/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [noSub, setNoSub] = useState(false);
  useEffect(() => {
    api
      .get<Course[]>("/api/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => {
        if (err.response?.status === 403) setNoSub(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="h-7 w-40 bg-slate-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-slate-800 rounded animate-pulse" />
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Courses</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {courses.length} course{courses.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <BookOpen size={36} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/videos?course=${course.id}`}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition-colors"
            >
              <div className="aspect-video bg-slate-800 flex items-center justify-center">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen size={32} className="text-slate-600" />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                {course.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {course.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Video size={13} />
                    <span>{course._count?.videos ?? 0} videos</span>
                  </div>
                  <ChevronRight
                    size={15}
                    className="text-slate-600 group-hover:text-indigo-400 transition-colors"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

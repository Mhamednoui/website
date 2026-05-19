"use client";

import { useAuthStore } from "@/stores/authStore";
import { BookOpen, Video, ClipboardList, Zap } from "lucide-react";

const stats = [
  {
    label: "Courses",
    value: "0",
    icon: BookOpen,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Videos watched",
    value: "0",
    icon: Video,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    label: "Exams taken",
    value: "0",
    icon: ClipboardList,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    label: "Clicks remaining",
    value: "—",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Here&apos;s what&apos;s happening with your preparation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4"
          >
            <div className={`${bg} rounded-lg p-2.5`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-base font-semibold text-white">
              No active subscription
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Get access to all courses, videos, and exams.
            </p>
          </div>

          <a
            href="/pricing"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            View plans
          </a>
        </div>
      </div>
    </div>
  );
}

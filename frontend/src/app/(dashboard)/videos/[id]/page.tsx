"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowLeft, Clock, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { Video } from "@/types";

// Dynamically import VideoPlayer — no SSR, video.js is browser-only
const VideoPlayer = dynamic(() => import("@/components/VideoPlayer"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
      <Loader2 size={32} className="text-indigo-400 animate-spin" />
    </div>
  ),
});

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type PageState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "no_stream" }
  | { status: "ready"; video: Video; streamUrl: string };

export default function VideoPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [state, setState] = useState<PageState>({ status: "loading" });

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        // Fetch video metadata and stream URL in parallel
        const [videoRes, streamRes] = await Promise.all([
          api.get<Video>(`/api/videos/${id}`),
          api.post<{ url: string }>(`/api/videos/${id}/stream-url`),
        ]);

        setState({
          status: "ready",
          video: videoRes.data,
          streamUrl: streamRes.data.url,
        });
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } }).response
          ?.status;
        if (status === 404) {
          setState({ status: "error", message: "Video not found." });
        } else if (status === 403) {
          setState({
            status: "error",
            message: "Subscription required to watch videos.",
          });
        } else if (status === 503) {
          setState({ status: "no_stream" });
        } else {
          setState({ status: "error", message: "Failed to load video." });
        }
      }
    }

    load();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors group"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        Back to videos
      </button>

      {state.status === "loading" && (
        <div className="space-y-4">
          <div className="w-full aspect-video bg-slate-900 rounded-xl animate-pulse" />
          <div className="h-6 w-2/3 bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-4/5 bg-slate-800 rounded animate-pulse" />
        </div>
      )}

      {state.status === "error" && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500/10 rounded-full p-4">
                <AlertCircle size={28} className="text-red-400" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Unable to load video
            </h2>
            <p className="text-slate-400 text-sm">{state.message}</p>
          </div>
        </div>
      )}

      {state.status === "no_stream" && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full">
            <div className="flex justify-center mb-4">
              <div className="bg-amber-500/10 rounded-full p-4">
                <BookOpen size={28} className="text-amber-400" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              Video coming soon
            </h2>
            <p className="text-slate-400 text-sm">
              This video has not been uploaded yet. Check back later.
            </p>
          </div>
        </div>
      )}

      {state.status === "ready" && (
        <div className="space-y-6">
          {/* Player */}
          <div className="w-full rounded-xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-slate-800">
            <VideoPlayer
              src={state.streamUrl}
              poster={state.video.thumbnailUrl ?? undefined}
            />
          </div>

          {/* Video info */}
          <div className="space-y-3">
            <h1 className="text-xl font-bold text-white leading-snug">
              {state.video.title}
            </h1>

            {state.video.duration && (
              <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                <Clock size={14} />
                <span>{formatDuration(state.video.duration)}</span>
              </div>
            )}

            {state.video.description && (
              <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-800 pt-4">
                {state.video.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

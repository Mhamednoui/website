"use client";

import { useEffect, useRef } from "react";
import "video.js/dist/video-js.css";

interface VideoJsPlayer {
  on: (event: string, callback: () => void) => void;
  dispose: () => void;
  isDisposed: () => boolean;
}

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onReady?: (player: VideoJsPlayer) => void;
}

export default function VideoPlayer({
  src,
  poster,
  onReady,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  useEffect(() => {
    async function initPlayer() {
      const videojs = (await import("video.js")).default;

      if (!videoRef.current) return;

      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = videojs(videoElement, {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        poster: poster ?? undefined,
        sources: [{ src, type: "application/x-mpegURL" }],
        html5: {
          vhs: { overrideNative: true },
          nativeAudioTracks: false,
          nativeVideoTracks: false,
        },
      }) as unknown as VideoJsPlayer;

      playerRef.current = player;
      player.on("ready", () => {
        onReady?.(player);
      });
    }

    initPlayer();

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}

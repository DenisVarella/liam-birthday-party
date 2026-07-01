"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import { partyMusic } from "@/lib/event-data";

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (
        elementId: string,
        options: {
          height: string;
          width: string;
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
          };
        },
      ) => YTPlayer;
    };
  }
}

const YT_SCRIPT_ID = "youtube-iframe-api";
const PLAYER_CONTAINER_ID = "party-background-music-player";

/** Carrega a YouTube IFrame API uma única vez. */
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  return new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    if (!document.getElementById(YT_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = YT_SCRIPT_ID;
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

/**
 * Trilha sonora da festa via YouTube embed oculto.
 * Autoplay com som é bloqueado pelos navegadores — inicia mudo e ativa no primeiro toque/clique.
 */
export function BackgroundMusic() {
  const playerRef = useRef<YTPlayer | null>(null);
  const blockAutoUnmuteRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [audible, setAudible] = useState(false);

  const enableSound = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    player.unMute();
    player.setVolume(60);
    player.playVideo();
    setAudible(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void loadYouTubeAPI().then(() => {
      if (cancelled || !window.YT) return;

      playerRef.current = new window.YT.Player(PLAYER_CONTAINER_ID, {
        height: "200",
        width: "200",
        videoId: partyMusic.youtubeVideoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          loop: 1,
          playlist: partyMusic.youtubeVideoId,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            event.target.mute();
            event.target.playVideo();
            setReady(true);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready || audible || blockAutoUnmuteRef.current) return;

    const onFirstInteraction = () => {
      enableSound();
    };

    document.addEventListener("click", onFirstInteraction, { once: true });
    document.addEventListener("touchstart", onFirstInteraction, { once: true });

    return () => {
      document.removeEventListener("click", onFirstInteraction);
      document.removeEventListener("touchstart", onFirstInteraction);
    };
  }, [ready, audible, enableSound]);

  const toggleMute = (event: React.MouseEvent) => {
    event.stopPropagation();

    const player = playerRef.current;
    if (!player) return;

    if (player.isMuted()) {
      enableSound();
      return;
    }

    player.mute();
    setAudible(false);
    blockAutoUnmuteRef.current = true;
  };

  return (
    <>
      {/* Iframe fora da tela — dimensões mínimas exigidas pelo YouTube para reproduzir */}
      <div
        className="pointer-events-none fixed top-0 left-[-9999px] h-[200px] w-[200px] overflow-hidden opacity-0"
        aria-hidden
      >
        <div id={PLAYER_CONTAINER_ID} />
      </div>

      {ready && (
        <button
          type="button"
          onClick={toggleMute}
          className="fixed right-4 bottom-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/90 text-coral shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-white sm:right-6 sm:bottom-6"
          aria-label={audible ? "Silenciar música da festa" : "Ativar música da festa"}
          title={audible ? "Silenciar" : "Ativar trilha sonora"}
        >
          {audible ? (
            <Music className="h-5 w-5" aria-hidden />
          ) : (
            <VolumeX className="h-5 w-5" aria-hidden />
          )}
        </button>
      )}
    </>
  );
}

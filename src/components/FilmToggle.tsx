"use client";
import { useEffect, useState } from "react";

// The case hero's play control (the kit's film hero: a film plays on a click on a kind-other page, never by itself).
// Without script the video keeps its native controls; with script this one button plays and pauses it.
export function FilmToggle({ video, playLabel, pauseLabel, note }: { video: string; playLabel: string; pauseLabel: string; note: string }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const v = document.getElementById(video) as HTMLVideoElement | null;
    if (!v) return;
    v.controls = false;
    const sync = () => setPlaying(!v.paused);
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    return () => {
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
    };
  }, [video]);
  const toggle = () => {
    const v = document.getElementById(video) as HTMLVideoElement | null;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };
  return (
    <button type="button" className="ly-play" onClick={toggle} aria-controls={video}>
      <span className="ly-play__disc">
        <svg viewBox="0 0 18 18" aria-hidden="true">
          {playing ? <path d="M4 2h3.5v14H4zM10.5 2H14v14h-3.5z" fill="currentColor" /> : <path d="M4.5 2.6v12.8c0 .8.9 1.3 1.6.9l10.3-6.4c.6-.4.6-1.3 0-1.7L6.1 1.7c-.7-.4-1.6.1-1.6.9Z" fill="currentColor" />}
        </svg>
      </span>
      <span className="ly-play__label">
        {playing ? pauseLabel : playLabel}
        <small>{note}</small>
      </span>
    </button>
  );
}

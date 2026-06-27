"use client";

import { useEffect, useState } from "react";
import { eventInfo } from "@/lib/event-data";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type CountdownState = TimeLeft | "past" | null;

function calculateTimeLeft(): CountdownState {
  const target = new Date(eventInfo.dateISO).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return "past";

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const units = [
  { key: "days" as const, label: "Dias" },
  { key: "hours" as const, label: "Horas" },
  { key: "minutes" as const, label: "Min" },
  { key: "seconds" as const, label: "Seg" },
];

/** Contagem regressiva até o dia da festa. */
export function Countdown() {
  const [state, setState] = useState<CountdownState>(null);

  useEffect(() => {
    const tick = () => setState(calculateTimeLeft());
    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (state === "past") {
    return (
      <p className="rounded-2xl bg-white/70 px-6 py-4 text-center font-display text-xl font-bold text-coral backdrop-blur-sm">
        🎉 É hoje! Nos vemos na festa!
      </p>
    );
  }

  if (state === null) {
    return (
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {units.map((unit) => (
          <div
            key={unit.key}
            className="flex flex-col items-center rounded-2xl bg-white/70 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-5"
          >
            <span className="font-display text-2xl font-bold text-blue sm:text-3xl">
              --
            </span>
            <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-foreground/60">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      {units.map((unit) => (
        <div
          key={unit.key}
          className="flex flex-col items-center rounded-2xl bg-white/70 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-5"
        >
          <span className="font-display text-2xl font-bold text-blue sm:text-3xl">
            {String(state[unit.key]).padStart(2, "0")}
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-foreground/60">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

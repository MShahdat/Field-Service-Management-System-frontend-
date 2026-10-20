"use client";

import {
  ClipboardList,
  CreditCard,
  FileCheck2,
  type LucideIcon,
  UserCheck,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type FlowStep = {
  label: string;
  caption: string;
  icon: LucideIcon;
};

const STEPS: FlowStep[] = [
  { label: "Request", caption: "Request created", icon: ClipboardList },
  { label: "Assign", caption: "Technician assigned", icon: UserCheck },
  { label: "Start", caption: "Job started", icon: Wrench },
  { label: "Report", caption: "Report uploaded", icon: FileCheck2 },
  { label: "Pay", caption: "Paid and rated", icon: CreditCard },
];

const TOTAL = STEPS.length;

// Timing (ms)
const READY_MS = 1400; // idle state "0/5"
const STEP_MS = 1500; // time spent on each step
const DONE_MS = 3000; // hold on "5/5" before restarting

// Geometry, in % of the square container (SVG viewBox is 0..100)
const RING_R = 32;
const LABEL_R = 45;

/** Point on the ring for step index i. Step 0 sits at 12 o'clock, going clockwise. */
function polar(i: number, r: number) {
  const angle = ((-90 + (i * 360) / TOTAL) * Math.PI) / 180;
  return { x: 50 + r * Math.cos(angle), y: 50 + r * Math.sin(angle) };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * Looping animation of the full service flow:
 * Request -> Assign -> Start -> Report -> Pay.
 *
 * `step` is how many stages are reached (0 = ready, 5 = paid and rated).
 */
export function ServiceFlowAnimation({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setStep(TOTAL);
      return;
    }
    const delay = step === 0 ? READY_MS : step === TOTAL ? DONE_MS : STEP_MS;
    const timer = setTimeout(() => {
      setStep((s) => (s === TOTAL ? 0 : s + 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [step, reducedMotion]);

  // The red arc ends exactly on the active node. At 5/5 it closes the loop.
  const progress = step === TOTAL ? 1 : Math.max(step - 1, 0) / TOTAL;
  const caption = step === 0 ? "Ready" : STEPS[step - 1].caption;

  return (
    <div
      role="img"
      aria-label="How a service works: request, assign a technician, start the job, upload a report, then pay and rate."
      className={cn(
        "relative mx-auto aspect-square w-full max-w-md select-none",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Rings */}
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
        >
          {/* Dashed track for the stages not reached yet */}
          <circle
            cx="50"
            cy="50"
            r={RING_R}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="0.5"
            strokeDasharray="1 1.8"
          />
          {/* Solid progress arc */}
          <circle
            cx="50"
            cy="50"
            r={RING_R}
            fill="none"
            className="stroke-primary"
            strokeWidth="0.9"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - progress}
            transform="rotate(-90 50 50)"
            style={{
              opacity: step >= 2 ? 1 : 0,
              transition: reducedMotion
                ? "none"
                : "stroke-dashoffset 700ms cubic-bezier(0.65, 0, 0.35, 1), opacity 300ms",
            }}
          />
        </svg>

        {/* Center readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="font-semibold tabular-nums tracking-tight text-foreground text-3xl">
            {step}/{TOTAL}
          </div>
          <div className="mt-1 max-w-[9rem] text-sm leading-tight text-muted-foreground sm:text-base">
            {caption}
          </div>
        </div>

        {/* Nodes + labels */}
        {STEPS.map((s, i) => {
          const node = polar(i, RING_R);
          const label = polar(i, LABEL_R);
          const done = i < step - 1;
          const active = i === step - 1;
          const reached = done || active;
          const Icon = s.icon;

          return (
            <div key={s.label}>
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                {active && !reducedMotion && (
                  <span className="absolute inset-0 rounded-full bg-primary/30 motion-safe:animate-ping" />
                )}
                <div
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-full border-2 transition-all duration-500 sm:size-11",
                    reached
                      ? "border-primary bg-primary text-primary-foreground shadow-lg"
                      : "border-border bg-card text-muted-foreground shadow-sm",
                    active &&
                    "scale-110 shadow-[0_0_0_6px_color-mix(in_oklch,var(--primary)_25%,transparent)]",
                  )}
                >
                  <Icon className="size-4 sm:size-[18px]" />
                </div>
              </div>

              <span
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 text-xs transition-all duration-500 sm:text-sm",
                  reached
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
                style={{ left: `${label.x}%`, top: `${label.y}%` }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

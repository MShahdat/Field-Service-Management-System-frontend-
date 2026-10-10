import { Clock, ShieldCheck, Star } from "lucide-react";
import React from "react";

const steps = [
  {
    n: "01",
    title: "Book a service",
    body: "Tell us what's broken, pick a time slot, and we match you with a nearby pro.",
  },
  {
    n: "02",
    title: "Technician arrives",
    body: "Track your booking status in real time, from accepted to in-progress.",
  },
  {
    n: "03",
    title: "Pay & review",
    body: "Pay securely once the job's done, then rate your technician.",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Vetted, not just verified",
    body: "Every technician passes a background check and a skills review before they touch a single job.",
  },
  {
    icon: Clock,
    title: "On time, or we make it right",
    body: "Live status updates mean no guessing when your technician will show up.",
  },
  {
    icon: Star,
    title: "Reviewed by real customers",
    body: "Ratings are tied to completed jobs only — no fake five-stars.",
  },
];

const HowWhy = () => {
  function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
      <div className="inline-flex flex-col items-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {children}
        </span>
        <span className="mt-3 h-px w-8 bg-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="mb-12 sm:mb-14 text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
            From &ldquo;it&apos;s broken&rdquo; to &ldquo;it&apos;s
            fixed.&rdquo;
          </h2>
        </div>
        <div className="grid gap-8 sm:gap-10 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="relative border-l-2 border-border pl-6"
            >
              <span className="font-mono text-sm text-primary">{step.n}</span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-secondary/40 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-12 sm:mb-14 text-center">
            <Eyebrow>Why FixItNow</Eyebrow>
            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
              We take reliability personally.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-card p-6 sm:p-7"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border">
                  <v.icon
                    className="h-4.5 w-4.5 text-primary"
                    strokeWidth={1.75}
                  />
                </div>
                <h3 className="mt-5 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowWhy;

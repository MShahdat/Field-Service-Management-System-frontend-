import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  Clock,
  CreditCard,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const steps = [
  {
    n: "01",
    icon: CalendarCheck,
    title: "Book a service",
    body: "Tell us what's broken, pick a time slot, and we match you with a nearby pro.",
  },
  {
    n: "02",
    icon: Truck,
    title: "Technician arrives",
    body: "Track your booking status in real time, from accepted to in-progress.",
  },
  {
    n: "03",
    icon: CreditCard,
    title: "Pay & review",
    body: "Pay securely once the job's done, then rate your technician.",
  },
];

const values = [
  {
    icon: ShieldCheck,
    proof: "Background-checked",
    title: "Vetted, not just verified",
    body: "Every technician passes a background check and a skills review before they touch a single job.",
  },
  {
    icon: Clock,
    proof: "Live tracking",
    title: "On time, or we make it right",
    body: "Live status updates mean no guessing when your technician will show up.",
  },
  {
    icon: Star,
    proof: "Job-linked ratings",
    title: "Reviewed by real customers",
    body: "Ratings are tied to completed jobs only — no fake five-stars.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
    >
      <BadgeCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
      {children}
    </Badge>
  );
}

const HowWhy = () => {
  return (
    <div>
      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-4xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="mb-12 flex flex-col items-center text-center sm:mb-14">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-4 max-w-xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            From &ldquo;it&rsquo;s broken&rdquo; to &ldquo;it&rsquo;s
            fixed.&rdquo;
          </h2>
          <p className="mt-3 max-w-md text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
            Three steps, fully tracked in your dashboard.
          </p>
        </div>
        <ol className="relative grid gap-5 sm:grid-cols-3">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-11 hidden border-t border-dashed border-border sm:block"
          />
          {steps.map((step, i) => (
            <li
              key={step.n}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-1 select-none text-6xl font-bold tabular-nums text-primary/5 dark:text-primary/20"
              >
                {step.n}
              </span>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-primary/10">
                <step.icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </div>
              <p className="relative mt-5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Step {step.n}
              </p>
              <h3 className="relative mt-1 text-base font-semibold">
                {step.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3.5 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm sm:flex"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-secondary/40 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col items-center text-center sm:mb-14">
            <Eyebrow>Why FieldDesk</Eyebrow>
            <h2 className="mt-4 max-w-xl text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              We take reliability personally.
            </h2>
            <p className="mt-3 max-w-md text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
              The safeguards that make every booking feel safe.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-3">
            {values.map((v) => (
              <li
                key={v.title}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border border-t-2 border-t-primary/70 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-7"
              >
                <v.icon
                  aria-hidden
                  strokeWidth={1}
                  className="pointer-events-none absolute -right-6 -bottom-7 h-32 w-32 text-primary/5 dark:text-primary/20 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="relative flex justify-end">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-primary shadow-sm">
                    <v.icon
                      className="h-5 w-5"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </span>
                </div>
                <h3 className="relative mt-5 font-semibold">{v.title}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {v.body}
                </p>
                <p className="relative mt-5 flex items-center gap-1.5 border-t border-dashed border-border pt-4 text-xs font-medium text-primary">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  {v.proof}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/technician">
                Find your technician
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/support">How booking works</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowWhy;

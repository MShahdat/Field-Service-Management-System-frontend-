import { BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HowWhy from "@/shared/how-why";

const stats = [
  { label: "Vetted technicians", value: "1,200+" },
  { label: "Service categories", value: "40+" },
  { label: "Cities covered", value: "18" },
  { label: "Avg. rating", value: "4.8/5" },
];

const pillars = [
  {
    icon: ShieldCheck,
    title: "Verified before day one",
    body: "Background checks, skills reviews, and manager-approved onboarding. No one touches a job until they clear every gate.",
  },
  {
    icon: BadgeCheck,
    title: "Tracked end to end",
    body: "Every booking moves through visible states — Pending to Assigned to In Progress to Completed — with work-order history to prove it.",
  },
  {
    icon: MapPin,
    title: "Local, on time",
    body: "Region-based matching pairs you with nearby pros on Asia/Dhaka schedules, with live en-route and start updates.",
  },
];

const audiences = [
  {
    title: "Homeowners",
    body: "Book in minutes, track in real time, and pay securely once the job is done — with job-linked reviews you can trust.",
    cta: { label: "Find a technician", href: "/technician" },
  },
  {
    title: "Technicians",
    body: "A steady stream of local jobs, clear weekly availability, and payouts released when customers mark work complete.",
    cta: { label: "Join as a pro", href: "/register" },
  },
  {
    title: "Managers",
    body: "Region oversight, technician assignment, and service quality control — with a verification pipeline for every new manager.",
    cta: { label: "Apply as manager", href: "/manager-apply" },
  },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
    >
      {children}
    </Badge>
  );
}

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 pt-16 sm:pt-24 pb-14 sm:pb-16 text-center">
        <Eyebrow>Our story</Eyebrow>
        <h1 className="mt-6 text-balance text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
          Every home,
          <br />
          <span className="text-primary">one call away.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base sm:text-lg leading-relaxed text-muted-foreground">
          FieldDesk connects homeowners with vetted, local technicians for
          everything from a leaky faucet to a full rewiring job — booked in
          minutes, tracked in real time, paid for with a tap.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/technician">Browse services</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-border" asChild>
            <Link href="/register">Become a technician</Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <dl className="mx-auto grid max-w-4xl grid-cols-2 sm:grid-cols-4 divide-x divide-border">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-7 sm:py-9 text-center">
              <dd className="text-2xl sm:text-3xl font-semibold tabular-nums">
                {s.value}
              </dd>
              <dt className="mt-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Mission pillars */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="mb-12 flex flex-col items-center text-center sm:mb-14">
          <Eyebrow>What we stand for</Eyebrow>
          <h2 className="mt-4 max-w-xl text-balance text-2xl sm:text-3xl font-semibold tracking-tight">
            Reliability is the product.
          </h2>
          <p className="mt-3 max-w-md text-balance text-sm sm:text-base leading-relaxed text-muted-foreground">
            Three standards behind every booking on the platform.
          </p>
        </div>
        <ul className="grid gap-5 sm:grid-cols-3">
          {pillars.map((p) => (
            <li
              key={p.title}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-7"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <p.icon
                  className="h-5 w-5 text-primary"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <h3 className="mt-5 font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <HowWhy />

      {/* Who we serve */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="mb-12 flex flex-col items-center text-center sm:mb-14">
          <Eyebrow>Who we serve</Eyebrow>
          <h2 className="mt-4 max-w-xl text-balance text-2xl sm:text-3xl font-semibold tracking-tight">
            Built for everyone on the job.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 sm:p-7"
            >
              <h3 className="font-semibold">{a.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {a.body}
              </p>
              <Button
                variant="link"
                className="mt-4 h-auto p-0 justify-start text-primary"
                asChild
              >
                <Link href={a.cta.href}>{a.cta.label} →</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h2 className="text-balance text-2xl sm:text-3xl font-semibold tracking-tight">
            Ready to get something fixed?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Post a job, compare technicians, and book the right one in minutes.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <Link href="/technician">Get started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/support">Talk to support</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

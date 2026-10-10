import Link from "next/link";
import { Button } from "@/components/ui/button";
import HowWhy from "@/shared/how-why";



const stats = [
  { label: "Vetted technicians", value: "1,200+" },
  { label: "Service categories", value: "40+" },
  { label: "Cities covered", value: "18" },
  { label: "Avg. rating", value: "4.8/5" },
];


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

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-14 sm:pb-16 text-center">
        <Eyebrow>Our story</Eyebrow>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-balance">
          Every home,
          <br />
          <span className="text-primary">one call away.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-base sm:text-lg leading-relaxed text-muted-foreground">
          FixItNow connects homeowners with vetted, local technicians for
          everything from a leaky faucet to a full rewiring job — booked in
          minutes, tracked in real time, paid for with a tap.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <Link href="/services">Browse services</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-border" asChild>
            <Link href="/auth/register">Become a technician</Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-7 sm:py-9 text-center">
              <div className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums">
                {s.value}
              </div>
              <div className="mt-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <HowWhy />

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
          Ready to get something fixed?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          Post a job, compare technicians, and book the right one in minutes.
        </p>
        <Button size="lg" className="mt-7 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
          <Link href="/">Get started</Link>
        </Button>
      </section>
    </div>
  );
}
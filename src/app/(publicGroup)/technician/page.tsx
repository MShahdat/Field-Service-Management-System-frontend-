import { CalendarCheck, MapPin, ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import TechnicianDirectory from "@/components/module/technician/technician-directory";
import { TechnicianDirectorySkeleton } from "@/components/module/technician/technician-skeleton";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Find a technician | FieldDesk",
  description:
    "Browse verified local technicians by skill, region, and weekly availability.",
};

const TechnicianPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background">
      {/* <section className="border-b border-border">
        <div className="mx-auto max-w-11/12 px-4 py-12 sm:px-6 sm:py-16">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="gap-1.5 rounded-full border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <ShieldCheck className="size-3.5 text-primary" aria-hidden />
              Verified professionals
            </Badge>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Find a technician you can trust.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Browse vetted local pros by skill, area, and weekly availability —
              then view the full profile before you book.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" aria-hidden />
                Email-verified profiles
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4 text-primary" aria-hidden />
                Matched to your region
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarCheck className="size-4 text-primary" aria-hidden />
                Weekly availability published
              </span>
            </div>
          </div>
        </div>
      </section> */}

      <section className="mx-auto max-w-11/12 px-4 py-8 sm:px-6">
        <Suspense fallback={<TechnicianDirectorySkeleton />}>
          <TechnicianDirectory />
        </Suspense>
      </section>
    </div>
  );
};

export default TechnicianPage;

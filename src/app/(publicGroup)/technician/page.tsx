
import { Suspense } from "react";
import TechnicianDirectory from "@/components/module/technician/technician-directory";
import { TechnicianDirectorySkeleton } from "@/components/module/technician/technician-skeleton";

export const metadata = {
  title: "Find a technician | FieldDesk",
  description:
    "Browse verified local technicians by skill, region, and weekly availability.",
};

const TechnicianPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-background to-background">
      <section className="mx-auto max-w-11/12 px-4 py-8 sm:px-6">
        <Suspense fallback={<TechnicianDirectorySkeleton />}>
          <TechnicianDirectory />
        </Suspense>
      </section>
    </div>
  );
};

export default TechnicianPage;

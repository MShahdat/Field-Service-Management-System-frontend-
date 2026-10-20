import { Suspense } from "react";
import TechnicianDetailsPage from "@/components/module/technician/technician-details-page";
import DetailsSkeleton from "@/loading/details-loading";
import Breadcrumb from "@/shared/breadcrumb";

export const metadata = {
  title: "Technician profile | FieldDesk",
  description:
    "View technician skills, service areas, availability, and contact details.",
};

const Page = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumb
        backHref="/technician"
        back="Technicians"
        current="Technician profile"
      />

      <Suspense fallback={<DetailsSkeleton />}>
        <TechnicianDetailsPage />
      </Suspense>
    </div>
  );
};

export default Page;

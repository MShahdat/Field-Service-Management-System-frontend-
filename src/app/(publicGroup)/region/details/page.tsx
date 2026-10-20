import { Suspense } from "react";
import PubRegionDetailsPage from "@/components/module/region/pub-region-details-page";
import DetailsSkeleton from "@/loading/details-loading";
import Breadcrumb from "@/shared/breadcrumb";

export const metadata = {
  title: "Region details | FieldDesk",
  description:
    "View service area details, region managers, and technicians covering the region.",
};

const Page = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumb backHref="/region" back="Regions" current="Region details" />

      <Suspense fallback={<DetailsSkeleton />}>
        <PubRegionDetailsPage />
      </Suspense>
    </div>
  );
};

export default Page;

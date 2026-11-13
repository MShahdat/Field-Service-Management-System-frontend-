import { Suspense } from "react";
import PubCategoryDetailsPage from "@/components/module/cetegory/pub-category-details-page";
import DetailsSkeleton from "@/loading/details-loading";
import Breadcrumb from "@/shared/breadcrumb";

export const metadata = {
  title: "Category details | FieldDesk",
  description:
    "View category information, available skills, and technicians serving this category.",
};

const Page = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Breadcrumb
        backHref="/category"
        back="Categories"
        current="Category details"
      />

      <Suspense fallback={<DetailsSkeleton />}>
        <PubCategoryDetailsPage />
      </Suspense>
    </div>
  );
};

export default Page;

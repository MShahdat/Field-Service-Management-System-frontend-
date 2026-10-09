"use client";

import { useGetAllFeedback } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import Paginations from "@/shared/pagination";
import { useSearchParams } from "next/navigation";
import FeedbackTeable from "./feedback-table";
import { Suspense } from "react";

const FeedbackLists = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending } = useGetAllFeedback(params);

  if (isPending) {
    return <GenericTableSkeleton rowCount={8} columnCount={8} />;
  }

  if (!data?.success || data?.data.length === 0) {
    return (
      <DataNotFoundCard
        message="Feedback not found"
        description="There was not created any feedback yet!"
      />
    );
  }

  const feedbacks = data?.data ?? [];

  return (
    <div className="space-y-4">
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        <FeedbackTeable feedbacks={feedbacks} />
      </Suspense>
      <Paginations meta={data?.meta} />
    </div>
  );
};

export default FeedbackLists;

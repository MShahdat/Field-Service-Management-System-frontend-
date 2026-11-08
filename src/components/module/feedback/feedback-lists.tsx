"use client";

import { useGetAllFeedback } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import Paginations from "@/shared/pagination";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import FeedbackTable from "./feedback-table";
import ShowCount from "@/shared/show.count";

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
      <ShowCount length={feedbacks?.length} meta={data?.meta} title="feedbacks" />
      <Suspense
        fallback={<GenericTableSkeleton rowCount={8} columnCount={8} />}
      >
        <FeedbackTable feedbacks={feedbacks} meta={data?.meta} />
      </Suspense>
      <Paginations meta={data?.meta} />
    </div>
  );
};

export default FeedbackLists;

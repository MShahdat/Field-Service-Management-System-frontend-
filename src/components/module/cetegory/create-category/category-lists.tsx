"use client";

import { useGetAllCategories } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CategoryTable from "./category-table";
import Paginations from "@/shared/pagination";

const CategoryLists = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending } = useGetAllCategories(params);

  // console.log("category ", data);

  if (isPending) {
    return <GenericTableSkeleton rowCount={8} columnCount={6} />;
  }

  if (!data?.success) {
    return <DataNotFoundCard />;
  }
  return (
    <div className="space-y-4">
      <Suspense
        fallback={<GenericTableSkeleton rowCount={6} columnCount={8} />}
      >
        <CategoryTable categories={data?.data} />
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default CategoryLists;

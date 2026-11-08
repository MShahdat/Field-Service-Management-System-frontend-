"use client";

import { useGetAllCategories } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CategoryTable from "./category-table";
import Paginations from "@/shared/pagination";
import ShowCount from "@/shared/show.count";

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

  const categories = data?.data ?? []


  return (
    <div className="space-y-4">
      <ShowCount length={categories.length} meta={data?.meta} title="categories" />
      <Suspense
        fallback={<GenericTableSkeleton rowCount={6} columnCount={8} />}
      >
        <CategoryTable categories={data?.data} meta={data?.meta} />
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default CategoryLists;

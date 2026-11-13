"use client";

import { useGetCategories } from "@/hooks";
import DataNotFoundCard from "@/shared/data-not-found";
import { ICategory } from "@/types";
import PublicCategoryCard from "./pub-category-card";
import { useSearchParams } from "next/navigation";
import Paginations from "@/shared/pagination";
import { CardSkeleton } from "@/loading";
import { cn } from "cn";

type Props = {
  categories?: ICategory[];
  className?: string;
};

const PublicCategoryLists = ({
  categories: propCategories,
  className,
}: Props) => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending, isError } = useGetCategories(params);

  if (isPending) {
    return <CardSkeleton />;
  }

  if (isError) {
    return <DataNotFoundCard />;
  }

  const categories = propCategories ?? (data?.data ?? []);

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",
          className,
        )}
      >
        {categories.map((category: ICategory) => {
          return (
            <PublicCategoryCard
              key={category.id}
              category={category}
            />
          );
        })}
      </div>
      {!propCategories && <Paginations meta={data?.meta} />}
    </>
  );
};

export default PublicCategoryLists;

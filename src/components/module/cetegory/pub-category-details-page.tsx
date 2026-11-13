"use client";

import { useSearchParams } from "next/navigation";
import { useGetSingleCategory } from "@/hooks";
import DetailsSkeleton from "@/loading/details-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import PubCategoryDetails from "./pub-category-details";
import type { ISkills, ITechnician } from "@/types";
import { dedupeTechniciansById } from "@/utils";

const PubCategoryDetailsPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data: categoryData,
    isPending: categoryPending,
    isError: categoryError,
  } = useGetSingleCategory(id as string);


  if (!id) {
    return (
      <DataNotFoundCard
        message="Category not selected"
        description="Open a category from the directory to view its details and technicians."
      />
    );
  }

  if (categoryPending) {
    return <DetailsSkeleton />;
  }

  if (categoryError || !categoryData?.success) {
    return (
      <DataNotFoundCard
        message="Category not found"
        description="This category may have been removed or is no longer available."
      />
    );
  }

  const category = categoryData?.data;
  const technicians: ITechnician[] = dedupeTechniciansById(
    (category?.skill ?? []).flatMap((skill: ISkills) => skill.technician ?? []),
  );


  console.log('technicians ', technicians)

  return (
    <PubCategoryDetails
      category={category}
      technicians={technicians}
    />
  );
};

export default PubCategoryDetailsPage;

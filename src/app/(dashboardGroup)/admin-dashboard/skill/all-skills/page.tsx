"use client";

import { RegionModal } from "@/components/module/region/region-modal";
import RegionTable from "@/components/module/region/region-table";
import { SkillModal } from "@/components/module/skill/skill-modal";
import SkillsTable from "@/components/module/skill/skill-table";
import { useGetAllRegions, useGetAllSkills, useGetCategories } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { ItemShow } from "@/shared/items-show";
import Paginations from "@/shared/pagination";
import SearchBar from "@/shared/search-bar";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AllSkillPage = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending } = useGetAllSkills(params);

  const { data: categoriesData, isPending: categoriesPending } =
    useGetCategories();

  console.log("skills ", data);

  if (isPending || categoriesPending) {
    return <p>loading...</p>;
  }

  if (!data?.success || !categoriesData?.success) {
    return <DataNotFoundCard />;
  }

  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flxe flex-col space-y-6">
        <div className="rounded-2xl border border-border bg-card px-4 sm:px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <p className="whitespace-nowrap text-lg sm:text-xl font-semibold">
                  Skill Management
                </p>
                <SearchBar />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="whitespace-nowrap">Show</span>
                <ItemShow />
              </div>
              <div>
                <SkillModal mode="create" categories={categoriesData?.data} />
              </div>
            </div>
          </div>
        </div>

        <Suspense
          fallback={<GenericTableSkeleton rowCount={6} columnCount={8} />}
        >
          <SkillsTable skills={data?.data} />
        </Suspense>

        <Paginations meta={data?.meta} />
      </div>
    </div>
  );
};

export default AllSkillPage;

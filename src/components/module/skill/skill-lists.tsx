"use client";

import { useGetAllSkills } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SkillsTable from "./skill-table";
import Paginations from "@/shared/pagination";
import ShowCount from "@/shared/show.count";

const SkillLists = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isPending } = useGetAllSkills(params);

  if (isPending) {
    return <GenericTableSkeleton columnCount={6} rowCount={8} />;
  }

  if (!data?.success) {
    return (
      <DataNotFoundCard
        message="Skills not found"
        description="There was no skills created yet by admin"
      />
    );
  }

  const skills = data?.data ?? []

  return (
    <div className="space-y-4">
      <ShowCount length={skills?.length} meta={data?.meta} title="skills" />
      <Suspense
        fallback={<GenericTableSkeleton rowCount={6} columnCount={8} />}
      >
        <SkillsTable skills={data?.data} meta={data?.meta} />
      </Suspense>

      <Paginations meta={data?.meta} />
    </div>
  );
};

export default SkillLists;

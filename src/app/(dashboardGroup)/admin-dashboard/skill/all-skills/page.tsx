"use client";

import SkillLists from "@/components/module/skill/skill-lists";
import { SkillModal } from "@/components/module/skill/skill-modal";
import { useGetCategories } from "@/hooks";
import GenericTableSkeleton from "@/loading/table-loading";
import DataNotFoundCard from "@/shared/data-not-found";
import Header from "@/shared/header";
import { ItemShow } from "@/shared/items-show";
import { SortShow } from "@/shared/sort.show";



const sort = [
  { label: "Newest", value: "newest" },
  { label: "Alphabatic Order", value: "asc" },
  { label: "Alphabatic Reverse", value: "desc" },
];


const AllSkillPage = () => {
  const { data, isPending } = useGetCategories();

  if (isPending) {
    return <GenericTableSkeleton columnCount={6} rowCount={8} />;
  }

  if (!data?.success) {
    return (
      <DataNotFoundCard
        message="Category not found"
        description="There was no category created yet"
      />
    );
  }

  return (
    <div className="max-w-11/12 px-4 py-4">
      <div className="flxe flex-col space-y-6">

        <Header
          label="Skill Manage"
          controls={
            <>
              <SortShow
                obj={sort}
                sortKey="name"
              />
              <ItemShow />
              <SkillModal
                mode="create"
                categories={data?.data}
              />
            </>
          }
        />
        <SkillLists />
      </div>
    </div>
  );
};

export default AllSkillPage;

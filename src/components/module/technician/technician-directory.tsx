"use client";

import { cn } from "cn";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useGetAllTech } from "@/hooks";
import DataNotFoundCard from "@/shared/data-not-found";
import Paginations from "@/shared/pagination";
import type { QueryParams } from "@/types";
import TechnicianFilters from "./technician-filters";
import TechnicianLists from "./technician-lists";
import { TechnicianGridSkeleton } from "./technician-skeleton";
import ShowCount from "@/shared/show.count";
import Header from "@/shared/header";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { SortTech } from "./sort";
import { ItemShow } from "@/shared/items-show";
import FilterBtn from "@/utils/filter.btn";

const TechnicianDirectory = () => {
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const raw = Object.fromEntries(searchParams.entries());
    delete raw.sort;

    const query: QueryParams = {
      ...raw,
      limit: raw.limit ?? "9",
    };

    for (const key of [
      "search",
      "region",
      "skill",
      "dayOfWeek",
      "status",
      "minRating",
      "minJobsCompleted",
      "maxJobsCompleted",
    ]) {
      if (!query[key] || query[key] === "all") delete query[key];
    }

    return query;

  }, [searchParams]);

  const { data, isPending, isError, isFetching } = useGetAllTech(params);

  const technicians = data?.data ?? [];
  const meta = data?.meta;


  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="hidden lg:block lg:w-72 lg:shrink-0">
        <div className="sticky top-24">
          <TechnicianFilters />
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-5">
        <Header
          label="Technicians"
          controls={
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 lg:hidden"
                  >
                    <SlidersHorizontal className="size-4" />
                    Filters
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="w-[320px] overflow-y-auto p-0 sm:max-w-sm"
                >
                  <SheetHeader className="border-b border-border p-4">
                    <SheetTitle>Filter technicians</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <TechnicianFilters />
                  </div>
                </SheetContent>
              </Sheet>
              <SortTech />
              <ItemShow />
            </>
          }
        />

        {isPending ? (
          <TechnicianGridSkeleton />
        ) : isError || !data?.success ? (
          <DataNotFoundCard
            message="Could not load technicians"
            description="Please refresh the page or try again in a moment."
          />
        ) : technicians.length === 0 ? (
          <DataNotFoundCard
            message="No technicians found"
            description="Try a different city, skill, availability day, status, or search term."
          />
        ) : (
          <div
            className={cn(
              "space-y-5 transition-opacity",
              isFetching && "opacity-60",
            )}
          >
            <ShowCount length={technicians?.length} meta={meta} title="technicians" />

            <TechnicianLists technicians={technicians} />

            {meta && (
              <div className="pt-2">
                <Paginations meta={meta} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianDirectory;

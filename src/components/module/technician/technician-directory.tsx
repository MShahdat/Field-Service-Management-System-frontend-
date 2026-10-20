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
import TechnicianToolbar from "./technician-toolbar";

const TechnicianDirectory = () => {
  const searchParams = useSearchParams();

  const params = useMemo(() => {
    const raw = Object.fromEntries(searchParams.entries());
    const sort = raw.sort;

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

    if (sort === "rating") {
      query.sortBy = "rating";
      query.sortOrder = "desc";
    } else if (sort === "jobs") {
      query.sortBy = "jobsCompleted";
      query.sortOrder = "desc";
    } else {
      query.sortBy = "createdAt";
      query.sortOrder = "desc";
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
        <TechnicianToolbar total={meta?.total} />

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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {technicians.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {meta?.total ?? technicians.length}
                </span>{" "}
                technicians
              </p>

              {meta && (
                <p className="text-xs text-muted-foreground">
                  Page {meta.page} of {meta.totalPages}
                </p>
              )}
            </div>

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

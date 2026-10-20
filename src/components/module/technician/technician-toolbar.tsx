"use client";

import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SearchBar from "@/shared/search-bar";
import TechnicianFilters from "./technician-filters";
import { ItemShow } from "@/shared/items-show";

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Top rated", value: "rating" },
  { label: "Most jobs completed", value: "jobs" },
];


type Props = {
  total?: number;
};

const TechnicianToolbar = ({ total }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "newest";
  const currentLimit = searchParams.get("limit") ?? "9";

  const setParam = (key: string, value: string, fallback: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === fallback) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <p className="shrink-0 text-lg font-semibold sm:text-xl">
            All technicians{" "}
            {typeof total === "number" && (
              <span className="font-normal text-muted-foreground">
                ({total})
              </span>
            )}
          </p>

          <SearchBar
            placeholder="Search by name or email"
            className="max-w-full sm:max-w-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
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

          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              Sort
            </span>
            <Select
              value={currentSort}
              onValueChange={(value) => setParam("sort", value, "newest")}
            >
              <SelectTrigger
                className="w-[160px]"
                aria-label="Sort technicians"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              Show
            </span>
            <ItemShow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianToolbar;

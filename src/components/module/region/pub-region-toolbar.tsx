"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchBar from "@/shared/search-bar";
import { ItemShow } from "@/shared/items-show";

const SORT_OPTIONS = [
  { label: "Area A–Z", value: "area" },
  { label: "Newest first", value: "newest" },
];

type Props = {
  total?: number;
};

const PubRegionToolbar = ({ total }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "area";
  const currentLimit = searchParams.get("limit") ?? "12";

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
            Service regions{" "}
            {typeof total === "number" && (
              <span className="font-normal text-muted-foreground">
                ({total})
              </span>
            )}
          </p>

          <SearchBar
            placeholder="Search service areas"
            className="max-w-full sm:max-w-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-sm text-muted-foreground">
              Sort
            </span>
            <Select
              value={currentSort}
              onValueChange={(value) => setParam("sort", value, "area")}
            >
              <SelectTrigger className="w-[160px]" aria-label="Sort regions">
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

export default PubRegionToolbar;

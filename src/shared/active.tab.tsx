'use client'


import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


const regionFilters = [
  { label: "All", value: undefined },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
] as const;


const ActiveTab = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()

  const handleFilterChange = (value: string | undefined) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value === undefined) {
      nextParams.delete("isActive");
    } else {
      nextParams.set("isActive", value);
    }

    nextParams.delete("page");

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  const selectedFilter = searchParams.get("isActive");

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="inline-flex items-center rounded-lg border p-0">
        {regionFilters.map((filter) => {
          const isSelected =
            filter.value === undefined
              ? !searchParams.has("isActive")
              : selectedFilter === filter.value;

          return (
            <Button
              key={filter.label}
              type="button"
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              className="rounded-md px-3"
              onClick={() => handleFilterChange(filter.value)}
            >
              {filter.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveTab;
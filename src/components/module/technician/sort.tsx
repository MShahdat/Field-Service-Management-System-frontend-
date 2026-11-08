"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Top rated", value: "rating" },
  { label: "Most jobs completed", value: "jobsCompleted" },
];

export function SortTech() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sortOrder = searchParams.get("sortBy") ?? "newest";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "newest") {
      params.delete("sortOrder");
      params.delete("sortBy");
    } else {
      params.set("sortBy", value);
    }
    params.delete("page");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="whitespace-nowrap text-muted-foreground">Sort</span>
      <Select value={sortOrder} onValueChange={handleChange}>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Newest First" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort Order</SelectLabel>
            {SORT_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

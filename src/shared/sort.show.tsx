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


type Obj = {
  label: string;
  value: string
}


type Props = {
  sortKey: string;
  obj: Obj[]
}

export function SortShow({ sortKey, obj }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sortOrder = searchParams.get("sortOrder") ?? "newest";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "newest") {
      params.delete("sortOrder");
      params.delete("sortBy");
    } else {
      params.set("sortBy", sortKey)
      params.set("sortOrder", value);
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
          <SelectValue placeholder="Newest" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort Order</SelectLabel>
            {obj.map((item: Obj) => (
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

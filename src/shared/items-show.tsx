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

const items = [
  { label: "Default", value: "default" },
  { label: "3", value: "3" },
  { label: "6", value: "6" },
  { label: "12", value: "12" },
];

export function ItemShow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const limit = searchParams.get("limit") ?? "default";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "default") {
      params.delete("limit");
    } else {
      params.set("limit", value);
    }
    params.delete("page");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground whitespace-nowrap">Show</span>
      <Select value={limit} onValueChange={handleChange}>
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Item Show</SelectLabel>
            {items.map((item) => (
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

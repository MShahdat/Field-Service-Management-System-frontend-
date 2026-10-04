"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SearchBar = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [value, setValue] = useState(search);

  useEffect(() => {
    setValue(search);
  }, [search]);

  const handleChange = (val: string) => {
    setValue(val);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set("search", val);
      } else {
        params.delete("search");
        params.delete("page");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }, 500);
  };

  return (
    <div className="relative max-w-sm">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        className="pl-8"
        onChange={(e) => handleChange(e.target.value)}
        type="text"
        placeholder="Searching..."
      />
    </div>
  );
};
export default SearchBar;

"use client";

import { cn } from "cn";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  placeholder?: string;
  className?: string;
};

const SearchBar = ({ placeholder = "Searching...", className }: Props) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const router = useRouter();
  const pathname = usePathname();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [value, setValue] = useState(search);

  useEffect(() => {
    setValue(search);
  }, [search]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleChange = (val: string) => {
    setValue(val);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("page");

      if (val.trim()) {
        params.set("search", val);
      } else {
        params.delete("search");
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    }, 400);
  };

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        value={value}
        className="pl-8"
        onChange={(event) => handleChange(event.target.value)}
        type="text"
        placeholder={placeholder}
        aria-label="Search"
      />
    </div>
  );
};

export default SearchBar;

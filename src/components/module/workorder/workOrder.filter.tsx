"use client";

import { cn } from "cn";
import {
  BookA,
  ChevronDownIcon,
  MapPin,
  SlidersHorizontal,
  Star,
  UserCog2,
  Wrench,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ElementType, ReactNode } from "react";
import { useCallback, useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { useGetCategories, useGetRegions } from "@/hooks";
import type { ICategory, IRegion } from "@/types";

type Obj = {
  label: string;
  value: string
}

type Props = {
  STATUS_OPTIONS?: Obj[]
}


const PRIORITY_OPTIONS = [
  { label: "Low", value: "LOW" },
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Urgent", value: "URGENT" },
] as const;


const FILTER_KEYS = [
  "status",
  "priority",
] as const;

const toList = (value: string | null) =>
  value ? value.split(",").filter(Boolean) : [];

function FilterSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ElementType;
  children: ReactNode;
}) {
  return (
    <Collapsible defaultOpen className="border-b border-border last:border-b-0">
      <CollapsibleTrigger className="group flex w-full items-center justify-between px-4 py-3.5">
        <span className="flex items-center gap-2.5 text-sm font-medium">
          <Icon className="size-4 text-primary" />
          {title}
        </span>
        <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 px-4 pt-1 pb-5">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function CheckboxRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 cursor-pointer rounded border border-input accent-primary"
      />
      <Label
        htmlFor={id}
        className="cursor-pointer truncate text-sm font-normal"
      >
        {label}
      </Label>
    </div>
  );
}

const WorkOrderFilter = ({ STATUS_OPTIONS }: Props) => {
  const uid = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: regionRes, isPending: regionsPending } = useGetRegions({
    limit: "100",
    sortBy: "area",
    sortOrder: "asc",
  });
  const { data: categoryRes, isPending: categoryPending } = useGetCategories({
    limit: "100",
    sortBy: "name",
    sortOrder: "asc",
  });

  const regions: IRegion[] = regionRes?.data ?? [];
  const categories: ICategory[] = categoryRes?.data ?? [];

  const activeStatus = toList(searchParams.get("status"))
  const activePriority = toList(searchParams.get("priority"))
  const activeRegions = toList(searchParams.get("region"));
  const activeCategories = toList(searchParams.get("category"));

  const commit = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      params.delete("page");

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const toggleCsv = useCallback(
    (key: string, value: string) => {
      commit((params) => {
        const current = toList(params.get(key));
        const next = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];

        if (next.length > 0) {
          params.set(key, next.join(","));
        } else {
          params.delete(key);
        }
      });
    },
    [commit],
  );

  const setSingle = useCallback(
    (key: string, value: string) => {
      commit((params) => {
        if (params.get(key) === value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
    },
    [commit],
  );


  const clearFilters = () => {
    commit((params) => {
      for (const key of FILTER_KEYS) params.delete(key);
    });
  };

  const activeCount = FILTER_KEYS.reduce(
    (count, key) => count + (searchParams.get(key) ? 1 : 0),
    0,
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="size-4 text-primary" />
          Filters
          {activeCount > 0 && (
            <Badge variant="secondary" className="rounded-full">
              {activeCount}
            </Badge>
          )}
        </span>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      {
        STATUS_OPTIONS &&
        <FilterSection title="Status" icon={UserCog2}>
          <div className="space-y-2.5">
            {STATUS_OPTIONS.map((status) => (
              <CheckboxRow
                key={status.value}
                id={`${uid}-status-${status.value}`}
                label={status.label}
                checked={activeStatus.includes(status.value)}
                onChange={() => toggleCsv("status", status.value)}
              />
            ))}
          </div>
        </FilterSection>
      }
      <FilterSection title="Priority" icon={BookA}>
        <div className="space-y-2.5">
          {PRIORITY_OPTIONS.map((priority) => (
            <CheckboxRow
              key={priority.value}
              id={`${uid}-priority-${priority.value}`}
              label={priority.label}
              checked={activePriority.includes(priority.value)}
              onChange={() => toggleCsv("priority", priority.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Region" icon={MapPin}>
        <div className="max-h-44 space-y-2.5 overflow-y-auto pr-1">
          {regionsPending ? (
            <p className="text-xs text-muted-foreground">Loading regions...</p>
          ) : regions.length > 0 ? (
            regions.map((region) => (
              <CheckboxRow
                key={region.id}
                id={`${uid}-region-${region.id}`}
                label={region.area}
                checked={activeRegions.includes(region.area)}
                onChange={() => toggleCsv("region", region.area)}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              No regions available.
            </p>
          )}
        </div>
      </FilterSection>

      <FilterSection title="Categories" icon={Wrench}>
        <div className="max-h-48 space-y-2.5 overflow-y-auto pr-1">
          {categoryPending ? (
            <p className="text-xs text-muted-foreground">Loading skills...</p>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <CheckboxRow
                key={category.id}
                id={`${uid}-category-${category.id}`}
                label={category.name}
                checked={activeCategories.includes(category.name)}
                onChange={() => toggleCsv("category", category.name)}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              No category available.
            </p>
          )}
        </div>
      </FilterSection>

    </div>
  );
};

export default WorkOrderFilter;

"use client";


import {
  BriefcaseBusiness,
  ChevronDownIcon,
  MapPin,
  SlidersHorizontal,
  UserCog2,
  Wrench,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ElementType, KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetCategories, useGetMe, useGetRegions } from "@/hooks";
import type { ICategory, ILoggedUser, IRegion } from "@/types";


const STATUS_OPTIONS = [
  { label: "Unpaid", value: "UNPAID" },
  { label: "Paid", value: "PAID" },
  { label: "Failed", value: "FAILED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Refund", value: "REFUNDED" },
] as const;



const FILTER_KEYS = [
  "status",
  "minAmount",
  "maxAmount"
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

const PaymentFilter = () => {
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
  const { data } = useGetMe()

  const regions: IRegion[] = regionRes?.data ?? [];
  const categories: ICategory[] = categoryRes?.data ?? [];
  const user: ILoggedUser = data?.data ?? undefined
  const role = user.role

  const activeStatus = toList(searchParams.get("status"));
  const activeRegions = toList(searchParams.get("region"));
  const activeCategories = toList(searchParams.get("category"));
  const minAmountUrl = searchParams.get("minAmount") ?? "";
  const maxAmountUrl = searchParams.get("maxAmount") ?? "";
  const [minAmount, setMinAmount] = useState(minAmountUrl);
  const [maxAmount, setMaxAmount] = useState(maxAmountUrl);

  useEffect(() => {
    setMinAmount(minAmountUrl);
    setMaxAmount(maxAmountUrl);
  }, [minAmountUrl, maxAmountUrl]);


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

  const commitAmount = useCallback(() => {
    const parsedMin = minAmount.trim() ? Number(minAmount) : null;
    const parsedMax = maxAmount.trim() ? Number(maxAmount) : null;

    let nextMin =
      parsedMin !== null && Number.isFinite(parsedMin)
        ? Math.max(0, parsedMin)
        : null;
    let nextMax =
      parsedMax !== null && Number.isFinite(parsedMax)
        ? Math.max(0, parsedMax)
        : null;

    if (nextMin !== null && nextMax !== null && nextMin > nextMax) {
      [nextMin, nextMax] = [nextMax, nextMin];
    }

    setMinAmount(nextMin === null ? "" : String(nextMin));
    setMaxAmount(nextMax === null ? "" : String(nextMax));

    commit((params) => {
      if (nextMin === null) {
        params.delete("minAmount");
      } else {
        params.set("minAmount", String(nextMin));
      }

      if (nextMax === null) {
        params.delete("maxAmount");
      } else {
        params.set("maxAmount", String(nextMax));
      }
    });
  }, [commit, maxAmount, minAmount]);

  const clearFilters = () => {
    commit((params) => {
      for (const key of FILTER_KEYS) params.delete(key);
    });
  };

  const activeCount = FILTER_KEYS.reduce(
    (count, key) => count + (searchParams.get(key) ? 1 : 0),
    0,
  );

  const handleAmountKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitAmount();
    }
  };

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


      <FilterSection title="Amount" icon={BriefcaseBusiness}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label
              htmlFor={`${uid}-min-amount`}
              className="mb-1.5 text-xs font-normal text-muted-foreground"
            >
              Minimum
            </Label>
            <Input
              id={`${uid}-min-amount`}
              inputMode="numeric"
              value={minAmount}
              onChange={(event) =>
                setMinAmount(event.target.value.replace(/\D/g, ""))
              }
              onKeyDown={handleAmountKeyDown}
              placeholder="0"
            />
          </div>

          <div>
            <Label
              htmlFor={`${uid}-max-amount`}
              className="mb-1.5 text-xs font-normal text-muted-foreground"
            >
              Maximum
            </Label>
            <Input
              id={`${uid}-max-amount`}
              inputMode="numeric"
              value={maxAmount}
              onChange={(event) =>
                setMaxAmount(event.target.value.replace(/\D/g, ""))
              }
              onKeyDown={handleAmountKeyDown}
              placeholder="Any"
            />
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={commitAmount}
          className="w-full"
        >
          Apply amount range
        </Button>
      </FilterSection>

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

      {
        (role === "ADMIN" || role === "SUPER_ADMIN") &&
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
      }

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

export default PaymentFilter;

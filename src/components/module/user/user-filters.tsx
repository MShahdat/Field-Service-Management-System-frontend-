"use client";

import {
  ChevronDownIcon,
  CircleDot,
  SlidersHorizontal,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ElementType, ReactNode } from "react";
import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";



const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Deleted", value: "DELETED" },
] as const;


const ROLE_OPTIONS = [
  { label: "Customer", value: "CUSTOMER" },
  { label: "Technician", value: "TECHNICIAN" },
  { label: "Manager", value: "MANAGER" },
] as const;


const AUTH_OPTIONS = [
  { label: "Credentials", value: "CREDENTIAL" },
  { label: "Google", value: "GOOGLE" },
  { label: "Facebook", value: "FACEBOOK" },
] as const;


const FILTER_KEYS = [
  "status",
  "role",
  "authProvider"
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

const UserFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

      <FilterSection title="Status" icon={CircleDot}>
        <div className="space-y-2.5">
          {STATUS_OPTIONS.map((option) => (
            <CheckboxRow
              key={option.value}
              id={`status-${option.value}`}
              label={option.label}
              checked={toList(searchParams.get("status")).includes(option.value)}
              onChange={() => toggleCsv("status", option.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Role" icon={CircleDot}>
        <div className="space-y-2.5">
          {ROLE_OPTIONS.map((option) => (
            <CheckboxRow
              key={option.value}
              id={`role-${option.value}`}
              label={option.label}
              checked={toList(searchParams.get("role")).includes(option.value)}
              onChange={() => toggleCsv("role", option.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Auth Provider" icon={CircleDot}>
        <div className="space-y-2.5">
          {AUTH_OPTIONS.map((option) => (
            <CheckboxRow
              key={option.value}
              id={`authProvider-${option.value}`}
              label={option.label}
              checked={toList(searchParams.get("authProvider")).includes(option.value)}
              onChange={() => toggleCsv("authProvider", option.value)}
            />
          ))}
        </div>
      </FilterSection>

    </div>
  );
};

export default UserFilters;

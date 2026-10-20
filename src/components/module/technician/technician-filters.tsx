"use client";

import { cn } from "cn";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDownIcon,
  CircleDot,
  MapPin,
  SlidersHorizontal,
  Star,
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
import { useGetRegions, useGetSkills } from "@/hooks";
import type { IRegion, ISkills } from "@/types";

const AVAILABLE_DAYS = [
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
  { label: "Sunday", value: "0" },
] as const;

const STATUS_OPTIONS = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Busy", value: "BUSY" },
  { label: "Off duty", value: "OFF_DUTY" },
] as const;

const RATING_OPTIONS = [
  { label: "4.5+", value: "4.5" },
  { label: "4.0+", value: "4" },
  { label: "3.0+", value: "3" },
] as const;

const FILTER_KEYS = [
  "dayOfWeek",
  "region",
  "skill",
  "status",
  "minRating",
  "minJobsCompleted",
  "maxJobsCompleted",
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
          <Icon className="size-4 text-muted-foreground" />
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

const TechnicianFilters = () => {
  const uid = useId();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: regionRes, isPending: regionsPending } = useGetRegions({
    limit: "100",
    sortBy: "area",
    sortOrder: "asc",
  });
  const { data: skillRes, isPending: skillsPending } = useGetSkills({
    limit: "100",
    sortBy: "name",
    sortOrder: "asc",
  });

  const regions: IRegion[] = regionRes?.data ?? [];
  const skills: ISkills[] = skillRes?.data ?? [];

  const activeDays = toList(searchParams.get("dayOfWeek"));
  const activeRegions = toList(searchParams.get("region"));
  const activeSkills = toList(searchParams.get("skill"));
  const activeStatus = searchParams.get("status");
  const activeRating = searchParams.get("minRating");

  const minJobsUrl = searchParams.get("minJobsCompleted") ?? "";
  const maxJobsUrl = searchParams.get("maxJobsCompleted") ?? "";
  const [minJobs, setMinJobs] = useState(minJobsUrl);
  const [maxJobs, setMaxJobs] = useState(maxJobsUrl);

  useEffect(() => {
    setMinJobs(minJobsUrl);
    setMaxJobs(maxJobsUrl);
  }, [minJobsUrl, maxJobsUrl]);

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

  const commitJobs = useCallback(() => {
    const parsedMin = minJobs.trim() ? Number(minJobs) : null;
    const parsedMax = maxJobs.trim() ? Number(maxJobs) : null;

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

    setMinJobs(nextMin === null ? "" : String(nextMin));
    setMaxJobs(nextMax === null ? "" : String(nextMax));

    commit((params) => {
      if (nextMin === null) {
        params.delete("minJobsCompleted");
      } else {
        params.set("minJobsCompleted", String(nextMin));
      }

      if (nextMax === null) {
        params.delete("maxJobsCompleted");
      } else {
        params.set("maxJobsCompleted", String(nextMax));
      }
    });
  }, [commit, maxJobs, minJobs]);

  const clearFilters = () => {
    commit((params) => {
      for (const key of FILTER_KEYS) params.delete(key);
    });
  };

  const activeCount = FILTER_KEYS.reduce(
    (count, key) => count + (searchParams.get(key) ? 1 : 0),
    0,
  );

  const handleJobsKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitJobs();
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

      <FilterSection title="Availability" icon={CalendarDays}>
        <div className="space-y-2.5">
          {AVAILABLE_DAYS.map((day) => (
            <CheckboxRow
              key={day.value}
              id={`${uid}-day-${day.value}`}
              label={day.label}
              checked={activeDays.includes(day.value)}
              onChange={() => toggleCsv("dayOfWeek", day.value)}
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

      <FilterSection title="Skill" icon={Wrench}>
        <div className="max-h-48 space-y-2.5 overflow-y-auto pr-1">
          {skillsPending ? (
            <p className="text-xs text-muted-foreground">Loading skills...</p>
          ) : skills.length > 0 ? (
            skills.map((skill) => (
              <CheckboxRow
                key={skill.id}
                id={`${uid}-skill-${skill.id}`}
                label={skill.name}
                checked={activeSkills.includes(skill.name)}
                onChange={() => toggleCsv("skill", skill.name)}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              No skills available.
            </p>
          )}
        </div>
      </FilterSection>

      <FilterSection title="Status" icon={CircleDot}>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={activeStatus === option.value ? "default" : "outline"}
              aria-pressed={activeStatus === option.value}
              onClick={() => setSingle("status", option.value)}
              className="rounded-full"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Minimum rating" icon={Star}>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={activeRating === option.value ? "default" : "outline"}
              aria-pressed={activeRating === option.value}
              onClick={() => setSingle("minRating", option.value)}
              className={cn(
                "rounded-full",
                activeRating === option.value && "font-semibold",
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Completed jobs" icon={BriefcaseBusiness}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label
              htmlFor={`${uid}-min-jobs`}
              className="mb-1.5 text-xs font-normal text-muted-foreground"
            >
              Minimum
            </Label>
            <Input
              id={`${uid}-min-jobs`}
              inputMode="numeric"
              value={minJobs}
              onChange={(event) =>
                setMinJobs(event.target.value.replace(/\D/g, ""))
              }
              onKeyDown={handleJobsKeyDown}
              placeholder="0"
            />
          </div>

          <div>
            <Label
              htmlFor={`${uid}-max-jobs`}
              className="mb-1.5 text-xs font-normal text-muted-foreground"
            >
              Maximum
            </Label>
            <Input
              id={`${uid}-max-jobs`}
              inputMode="numeric"
              value={maxJobs}
              onChange={(event) =>
                setMaxJobs(event.target.value.replace(/\D/g, ""))
              }
              onKeyDown={handleJobsKeyDown}
              placeholder="Any"
            />
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={commitJobs}
          className="w-full"
        >
          Apply job range
        </Button>
      </FilterSection>
    </div>
  );
};

export default TechnicianFilters;

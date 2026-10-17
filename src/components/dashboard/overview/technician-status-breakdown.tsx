"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TechnicianAnalytics } from "@/types";

interface StatusRow {
  label: string;
  display: string;
  percent: number;
  barClass: string;
  dotClass: string;
}

interface StatusGroup {
  title: string;
  total?: number;
  rows: StatusRow[];
}

const pct = (value: number, total: number) =>
  total > 0 ? Math.round((value / total) * 100) : 0;

const buildGroups = (s: TechnicianAnalytics): StatusGroup[] => {
  const orderTotal =
    s.completedWorkOrders + s.startedWorkOrders + s.enrouteWorkOrders;
  const completionRate = pct(s.completedWorkOrders, orderTotal);
  const ratingPercent = Math.min(
    100,
    Math.max(0, Math.round((s.avgRating / 5) * 100)),
  );

  return [
    {
      title: "Work Orders",
      total: orderTotal,
      rows: [
        {
          label: "Completed",
          display: `${s.completedWorkOrders}`,
          percent: pct(s.completedWorkOrders, orderTotal),
          barClass: "bg-emerald-500",
          dotClass: "bg-emerald-500",
        },
        {
          label: "Started",
          display: `${s.startedWorkOrders}`,
          percent: pct(s.startedWorkOrders, orderTotal),
          barClass: "bg-amber-500",
          dotClass: "bg-amber-500",
        },
        {
          label: "En route",
          display: `${s.enrouteWorkOrders}`,
          percent: pct(s.enrouteWorkOrders, orderTotal),
          barClass: "bg-violet-500",
          dotClass: "bg-violet-500",
        },
      ],
    },
    {
      title: "Performance",
      rows: [
        {
          label: "Completion rate",
          display: `${completionRate}%`,
          percent: completionRate,
          barClass: "bg-emerald-500",
          dotClass: "bg-emerald-500",
        },
        {
          label: "Avg rating",
          display: `${s.avgRating}/5`,
          percent: ratingPercent,
          barClass: "bg-amber-500",
          dotClass: "bg-amber-500",
        },
      ],
    },
  ];
};

export function TechnicianStatusBreakdown({
  stats,
}: {
  stats: TechnicianAnalytics;
}) {
  const groups = buildGroups(stats);

  return (
    <Card className="rounded-2xl shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center text-[15px] font-bold tracking-tight text-foreground">
          <span className="mr-2 inline-block h-4 w-1 shrink-0 rounded-full bg-primary" />
          <span className="truncate">Status Breakdown</span>
        </CardTitle>
        <CardDescription className="pl-3 text-[13px]">
          Share of totals by group
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-6 pt-3 pb-5 sm:px-8">
        {groups.map((group) => (
          <section key={group.title} aria-label={group.title}>
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-[14px] font-semibold uppercase tracking-[0.14em] text-primary">
                {group.title}
              </h3>
              {group.total !== undefined && (
                <span className="text-xs font-semibold tabular-nums text-foreground">
                  {group.total} total
                </span>
              )}
            </div>
            <div className="space-y-2.5">
              {group.rows.map((row) => (
                <div key={row.label}>
                  <div className="mb-1 flex items-center justify-between text-[13px]">
                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      {row.label}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {row.display}
                      </span>{" "}
                      · {row.percent}%
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={row.percent}
                    aria-label={`${group.title} ${row.label}`}
                    className="h-2 overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ${row.barClass}`}
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </CardContent>
    </Card>
  );
}

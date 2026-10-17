"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useGetPaymentInfo } from "@/hooks";
import type { IPayment } from "@/types";
import { fmtMoney } from "./stat-card";

type EarningsRange = "week" | "month" | "3months";

const RANGE_OPTIONS: { value: EarningsRange; label: string }[] = [
  { value: "week", label: "Last week" },
  { value: "month", label: "Last 1 month" },
  { value: "3months", label: "Last 3 months" },
];

interface EarningsPoint {
  label: string;
  fullLabel: string;
  earnings: number;
}

const startOfDay = (d: Date) => {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
};

const addDays = (d: Date, n: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

const buildBuckets = (range: EarningsRange, now: Date) => {
  const today = startOfDay(now);
  if (range === "3months") {
    return Array.from({ length: 3 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() - (2 - i), 1);
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      return {
        start: d,
        end: next,
        label: d.toLocaleDateString("en-US", { month: "short" }),
        fullLabel: d.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      };
    });
  }
  const days = range === "week" ? 7 : 30;
  return Array.from({ length: days }, (_, i) => {
    const d = addDays(today, i - (days - 1));
    return {
      start: d,
      end: addDays(d, 1),
      label:
        days <= 7
          ? d.toLocaleDateString("en-US", { weekday: "short" })
          : d.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      fullLabel: d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  });
};

const toEarningsPoints = (
  payments: IPayment[],
  range: EarningsRange,
  now: Date,
): EarningsPoint[] => {
  const buckets = buildBuckets(range, now);
  const totals = new Array(buckets.length).fill(0) as number[];
  for (const p of payments) {
    if (p.status !== "PAID") continue;
    const t = new Date(p.paidAt ?? p.createdAt).getTime();
    if (Number.isNaN(t)) continue;
    const idx = buckets.findIndex(
      (b) => t >= b.start.getTime() && t < b.end.getTime(),
    );
    if (idx >= 0) totals[idx] += Number(p.amount) || 0;
  }
  return buckets.map((b, i) => ({
    label: b.label,
    fullLabel: b.fullLabel,
    earnings: totals[i],
  }));
};

export function TechnicianEarningsChart() {
  // Backend analytics exposes totals only, so the trend is aggregated
  // client-side from the technician's most recent payments (PAID by paid date).
  const [range, setRange] = useState<EarningsRange>("week");
  const paymentsQuery = useGetPaymentInfo({ limit: "500", page: "1" });

  const payments = useMemo(
    () =>
      ((paymentsQuery.data as unknown as { data?: IPayment[] })?.data ??
        []) as IPayment[],
    [paymentsQuery.data],
  );

  const points = useMemo(
    () => toEarningsPoints(payments, range, new Date()),
    [payments, range],
  );
  const rangeTotal = useMemo(
    () => points.reduce((sum, p) => sum + p.earnings, 0),
    [points],
  );
  const activeLabel =
    RANGE_OPTIONS.find((o) => o.value === range)?.label ?? "Last week";

  return (
    <Card className="rounded-2xl shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
      <CardHeader className="pb-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center text-[15px] font-bold tracking-tight text-foreground">
            <span className="mr-2 inline-block h-4 w-1 shrink-0 rounded-full bg-primary" />
            <span className="truncate">Earnings Trend</span>
          </CardTitle>
          <Select
            value={range}
            onValueChange={(v) => setRange(v as EarningsRange)}
          >
            <SelectTrigger
              aria-label="Earnings range"
              className="h-8 w-[140px] rounded-xl bg-background text-xs shadow-sm"
            >
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {RANGE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CardDescription className="pl-3 text-[13px]">
          {activeLabel} · {fmtMoney(rangeTotal)} earned
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] pt-2">
        {paymentsQuery.isPending ? (
          <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
            <Spinner /> Loading earnings…
          </div>
        ) : points.every((p) => p.earnings === 0) ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
            No paid earnings recorded in this range yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={points}
              margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient
                  id="technicianEarningsFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--color-border)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={16}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-border)",
                  fontSize: 12,
                }}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullLabel ?? ""
                }
                formatter={(v) => [
                  fmtMoney(typeof v === "number" ? v : 0),
                  "Earnings",
                ]}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                name="Earnings"
                stroke="var(--chart-2)"
                strokeWidth={2.5}
                fill="url(#technicianEarningsFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

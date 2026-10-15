"use client";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  DollarSign,
  MapPin,
  Play,
  Star,
  TrendingUp,
  Undo2,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTechnicianStats, useMyOrder } from "@/hooks";
import type { ApiResponse, TechnicianAnalytics } from "@/types";
import { ChartCard } from "./chart-card";
import { OverviewHeader } from "./overview-header";
import { OverviewSkeleton } from "./overview-skeleton";
import { fmtMoney, StatCard } from "./stat-card";

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  fontSize: 12,
};

export function TechnicianOverview() {
  const stats = useGetTechnicianStats();
  const orders = useMyOrder({ limit: "5", page: "1" });

  if (stats.isPending) return <OverviewSkeleton />;
  if (stats.isError)
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center">
          <p className="text-sm font-medium">
            Failed to load technician stats.
          </p>
        </div>
      </div>
    );

  const s = (stats.data as unknown as ApiResponse<TechnicianAnalytics>)?.data;
  if (!s)
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">No stats.</p>
        </div>
      </div>
    );

  const total = s.completedWorkOrders + s.startedWorkOrders;
  const rate = total ? Math.round((s.completedWorkOrders / total) * 100) : 0;
  const bar = [
    {
      name: "Orders",
      completed: s.completedWorkOrders,
      started: s.startedWorkOrders,
    },
  ];
  const radial = [{ name: "Done", value: rate, fill: "#BE123C" }];
  const list: any[] =
    (orders.data as any)?.data?.data ?? (orders.data as any)?.data ?? [];

  return (
    <div className="space-y-4 p-4 sm:space-y-5 md:p-6">
      <OverviewHeader
        title="Technician Overview"
        subtitle="Your jobs, regions, rating & earnings."
      />

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        <StatCard
          title="Completed Orders"
          value={s.completedWorkOrders}
          icon={CheckCircle2}
          accent="bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
          href="/technician-dashboard/workorder/my-order"
        />
        <StatCard
          title="Started Orders"
          value={s.startedWorkOrders}
          icon={Play}
          href="/technician-dashboard/workorder/todays-order"
        />
        <StatCard
          title="Complete Jobs"
          value={s.completeJobs}
          icon={Briefcase}
        />
        <StatCard title="Cover Regions" value={s.coverRegions} icon={MapPin} />
        <StatCard
          title="Avg Rating"
          value={`${s.avgRating}/5`}
          icon={Star}
          description={`${rate}% completion`}
          accent="bg-amber-500/10 text-amber-600 ring-amber-500/20"
        />
        <StatCard
          title="Total Earnings"
          value={fmtMoney(s.totalEarnings)}
          icon={DollarSign}
          accent="bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
        />
        <StatCard
          title="This Month"
          value={fmtMoney(s.currentMonthRevenue)}
          icon={TrendingUp}
        />
        <StatCard
          title="Refunded"
          value={fmtMoney(s.totalRefunded)}
          icon={Undo2}
          accent="bg-red-500/10 text-red-600 ring-red-500/20"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Completion Rate"
          description={`${rate}% of ${total} orders`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="60%"
              outerRadius="100%"
              data={radial}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar dataKey="value" cornerRadius={10} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Completed vs Started" description="Workload snapshot">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bar}>
              <CartesianGrid
                stroke="var(--color-border)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="completed" fill="#059669" radius={[8, 8, 0, 0]} />
              <Bar dataKey="started" fill="#BE123C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card className="rounded-2xl shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex min-w-0 items-center text-[15px] font-bold tracking-tight">
              <span className="mr-2 inline-block h-4 w-1 shrink-0 rounded-full bg-primary" />
              <span className="truncate">Recent Work Orders</span>
            </CardTitle>
            <Link href="/technician-dashboard/workorder/my-order">
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5 rounded-xl font-semibold"
              >
                View all <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-2 text-sm">
          {list.slice(0, 5).map((o: any, i: number) => (
            <div
              key={o._id ?? o.id ?? i}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/[0.04]"
            >
              <span className="min-w-0 truncate font-semibold text-foreground">
                {o.title ?? o.orderId ?? "Order"}
              </span>
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary ring-1 ring-primary/20">
                {o.status ?? ""}
              </span>
            </div>
          ))}
          {!list.length && (
            <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center">
              <p className="text-muted-foreground">No recent orders.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

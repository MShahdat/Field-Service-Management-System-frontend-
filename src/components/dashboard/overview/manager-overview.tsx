"use client";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetManagerStats, useGetMyRegionService } from "@/hooks";
import type { ApiResponse, IService, ManagerAnalytics } from "@/types";
import { ChartCard } from "./chart-card";
import { ManagerStatusBreakdown } from "./manager-status-breakdown";
import { OverviewHeader } from "./overview-header";
import { OverviewSkeleton } from "./overview-skeleton";
import { StatCard } from "./stat-card";

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  fontSize: 12,
};

export function ManagerOverview() {
  const { data: statsData, isPending } = useGetManagerStats();
  const { data: serviceData } = useGetMyRegionService({ limit: "5", page: "1" });

  if (isPending) return <OverviewSkeleton />;

  if (!statsData?.success)
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">No stats.</p>
        </div>
      </div>
    );

  const stats: ManagerAnalytics = statsData?.data ?? undefined;
  const services = serviceData?.data ?? []


  const pie = [
    { name: "Assigned", value: stats?.assignedServices },
    { name: "Rejected", value: stats?.rejectedServices },
  ];

  const workOrderPie = [
    {
      name: "Started",
      value: stats.totalStartedWorkOrders,
      fill: "var(--chart-2)",
    },
    {
      name: "En Route",
      value: stats.totalEnrouteWorkOrders,
      fill: "var(--chart-1)",
    },
    {
      name: "Completed",
      value: stats.completedWorkByTechnicians,
      fill: "var(--chart-5)",
    },
  ];
  const workOrderTotal = stats?.totalWorkOrders

  return (
    <div className="space-y-4 p-4 sm:space-y-5 md:p-6">
      <OverviewHeader
        title="Manager Overview"
        subtitle="Your regions, assigned services & earnings."
      />

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        <StatCard
          title="Total Earnings"
          value={`৳ ${stats.totalEarnings}`}
          icon={DollarSign}
          description="Lifetime earnings"
          accent="bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
          href="/manager-dashboard/payment?status=PAID"
        />
        <StatCard
          title="This Month Earnings"
          value={`৳ ${stats.currentMonthRevenue}`}
          icon={TrendingUp}
          description="Current month earnings"
        // href="/manager-dashboard/payment?status=PAID"
        />
        <StatCard
          title="Assigned Services"
          value={stats.assignedServices}
          icon={Briefcase}
          description="Assigned to your region"
          href="/manager-dashboard/service/my-region-services"
        />
        <StatCard
          title="Completed by Technicians"
          value={stats.completedWorkByTechnicians}
          icon={CheckCircle2}
          accent="bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
          href="/manager-dashboard/service/my-region-services?status=COMPLETED"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ManagerStatusBreakdown stats={stats} />

        <ChartCard
          title="Work Order Status"
          description="Started vs en route vs completed"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={workOrderPie}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={60}
                strokeWidth={5}
              >
                {workOrderPie.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {workOrderTotal.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Work orders
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Assigned vs Rejected"
          description="Service intake health"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pie}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                <Cell fill="#BE123C" />
                <Cell fill="#DC2626" />
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <Card className="rounded-2xl shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex min-w-0 items-center text-[15px] font-bold tracking-tight">
                <span className="mr-2 inline-block h-4 w-1 shrink-0 rounded-full bg-primary" />
                <span className="truncate">Recent Region Services</span>
              </CardTitle>
              <Link href="/manager-dashboard/service/my-region-services">
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
            {services.slice(0, 5).map((service: IService, i: number) => (
              <Link
                href={`/manager-dashboard/service/details?id=${service.id}`}
                key={service.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <span className="min-w-0 truncate font-semibold text-foreground">
                  {service.title ?? "Service"}
                </span>
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary ring-1 ring-primary/20">
                  {service.status ?? ""}
                </span>
              </Link>
            ))}
            {!services.length && (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center">
                <p className="text-muted-foreground">No recent services.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

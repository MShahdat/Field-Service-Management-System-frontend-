"use client";
import { useGetManagerStats, useGetMyRegionService } from "@/hooks";
import type { ApiResponse, ManagerAnalytics } from "@/types";
import {
  Ban,
  Briefcase,
  CheckCircle2,
  DollarSign,
  MapPin,
  TrendingUp,
  Undo2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "./chart-card";
import { OverviewHeader } from "./overview-header";
import { OverviewSkeleton } from "./overview-skeleton";
import { StatCard, fmtMoney } from "./stat-card";

export function ManagerOverview() {
  const stats = useGetManagerStats();
  const recents = useGetMyRegionService({ limit: "5", page: "1" });

  if (stats.isPending) return <OverviewSkeleton />;
  if (stats.isError)
    return <p className="p-6 text-sm">Failed to load manager stats.</p>;

  const s = (stats.data as unknown as ApiResponse<ManagerAnalytics>)?.data;
  if (!s) return <p className="p-6 text-sm text-muted-foreground">No stats.</p>;

  const pie = [
    { name: "Assigned", value: s.assignedServices },
    { name: "Rejected", value: s.rejectedServices },
  ];
  const bar = [
    {
      name: "Work",
      assigned: s.assignedServices,
      completed: s.completedWorkByTechnicians,
    },
  ];
  const list: any[] =
    (recents.data as any)?.data?.data ?? (recents.data as any)?.data ?? [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <OverviewHeader
        title="Manager Overview"
        subtitle="Your regions, assigned services & earnings."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Assigned Services"
          value={s.assignedServices}
          icon={Briefcase}
          href="/manager-dashboard/service/my-region-services"
        />
        <StatCard
          title="Rejected"
          value={s.rejectedServices}
          icon={Ban}
          accent="bg-red-500/10 text-red-600"
        />
        <StatCard
          title="Completed by Techs"
          value={s.completedWorkByTechnicians}
          icon={CheckCircle2}
          accent="bg-green-500/10 text-green-600"
        />
        <StatCard title="Cover Regions" value={s.coverRegions} icon={MapPin} />
        <StatCard
          title="Total Earnings"
          value={fmtMoney(s.totalEarnings)}
          icon={DollarSign}
          accent="bg-green-500/10 text-green-600"
        />
        <StatCard
          title="This Month"
          value={fmtMoney(s.currentMonthRevenue)}
          icon={TrendingUp}
          accent="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          title="Refunded"
          value={fmtMoney(s.totalRefunded)}
          icon={Undo2}
          accent="bg-red-500/10 text-red-600"
        />
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
                <Cell fill="#6366f1" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Completion"
          description="Assigned vs completed by technicians"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="assigned" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Region Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {list.slice(0, 5).map((it: any, i: number) => (
            <div
              key={it._id ?? it.id ?? i}
              className="flex justify-between gap-3 border-b pb-2"
            >
              <span className="truncate font-medium">
                {it.title ?? it.serviceName ?? "Service"}
              </span>
              <span className="shrink-0 text-muted-foreground">
                {it.status ?? ""}
              </span>
            </div>
          ))}
          {!list.length && (
            <p className="text-muted-foreground">No recent services.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

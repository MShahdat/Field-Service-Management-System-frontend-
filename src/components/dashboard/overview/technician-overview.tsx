"use client";
import { useGetTechnicianStats, useMyOrder } from "@/hooks";
import type { ApiResponse, TechnicianAnalytics } from "@/types";
import {
  Briefcase,
  CheckCircle2,
  DollarSign,
  MapPin,
  Play,
  Star,
  TrendingUp,
  Undo2,
} from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "./chart-card";
import { OverviewHeader } from "./overview-header";
import { OverviewSkeleton } from "./overview-skeleton";
import { StatCard, fmtMoney } from "./stat-card";

export function TechnicianOverview() {
  const stats = useGetTechnicianStats();
  const orders = useMyOrder({ limit: "5", page: "1" });

  if (stats.isPending) return <OverviewSkeleton />;
  if (stats.isError) return <p className="p-6 text-sm">Failed to load technician stats.</p>;

  const s = (stats.data as unknown as ApiResponse<TechnicianAnalytics>)?.data;
  if (!s) return <p className="p-6 text-sm text-muted-foreground">No stats.</p>;

  const total = s.completedWorkOrders + s.startedWorkOrders;
  const rate = total ? Math.round((s.completedWorkOrders / total) * 100) : 0;
  const bar = [{ name: "Orders", completed: s.completedWorkOrders, started: s.startedWorkOrders }];
  const radial = [{ name: "Done", value: rate, fill: "#10b981" }];
  const list: any[] =
    (orders.data as any)?.data?.data ?? (orders.data as any)?.data ?? [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <OverviewHeader title="Technician Overview" subtitle="Your jobs, regions, rating & earnings." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Completed Orders" value={s.completedWorkOrders} icon={CheckCircle2} accent="bg-green-500/10 text-green-600" href="/technician-dashboard/workorder/my-order" />
        <StatCard title="Started Orders" value={s.startedWorkOrders} icon={Play} accent="bg-blue-500/10 text-blue-600" href="/technician-dashboard/workorder/todays-order" />
        <StatCard title="Complete Jobs" value={s.completeJobs} icon={Briefcase} />
        <StatCard title="Cover Regions" value={s.coverRegions} icon={MapPin} />
        <StatCard title="Avg Rating" value={`${s.avgRating}/5`} icon={Star} description={`${rate}% completion`} accent="bg-amber-500/10 text-amber-600" />
        <StatCard title="Total Earnings" value={fmtMoney(s.totalEarnings)} icon={DollarSign} accent="bg-green-500/10 text-green-600" />
        <StatCard title="This Month" value={fmtMoney(s.currentMonthRevenue)} icon={TrendingUp} />
        <StatCard title="Refunded" value={fmtMoney(s.totalRefunded)} icon={Undo2} accent="bg-red-500/10 text-red-600" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Completion Rate" description={`${rate}% of ${total} orders`}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="60%" outerRadius="100%" data={radial} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={10} />
              <Tooltip />
              <Legend />
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Completed vs Started" description="Workload snapshot">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="started" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Work Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {list.slice(0, 5).map((o: any, i: number) => (
            <div key={o._id ?? o.id ?? i} className="flex justify-between gap-3 border-b pb-2">
              <span className="truncate font-medium">{o.title ?? o.orderId ?? "Order"}</span>
              <span className="shrink-0 text-muted-foreground">{o.status ?? ""}</span>
            </div>
          ))}
          {!list.length && <p className="text-muted-foreground">No recent orders.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

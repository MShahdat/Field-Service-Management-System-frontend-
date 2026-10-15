"use client";
import {
  Ban,
  Briefcase,
  ClipboardList,
  Clock,
  DollarSign,
  TrendingUp,
  Undo2,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAdminStats } from "@/hooks";
import type { AdminAnalytics, ApiResponse } from "@/types";
import { ChartCard } from "./chart-card";
import { OverviewHeader } from "./overview-header";
import { OverviewSkeleton } from "./overview-skeleton";
import { fmtMoney, StatCard } from "./stat-card";

const PIE_COLORS = ["#D97706", "#DC2626", "#E11D48", "#BE123C"];
const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  fontSize: 12,
};

export function AdminOverview() {
  const { data, isPending, isError, refetch } = useGetAdminStats();

  if (isPending) return <OverviewSkeleton />;
  if (isError)
    return (
      <div className="p-4 md:p-6">
        <Card className="rounded-2xl border-dashed">
          <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center">
            <span className="text-sm font-medium">
              Failed to load admin stats.
            </span>
            <Button
              size="sm"
              className="w-fit rounded-xl font-semibold"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  const s = (data as unknown as ApiResponse<AdminAnalytics>)?.data;
  if (!s)
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">No stats available.</p>
        </div>
      </div>
    );

  const servicePie = [
    { name: "Pending", value: s.pendingServices },
    { name: "Cancelled", value: s.cancelledServices },
    { name: "Rejected", value: s.rejectedServices },
    {
      name: "Others/Active",
      value: Math.max(
        s.totalServices -
          s.pendingServices -
          s.cancelledServices -
          s.rejectedServices,
        0,
      ),
    },
  ];
  const userBar = [
    { name: "Customers", total: s.totalCustomers },
    { name: "Managers", total: s.totalManagers },
    { name: "Technicians", total: s.totalTechnicians },
  ];
  const completion = s.totalWorkOrders
    ? Math.round((s.totalStartedWorkOrders / s.totalWorkOrders) * 100)
    : 0;

  return (
    <div className="space-y-4 p-4 sm:space-y-5 md:p-6">
      <OverviewHeader
        title="Admin Overview"
        subtitle="Platform-wide users, services, work orders & revenue."
      />

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={fmtMoney(s.totalRevenue)}
          icon={DollarSign}
          description="Lifetime collected"
          accent="bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
        />
        <StatCard
          title="This Month"
          value={fmtMoney(s.currentMonthRevenue)}
          icon={TrendingUp}
          description="Current month revenue"
        />
        <StatCard
          title="Refunded"
          value={fmtMoney(s.totalRefunded)}
          icon={Undo2}
          description="Total refunded"
          accent="bg-red-500/10 text-red-600 ring-red-500/20"
        />
        <StatCard
          title="Work Orders"
          value={`${s.totalStartedWorkOrders}/${s.totalWorkOrders}`}
          icon={ClipboardList}
          description={`${completion}% started`}
        />
        <StatCard
          title="Customers"
          value={s.totalCustomers}
          icon={Users}
          href="/admin-dashboard/user"
        />
        <StatCard
          title="Managers"
          value={s.totalManagers}
          icon={UserCog}
          href="/admin-dashboard/user"
        />
        <StatCard
          title="Technicians"
          value={s.totalTechnicians}
          icon={Wrench}
          href="/admin-dashboard/user"
        />
        <StatCard
          title="Pending Managers"
          value={s.pendingManagers}
          icon={Clock}
          description={`${s.rejectedManagers} rejected`}
          href="/admin-dashboard/approve-manager"
          accent="bg-amber-500/10 text-amber-600 ring-amber-500/20"
        />
        <StatCard
          title="Total Services"
          value={s.totalServices}
          icon={Briefcase}
        />
        <StatCard
          title="Pending Services"
          value={s.pendingServices}
          icon={Clock}
          accent="bg-amber-500/10 text-amber-600 ring-amber-500/20"
        />
        <StatCard
          title="Cancelled"
          value={s.cancelledServices}
          icon={Ban}
          accent="bg-red-500/10 text-red-600 ring-red-500/20"
        />
        <StatCard
          title="Rejected"
          value={s.rejectedServices}
          icon={Ban}
          accent="bg-rose-500/10 text-rose-600 ring-rose-500/20"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Service Status Distribution"
          description="Where all services stand"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={servicePie}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {servicePie.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Users by Role"
          description="Customer vs manager vs technician"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userBar}>
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
              <Bar dataKey="total" fill="#BE123C" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card className="rounded-2xl shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center text-[15px] font-bold tracking-tight">
            <span className="mr-2 inline-block h-4 w-1 shrink-0 rounded-full bg-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2 pt-2">
          <Link href="/admin-dashboard/approve-manager">
            <Button className="rounded-xl font-semibold">
              Approve Managers ({s.pendingManagers})
            </Button>
          </Link>
          <Link href="/admin-dashboard/user">
            <Button variant="outline" className="rounded-xl font-semibold">
              All Users
            </Button>
          </Link>
          <Link href="/admin-dashboard/payment">
            <Button variant="outline" className="rounded-xl font-semibold">
              Payments
            </Button>
          </Link>
          <Link href="/admin-dashboard/feedback">
            <Button variant="outline" className="rounded-xl font-semibold">
              Feedback
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import { useGetAdminStats } from "@/hooks";
import type { AdminAnalytics, ApiResponse } from "@/types";
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
import { ChartCard } from "./chart-card";
import { OverviewHeader } from "./overview-header";
import { OverviewSkeleton } from "./overview-skeleton";
import { StatCard, fmtMoney } from "./stat-card";

const PIE_COLORS = ["#6366f1", "#f59e0b", "#ef4444", "#10b981"];

export function AdminOverview() {
  const { data, isPending, isError, refetch } = useGetAdminStats();

  if (isPending) return <OverviewSkeleton />;
  if (isError)
    return (
      <Card className="m-4 md:m-6">
        <CardContent className="flex items-center gap-3 p-6">
          <span className="text-sm">Failed to load admin stats.</span>
          <Button size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );

  const s = (data as unknown as ApiResponse<AdminAnalytics>)?.data;
  if (!s)
    return (
      <p className="p-6 text-sm text-muted-foreground">No stats available.</p>
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
    <div className="space-y-6 p-4 md:p-6">
      <OverviewHeader
        title="Admin Overview"
        subtitle="Platform-wide users, services, work orders & revenue."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={fmtMoney(s.totalRevenue)}
          icon={DollarSign}
          description="Lifetime collected"
          accent="bg-green-500/10 text-green-600"
        />
        <StatCard
          title="This Month"
          value={fmtMoney(s.currentMonthRevenue)}
          icon={TrendingUp}
          description="Current month revenue"
          accent="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          title="Refunded"
          value={fmtMoney(s.totalRefunded)}
          icon={Undo2}
          description="Total refunded"
          accent="bg-red-500/10 text-red-600"
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
          accent="bg-amber-500/10 text-amber-600"
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
          accent="bg-amber-500/10 text-amber-600"
        />
        <StatCard
          title="Cancelled"
          value={s.cancelledServices}
          icon={Ban}
          accent="bg-red-500/10 text-red-600"
        />
        <StatCard
          title="Rejected"
          value={s.rejectedServices}
          icon={Ban}
          accent="bg-rose-500/10 text-rose-600"
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
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard
          title="Users by Role"
          description="Customer vs manager vs technician"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userBar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href="/admin-dashboard/approve-manager">
            <Button>Approve Managers ({s.pendingManagers})</Button>
          </Link>
          <Link href="/admin-dashboard/user">
            <Button variant="outline">All Users</Button>
          </Link>
          <Link href="/admin-dashboard/payment">
            <Button variant="outline">Payments</Button>
          </Link>
          <Link href="/admin-dashboard/feedback">
            <Button variant="outline">Feedback</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

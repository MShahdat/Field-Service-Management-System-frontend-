"use client";
import {
  useCustomerMyService,
  useGetCustomerStats,
  useGetPaymentInfo,
} from "@/hooks";
import type { ApiResponse, CustomerAnalytics } from "@/types";
import {
  Ban,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Clock,
  DollarSign,
  Undo2,
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

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#f43f5e"];

export function CustomerOverview() {
  const stats = useGetCustomerStats();
  const services = useCustomerMyService({ limit: "5", page: "1" });
  const payments = useGetPaymentInfo({ limit: "5", page: "1" });

  if (stats.isPending) return <OverviewSkeleton />;
  if (stats.isError)
    return <p className="p-6 text-sm">Failed to load customer stats.</p>;

  const s = (stats.data as unknown as ApiResponse<CustomerAnalytics>)?.data;
  if (!s) return <p className="p-6 text-sm text-muted-foreground">No stats.</p>;

  const pie = [
    { name: "Completed", value: s.completedServices },
    { name: "Pending", value: s.pendingServices },
    { name: "Cancelled", value: s.cancelledServices },
    { name: "Rejected", value: s.rejectedServices },
  ];
  const spend = [
    {
      name: "Money",
      spend: parseFloat(s.totalSpend) || 0,
      refund: parseFloat(s.totalRefund) || 0,
    },
  ];
  const svcList: any[] =
    (services.data as any)?.data?.data ?? (services.data as any)?.data ?? [];
  const payList: any[] =
    (payments.data as any)?.data?.data ?? (payments.data as any)?.data ?? [];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <OverviewHeader
        title="Customer Overview"
        subtitle="Your services, work progress & spending."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Services"
          value={s.totalServices}
          icon={Briefcase}
          href="/customer-dashboard/service/my-services"
        />
        <StatCard
          title="Completed"
          value={s.completedServices}
          icon={CheckCircle2}
          accent="bg-green-500/10 text-green-600"
        />
        <StatCard
          title="Pending"
          value={s.pendingServices}
          icon={Clock}
          accent="bg-amber-500/10 text-amber-600"
          href="/customer-dashboard/service/todays-service"
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
        <StatCard
          title="Work Done/Active"
          value={`${s.completedWorkOrders}/${s.totalStartedWorkOrders}`}
          icon={ClipboardList}
          href="/customer-dashboard/order"
        />
        <StatCard
          title="Total Spend"
          value={fmtMoney(s.totalSpend)}
          icon={DollarSign}
          accent="bg-green-500/10 text-green-600"
          href="/customer-dashboard/payment/my-payment"
        />
        <StatCard
          title="Refunded"
          value={fmtMoney(s.totalRefund)}
          icon={Undo2}
          accent="bg-red-500/10 text-red-600"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard
          title="Service Status"
          description="Completed vs pending vs cancelled vs rejected"
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
                {pie.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Spend vs Refund" description="Money overview">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="spend" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="refund" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {svcList.slice(0, 5).map((x: any, i: number) => (
              <div
                key={x._id ?? x.id ?? i}
                className="flex justify-between gap-3 border-b pb-2"
              >
                <span className="truncate font-medium">
                  {x.title ?? "Service"}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {x.status ?? ""}
                </span>
              </div>
            ))}
            {!svcList.length && (
              <p className="text-muted-foreground">No services yet.</p>
            )}
            <Link href="/customer-dashboard/service/my-services">
              <Button variant="outline" size="sm" className="mt-2">
                View all + Book new
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {payList.slice(0, 5).map((p: any, i: number) => (
              <div
                key={p._id ?? p.id ?? i}
                className="flex justify-between gap-3 border-b pb-2"
              >
                <span>{p.amount ?? p.total ?? "—"}</span>
                <span className="text-muted-foreground">{p.status ?? ""}</span>
              </div>
            ))}
            {!payList.length && (
              <p className="text-muted-foreground">No payments yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

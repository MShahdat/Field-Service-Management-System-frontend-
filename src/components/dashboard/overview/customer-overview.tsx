"use client";
import {
  ArrowRight,
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
import {
  useCustomerMyService,
  useGetCustomerStats,
  useGetPaymentInfo,
} from "@/hooks";
import type { ApiResponse, CustomerAnalytics } from "@/types";
import { ChartCard } from "./chart-card";
import { OverviewHeader } from "./overview-header";
import { OverviewSkeleton } from "./overview-skeleton";
import { fmtMoney, StatCard } from "./stat-card";

const COLORS = ["#059669", "#D97706", "#DC2626", "#BE123C"];
const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  fontSize: 12,
};

export function CustomerOverview() {
  const stats = useGetCustomerStats();
  const services = useCustomerMyService({ limit: "5", page: "1" });
  const payments = useGetPaymentInfo({ limit: "5", page: "1" });

  if (stats.isPending) return <OverviewSkeleton />;
  if (stats.isError)
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center">
          <p className="text-sm font-medium">Failed to load customer stats.</p>
        </div>
      </div>
    );

  const s = (stats.data as unknown as ApiResponse<CustomerAnalytics>)?.data;
  if (!s)
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-2xl border border-dashed border-border bg-card px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">No stats.</p>
        </div>
      </div>
    );

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
    <div className="space-y-4 p-4 sm:space-y-5 md:p-6">
      <OverviewHeader
        title="Customer Overview"
        subtitle="Your services, work progress & spending."
      />

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
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
          accent="bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
        />
        <StatCard
          title="Pending"
          value={s.pendingServices}
          icon={Clock}
          accent="bg-amber-500/10 text-amber-600 ring-amber-500/20"
          href="/customer-dashboard/service/todays-service"
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
          accent="bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
          href="/customer-dashboard/payment/my-payment"
        />
        <StatCard
          title="Refunded"
          value={fmtMoney(s.totalRefund)}
          icon={Undo2}
          accent="bg-red-500/10 text-red-600 ring-red-500/20"
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
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Spend vs Refund" description="Money overview">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spend}>
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
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="spend" fill="#059669" radius={[8, 8, 0, 0]} />
              <Bar dataKey="refund" fill="#DC2626" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center text-[15px] font-bold tracking-tight">
              <span className="mr-2 inline-block h-4 w-1 shrink-0 rounded-full bg-primary" />
              Recent Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-sm">
            {svcList.slice(0, 5).map((x: any, i: number) => (
              <div
                key={x._id ?? x.id ?? i}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/[0.04]"
              >
                <span className="min-w-0 truncate font-semibold text-foreground">
                  {x.title ?? "Service"}
                </span>
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-primary ring-1 ring-primary/20">
                  {x.status ?? ""}
                </span>
              </div>
            ))}
            {!svcList.length && (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center">
                <p className="text-muted-foreground">No services yet.</p>
              </div>
            )}
            <Link href="/customer-dashboard/service/my-services">
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full gap-1.5 rounded-xl font-semibold sm:w-auto"
              >
                View all + Book new <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center text-[15px] font-bold tracking-tight">
              <span className="mr-2 inline-block h-4 w-1 shrink-0 rounded-full bg-primary" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-sm">
            {payList.slice(0, 5).map((p: any, i: number) => (
              <div
                key={p._id ?? p.id ?? i}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5 transition-colors hover:border-primary/30 hover:bg-primary/[0.04]"
              >
                <span className="font-semibold text-foreground tabular-nums">
                  {p.amount ?? p.total ?? "—"}
                </span>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium whitespace-nowrap text-muted-foreground ring-1 ring-border">
                  {p.status ?? ""}
                </span>
              </div>
            ))}
            {!payList.length && (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center">
                <p className="text-muted-foreground">No payments yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

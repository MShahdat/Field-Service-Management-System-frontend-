"use client";
import { cn } from "cn";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  href?: string;
  accent?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  href,
  accent = "bg-primary/10 text-primary ring-primary/15",
}: StatCardProps) {
  const inner = (
    <Card className="relative gap-2 overflow-hidden rounded-2xl shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-colors hover:border-primary/30 hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary/30" />
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="truncate text-[13px] font-semibold text-muted-foreground">
          {title}
        </CardTitle>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1",
            accent,
          )}
        >
          <Icon />
        </span>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="truncate text-xl font-extrabold tracking-tight text-foreground tabular-nums">
          {value}
        </div>
        {description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
  if (href)
    return (
      <Link href={href} className="block min-w-0">
        {inner}
      </Link>
    );
  return inner;
}

export const fmtMoney = (v?: string | number) => {
  const n = typeof v === "string" ? parseFloat(v) : (v ?? 0);
  if (isNaN(n)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
};

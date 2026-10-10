"use client";
import { useGetMe } from "@/hooks";
import { format } from "date-fns";

export function OverviewHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { data } = useGetMe();
  const user = (data as any)?.data;
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {firstName ? `Welcome back, ${firstName}` : title}
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <p className="text-xs text-muted-foreground">
        {format(new Date(), "EEEE, MMM d yyyy")}
      </p>
    </div>
  );
}

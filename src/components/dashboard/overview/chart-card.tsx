"use client";
import { cn } from "cn";
import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl shadow-[0_1px_2px_rgb(0_0_0/0.04)]",
        className,
      )}
    >
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center text-[15px] font-bold tracking-tight text-foreground">
          <span className="mr-2 inline-block h-4 w-1 shrink-0 rounded-full bg-primary" />
          <span className="truncate">{title}</span>
        </CardTitle>
        {description && (
          <CardDescription className="pl-3 text-[13px]">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="h-[300px] pt-2">{children}</CardContent>
    </Card>
  );
}

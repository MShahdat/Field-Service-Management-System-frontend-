"use client";

import { use } from "react";
import { useEligibleTechnician, useSingleOrder } from "@/hooks";
import DataNotFoundCard from "@/shared/data-not-found";
import TechnicianAssignPage from "@/components/module/services/technician-assign";
import type { ITechnician } from "@/types/technician.types";
import DetailsSkeleton from "@/loading/details-loading";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/shared/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { badgeText, formatDate, formatDuration, statusVarient } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { formatClock } from "@/components/module/services/details-util";

const AssignPage = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get("id") as string
  const backHref = '/manager-dashboard/service/incoming-services'

  const { data, isPending, isError } = useSingleOrder(id);

  if (isPending) {
    return <DetailsSkeleton />;
  }

  if (isError || !data?.data || !data?.success) {
    return <DataNotFoundCard
      message="Order not found"
      description="This order may have been deleted or you don't have access."
    />
  }



  const service = data?.data.service
  const shortId = service.id.slice(0, 8).toUpperCase();

  console.log('service', service)


  return (
    <div className="w-11/12 mx-auto py-6">
      <Breadcrumb
        backHref={backHref}
        back="Incoming Service"
        current="Tech Assign"
      />

      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-bold sm:text-2xl">
              Service request #{shortId}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Created {formatDate(service.createdAt)}</span>
              <Badge variant={statusVarient(service.status)}>
                <span className="size-1 rounded-full bg-current" />
                {badgeText(service.status)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Service request
            </p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-muted">
                  <Zap className="size-4 text-primary" />
                </span>
                <h2 className="text-lg font-semibold">
                  {service.category?.name ?? service.title}
                </h2>
              </div>
              <Badge variant={statusVarient(service.priority)}>
                {badgeText(service.priority)} priority
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{service.description}</p>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["Date", formatDate(service.servicingDate)],
                ["Duration", formatDuration(service.duration)],
                [
                  "Time",
                  `${formatClock(service.preferredStartTime)} - ${formatClock(service.preferredEndTime)}`,
                ],
                [
                  "Location",
                  `${service.address?.street ?? "-"}, ${service.address?.city ?? ""} ${service.address?.postalCode ?? ""}`,
                ],
              ].map(([l, v]) => (
                <div key={l} className="rounded-lg bg-muted p-3">
                  <p className="text-xs uppercase text-muted-foreground">{l}</p>
                  <p className="truncate text-sm font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <TechnicianAssignPage
        workOrderId={id}
      />
    </div>
  );
};

export default AssignPage;

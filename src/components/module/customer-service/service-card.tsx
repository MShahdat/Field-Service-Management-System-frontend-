"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileAvater from "@/shared/avater";
import { ServiceRequest } from "@/types";
import { Clock, Hourglass, Pencil, Trash2, XCircle } from "lucide-react";
import { MyServiceModal } from "./service-modal";
import DeleteModal from "./delete-modal";
import { redirect, usePathname, useRouter } from "next/navigation";

type Props = {
  service: ServiceRequest;
};

const MyServiceCard = ({ service }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Card className="">
      <CardContent className="flex h-full flex-col gap-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-card-foreground">
            {service?.category.name}
          </h3>
          <Badge variant="secondary">
            {service?.status.toLocaleLowerCase()}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="requested">{service?.servicingDate}</Badge>
          <Badge variant="inProgress">
            <Clock className="size-3.5" aria-hidden />
            {service?.preferredStartTime} – {service?.preferredEndTime}
          </Badge>
          <Badge variant={"accepted"}>
            {service.priority.toLocaleLowerCase()}
          </Badge>
        </div>

        {service?.status === "REJECTED" ? (
          <div className="flex items-start gap-2.5 rounded-xl bg-destructive/10 px-3 py-2.5 text-destructive">
            <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div>
              <p className="text-sm font-bold">Why it was rejected</p>
              <p className="text-xs leading-snug">
                {service.rejectionReason ?? "No reason was provided."}
              </p>
            </div>
          </div>
        ) : service?.workOrders?.technician ? (
          <div className="flex items-center gap-2.5 rounded-xl bg-muted px-3 py-2.5">
            <ProfileAvater
              name={service.workOrders.technician.user.name}
              imageUrl={service.workOrders.technician.user.profileImg}
            />
            <div>
              <p className="text-sm font-bold text-foreground">
                {service.workOrders.technician.user.name}
              </p>
              <p className="text-xs text-muted-foreground">Your technician</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 rounded-xl border-[1.5px] border-dashed border-border px-3 py-2.5">
            <Hourglass
              className="size-5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden
            />
            <div>
              <p className="text-sm font-bold text-foreground">
                Technician not assigned yet
              </p>
              <p className="text-xs leading-snug text-muted-foreground">
                A manager will assign one after reviewing your request.
              </p>
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          <Button
            onClick={() => {
              router.push(`${pathname}/${service.id}`);
            }}
            type="button"
            variant="secondary"
          >
            View details
          </Button>

          <div className="flex gap-1.5">
            <MyServiceModal service={service} mode="edit" />
            <DeleteModal service={service} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyServiceCard;

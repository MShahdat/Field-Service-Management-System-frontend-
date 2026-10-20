"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { badgeText } from "@/utils/badge.style";
import { useRouter } from "next/navigation";
import { useAssignTechnician, useEligibleTechnician } from "@/hooks";
import { ITechnician } from "@/types";
import DataNotFoundCard from "@/shared/data-not-found";
import { useState } from "react";
import { toast } from "sonner";
import DetailsSkeleton from "@/loading/details-loading";
import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFallbackText } from "@/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  workOrderId: string;
};

export default function TechnicianAssignPage({ workOrderId }: Props) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");


  const { data, isPending: eligiblePending } = useEligibleTechnician(workOrderId);
  console.log('assign data', data)
  const { mutateAsync, isPending } = useAssignTechnician();

  if (eligiblePending) {
    return <DetailsSkeleton />
  }

  const techs: ITechnician[] = data?.data?.eligibleTech ?? []

  const selected = techs.find((t) => t.id === selectedId) ?? null;

  async function onAssign() {
    if (!selectedId) {
      toast.error("Select one technician first");
      return;
    }
    const n = Number(amount);
    if (!amount || Number.isNaN(n) || n <= 0) {
      toast.error("Enter valid service amount (BDT)");
      return;
    }
    try {
      const res = await mutateAsync({
        workOrderId,
        technicianId: selectedId,
        amount: n,
        status: "ASSIGNED",
      } as never);
      toast.success(
        (res as { message?: string })?.message ?? "Technician assigned",
      );
      router.push("/manager-dashboard/service/incoming-services");
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message ?? "Assign failed");
    }
  }

  async function onReject() {
    if (!reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    try {
      const res = await mutateAsync({
        workOrderId,
        technicianId: selectedId ?? techs[0]?.id ?? "",
        amount: 0,
        status: "REJECTED",
        rejectionReason: reason.trim(),
      } as never);
      toast.success(
        (res as { message?: string })?.message ?? "Service rejected",
      );
      setRejectOpen(false);
      setReason("");
      router.push("/manager-dashboard/service/incoming-services");
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message ?? "Reject failed");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Eligible technicians
          </p>
          <p className="text-sm text-muted-foreground">
            Select one technician to assign this service
          </p>
        </div>
        <p className="text-sm font-semibold">{techs.length} found</p>
      </div>

      <div className="space-y-3">
        {techs.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-sm text-muted-foreground">
              No eligible technicians found.
            </CardContent>
          </Card>
        )}
        {techs.map((t) => {
          const active = t.id === selectedId;
          return (
            <Card
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={cn(
                "cursor-pointer transition-colors",
                active
                  ? "border-primary ring-1 ring-primary bg-primary/[0.03]"
                  : "hover:border-primary/50",
              )}
            >
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border",
                    active ? "border-primary" : "border-input",
                  )}
                >
                  {active && (
                    <span className="size-2.5 rounded-full bg-primary" />
                  )}
                </span>
                <Avatar className="size-12 bg-primary text-primary-foreground">
                  <AvatarImage
                    src={t.user?.profileImg ?? undefined}
                    alt={t.user?.name}
                  />
                  <AvatarFallback className="bg-primary font-bold text-primary-foreground">
                    {getFallbackText(t.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{t.user?.name}</p>
                  <Badge variant="secondary" className="mb-1">
                    ● {badgeText(String(t.status))}
                  </Badge>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.bio || "Certified technician"}
                  </p>
                </div>
                {[
                  ["Rating", t.rating ? `★ ${t.rating}` : "No ratings yet"],
                  ["Jobs", String(t.jobsCompleted ?? 0)],
                  ["Region", t.regions?.map((r) => r.area).join(", ") || "-"],
                  ["Phone", t.phone || "-"],
                ].map(([l, v]) => (
                  <div key={l} className="min-w-0 sm:w-28">
                    <p className="text-xs uppercase text-muted-foreground">
                      {l}
                    </p>
                    <p className="truncate text-sm font-medium">{v}</p>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant={active ? "default" : "outline"}
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(t.id);
                  }}
                >
                  {active ? (
                    <>
                      Selected <Check className="size-4" />
                    </>
                  ) : (
                    "Select"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm">
            <p className="text-xs uppercase text-muted-foreground">
              Assignment
            </p>
            Selected technician:{" "}
            <span className="font-semibold">
              {selected?.user?.name ?? "None"}
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="amount" className="whitespace-nowrap text-xs">
                Amount (BDT)
              </Label>
              <Input
                id="amount"
                className="w-32"
                placeholder="1500"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setRejectOpen(true)}>
                Reject service
              </Button>
              <Button disabled={!selectedId || isPending} onClick={onAssign}>
                {isPending && <Spinner />}
                Assign technician
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={rejectOpen}
        onOpenChange={(v) => {
          setRejectOpen(v);
          if (!v) setReason("");
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject service</DialogTitle>
            <DialogDescription>
              Provide a reason. It will be saved as rejectionReason.
            </DialogDescription>
          </DialogHeader>
          <Label htmlFor="rejectionReason">
            Reason <span className="text-destructive">— required</span>
          </Label>
          <Textarea
            id="rejectionReason"
            autoFocus
            className="min-h-24"
            placeholder="e.g. Outside service region."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!reason.trim() || isPending}
              onClick={onReject}
            >
              {isPending && <Spinner />}
              Confirm reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

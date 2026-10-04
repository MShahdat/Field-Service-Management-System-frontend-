"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, VerifiedIcon } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { IManager, IReviewManager, ReviewStatus } from "@/types";
import { useManagerReview } from "@/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFallbackText } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function CategoryModal({ manager }: { manager: IManager }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"review" | "reject">("review");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setMode("review");
    setRejectionReason("");
    setSubmitting(false);
  }

  const { mutate, isPending } = useManagerReview();

  const handleAction = (status: ReviewStatus) => {
    const reviewData: IReviewManager = {
      email: manager.user.email,
      verificationStatus: status,
      rejectionReason,
    };
    console.log(reviewData);
    mutate(reviewData, {
      onSuccess: (res) => {
        toast.success(res.message);
        reset();
        setOpen(!open);
      },
      onError: (er) => {
        toast.error(er.message);
        return;
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size={"sm"} variant="outline">
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] min-w-0 overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div>
            <p className="text-lg font-semibold">Manager Review</p>
            <p>Review manager information before making a decisions</p>
          </div>
        </DialogHeader>
        <Separator />
        {mode === "review" && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarImage
                    src={manager.user.profileImg}
                    alt={manager.user.name}
                  />
                  <AvatarFallback className="rounded-full text-black font-bold text-lg">
                    {getFallbackText(manager.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg flex gap-1 items-center">
                    {manager.user.name}
                    <span>
                      {manager.user.emailVerified ? (
                        <>
                          <VerifiedIcon className="fill-green-600 size-4 lg:size-5 text-white" />
                        </>
                      ) : (
                        ""
                      )}
                    </span>
                  </p>
                  <p className="text-xs">{manager.user.role.toLowerCase()}</p>
                </div>
              </div>
              <Badge variant={"outline"}>
                {manager.verificationStatus.toLowerCase()}
              </Badge>
            </div>

            <Card className="gap-0 rounded-xl p-5 shadow-none">
              <p className="mb-4 text-sm font-semibold text-muted-foreground">
                Contact
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="break-all font-semibold">
                    {manager.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold">{manager.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NID</p>
                  <p className="font-semibold">{manager.nid}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{manager.address.street}</p>
                </div>
              </div>
            </Card>

            <Card className="gap-0 rounded-xl p-5 shadow-none">
              <p className="mb-3 text-sm font-semibold text-muted-foreground">
                Assigned region
              </p>
              <div className="space-y-3">
                {manager.region.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 shrink-0 text-blue-400" />
                      <div>
                        <p className="font-semibold">{r.area}</p>
                        <p className="text-sm text-muted-foreground">
                          {r.description}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        r.isActive
                          ? "border-0 bg-green-500/10 text-green-500"
                          : "border-0 bg-muted text-muted-foreground"
                      }
                    >
                      {r.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <p className="text-sm text-muted-foreground">
              Submitted{" "}
              {new Date(manager.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </section>
        )}

        {mode === "reject" && (
          <div className="space-y-2 py-2">
            <Label htmlFor="rejectionReason">
              Reason for rejection{" "}
              <span className="text-destructive">— required</span>
            </Label>
            <Textarea
              id="rejectionReason"
              placeholder="e.g. Licence number could not be verified against the registry."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-25"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Sent to the applicant by email.
            </p>
          </div>
        )}

        <DialogFooter>
          {mode === "review" ? (
            <>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => setMode("reject")}
                disabled={submitting}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleAction("APPROVED")}
                disabled={submitting}
              >
                {submitting && (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                )}
                {isPending ? (
                  <>
                    <Spinner /> Approving
                  </>
                ) : (
                  "Approved"
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setMode("review")}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction("REJECTED")}
                disabled={submitting || !rejectionReason.trim()}
              >
                {submitting && (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                )}
                {isPending ? (
                  <>
                    <Spinner /> Confirming
                  </>
                ) : (
                  "Confirm Rejected"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

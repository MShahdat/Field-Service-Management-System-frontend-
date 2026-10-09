"use client";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetRegions,
  useGetSkills,
  useTechnicianProfileComplete,
} from "@/hooks";
import type { IRegion, ISkills } from "@/types";
import type { IAvailabilityInput, ITechnician } from "@/types/technician.types";
import { completeProfileZodSchema } from "@/validation";
import { formatClock } from "../customer-service/details-util";
import { DAY_NAMES } from "./profile-helpers";

const AVAIL_TYPES = ["RECURRING", "ONE_OFF", "BLOCKED"] as const;
type AvailType = (typeof AVAIL_TYPES)[number];

interface Slot {
  id?: string;
  type: AvailType;
  dayOfWeek?: number;
  date?: string;
  startTime?: string;
  endTime?: string;
}

// Backend schema stays untouched; form layer enforces "completed" requirements.
const formSchema = completeProfileZodSchema.superRefine((v, ctx) => {
  if (!v.phone) {
    ctx.addIssue({
      code: "custom",
      message: "Phone is required",
      path: ["phone"],
    });
  }
  if (!v.nid) {
    ctx.addIssue({ code: "custom", message: "NID is required", path: ["nid"] });
  }
  if (!v.bio) {
    ctx.addIssue({ code: "custom", message: "Bio is required", path: ["bio"] });
  }
  const a = v.address as unknown as
    | { street?: string; city?: string; postalCode?: string }
    | undefined;
  if (!a?.street || !a?.city || !a?.postalCode) {
    ctx.addIssue({
      code: "custom",
      message: "Street, city and postal code are required",
      path: ["address"],
    });
  }
  if (!v.region || v.region.length === 0) {
    ctx.addIssue({
      code: "custom",
      message: "Select at least one region",
      path: ["region"],
    });
  }
  if (!v.skills || v.skills.length === 0) {
    ctx.addIssue({
      code: "custom",
      message: "Select at least one skill",
      path: ["skills"],
    });
  }
  if (!v.availability || v.availability.length === 0) {
    ctx.addIssue({
      code: "custom",
      message: "Add at least one availability slot",
      path: ["availability"],
    });
  }
});

type ProfileFieldName =
  | "phone"
  | "nid"
  | "bio"
  | "address"
  | "region"
  | "skills"
  | "availability";

type ValidatorResult =
  | { fields: Partial<Record<ProfileFieldName, { message: string }>> }
  | undefined;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tech?: ITechnician | null;
};

export function TechnicianProfileModal({ open, onOpenChange, tech }: Props) {
  const { data: regionRes, isPending: regionPending } = useGetRegions();
  const {
    data: skillRes,
    isPending: skillPending,
    isError: skillError,
  } = useGetSkills();
  const { mutate, isPending } = useTechnicianProfileComplete();

  const regions: IRegion[] = regionRes?.data ?? [];
  const skills: ISkills[] = skillRes?.data ?? [];

  const initialSlots: Slot[] = (tech?.availability ?? []).map((a) => ({
    ...(a.id ? { id: a.id } : {}),
    type: a.type,
    ...(a.dayOfWeek != null ? { dayOfWeek: a.dayOfWeek } : {}),
    ...(a.date ? { date: a.date } : {}),
    ...(a.startTime ? { startTime: a.startTime } : {}),
    ...(a.endTime ? { endTime: a.endTime } : {}),
  }));

  const form = useForm({
    defaultValues: {
      phone: tech?.phone ?? "",
      nid: tech?.nid ?? "",
      bio: tech?.bio ?? "",
      address: {
        street: tech?.address?.street ?? "",
        city: tech?.address?.city ?? "",
        postalCode: tech?.address?.postalCode ?? "",
      },
      skills: (tech?.skills ?? []).map((s: ISkills) => s.id),
      region: (tech?.regions ?? []).map((r: IRegion) => r.id),
      availability: initialSlots,
    },
    validators: {
      // Function wrapper (instead of passing the schema directly) because
      // the backend schema's optional input shape differs from form values.
      // Zod issues are mapped to per-field errors via `{ fields: ... }`.
      onSubmit: ({ value }): ValidatorResult => {
        const parsed = formSchema.safeParse(value);
        if (parsed.success) return undefined;
        const fields: Partial<Record<ProfileFieldName, { message: string }>> =
          {};
        const isFieldName = (k: string): k is ProfileFieldName =>
          k === "phone" ||
          k === "nid" ||
          k === "bio" ||
          k === "address" ||
          k === "region" ||
          k === "skills" ||
          k === "availability";
        for (const issue of parsed.error.issues) {
          const raw = String(issue.path[0] ?? "");
          // Numeric paths (e.g. availability overlap at index i) belong to availability.
          const key: ProfileFieldName = isFieldName(raw) ? raw : "availability";
          if (!(key in fields)) fields[key] = { message: issue.message };
        }
        return { fields };
      },
    },
    onSubmit: ({ value }) => {
      const availability: IAvailabilityInput[] = value.availability.map(
        (s: Slot) => ({
          ...(s.id ? { id: s.id } : {}),
          type: s.type,
          ...(s.type === "RECURRING" && s.dayOfWeek != null
            ? { dayOfWeek: s.dayOfWeek }
            : {}),
          ...(s.type !== "RECURRING" && s.date ? { date: s.date } : {}),
          ...(s.type !== "BLOCKED"
            ? { startTime: s.startTime, endTime: s.endTime }
            : {}),
        }),
      );
      mutate(
        {
          phone: value.phone,
          nid: value.nid,
          bio: value.bio,
          address: {
            street: value.address.street,
            city: value.address.city,
            postalCode: value.address.postalCode,
          },
          skills: value.skills,
          region: value.region,
          availability,
        },
        {
          onSuccess: (res) => {
            const message =
              (res as { message?: string } | undefined)?.message ??
              "Profile completed";
            toast.success(message);
            onOpenChange(false);
          },
          onError: (err) => {
            toast.error(err.message ?? "Update failed");
          },
        },
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Complete technician profile</DialogTitle>
          <DialogDescription>
            Required to become eligible for services. Times are Asia/Dhaka
            (HH:mm).
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <form.Field name="phone">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="phone">
                        Phone<span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="01XXXXXXXXX"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="nid">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="nid">
                        NID<span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="NID number"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="bio">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="bio">
                      Bio<span className="text-red-500">*</span>
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      rows={3}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Certified electrician, 8+ years experience…"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="address">
              {(field) => {
                const addr = field.state.value;
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      Address<span className="text-red-500">*</span>
                    </FieldLabel>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <Input
                        value={addr.street}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange({
                            ...addr,
                            street: e.target.value,
                          })
                        }
                        placeholder="Street"
                      />
                      <Input
                        value={addr.city}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange({ ...addr, city: e.target.value })
                        }
                        placeholder="City"
                      />
                      <Input
                        value={addr.postalCode}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange({
                            ...addr,
                            postalCode: e.target.value,
                          })
                        }
                        placeholder="Postal code"
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="region">
              {(field) => {
                const selected = field.state.value;
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      Service regions<span className="text-red-500">*</span>
                      <span className="ml-1 text-muted-foreground">
                        ({selected.length} selected)
                      </span>
                    </FieldLabel>
                    <div className="grid max-h-36 grid-cols-2 gap-1 overflow-y-auto rounded-lg border p-2">
                      {regionPending && (
                        <p className="text-sm text-muted-foreground">
                          Loading regions…
                        </p>
                      )}
                      {regions.map((r: IRegion) => {
                        const on = selected.includes(r.id);
                        return (
                          <label
                            key={r.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() =>
                                field.handleChange(
                                  on
                                    ? selected.filter((x) => x !== r.id)
                                    : [...selected, r.id],
                                )
                              }
                            />
                            {r.area}
                          </label>
                        );
                      })}
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="skills">
              {(field) => {
                const selected = field.state.value;
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>
                      Skills<span className="text-red-500">*</span>
                      <span className="ml-1 text-muted-foreground">
                        ({selected.length} selected)
                      </span>
                    </FieldLabel>
                    <div className="grid max-h-48 grid-cols-2 gap-1 overflow-y-auto rounded-lg border p-2">
                      {skillPending && (
                        <p className="text-sm text-muted-foreground">
                          Loading skills…
                        </p>
                      )}
                      {skillError && (
                        <p className="text-sm text-destructive">
                          Could not load skills. Please try again.
                        </p>
                      )}
                      {skills.map((s: ISkills) => {
                        const on = selected.includes(s.id);
                        return (
                          <label
                            key={s.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() =>
                                field.handleChange(
                                  on
                                    ? selected.filter((x) => x !== s.id)
                                    : [...selected, s.id],
                                )
                              }
                            />
                            {s.name}
                          </label>
                        );
                      })}
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="availability">
              {(field) => {
                const slots = field.state.value;
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                const updateSlot = (i: number, patch: Partial<Slot>) =>
                  field.handleChange(
                    slots.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
                  );
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel>
                        Availability<span className="text-red-500">*</span>
                        <span className="ml-1 text-muted-foreground">
                          (Asia/Dhaka)
                        </span>
                      </FieldLabel>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          field.handleChange([
                            ...slots,
                            {
                              type: "RECURRING",
                              dayOfWeek: 1,
                              startTime: "09:00",
                              endTime: "17:00",
                            },
                          ])
                        }
                      >
                        <Plus className="size-4" /> Add slot
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {slots.map((s, i) => (
                        <div
                          key={`${s.type}-${s.dayOfWeek ?? s.date ?? "slot"}-${s.startTime ?? ""}-${s.endTime ?? ""}-${i}`}
                          className="grid grid-cols-2 gap-2 rounded-lg border p-2 sm:grid-cols-6"
                        >
                          <Select
                            value={s.type}
                            onValueChange={(v) =>
                              updateSlot(i, { type: v as AvailType })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {AVAIL_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {s.type === "RECURRING" ? (
                            <Select
                              value={String(s.dayOfWeek ?? 1)}
                              onValueChange={(v) =>
                                updateSlot(i, { dayOfWeek: Number(v) })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {DAY_NAMES.map((d, di) => (
                                  <SelectItem key={d} value={String(di)}>
                                    {d}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  type="button"
                                  className="justify-start"
                                >
                                  {s.date ? s.date.slice(0, 10) : "Pick date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={
                                    s.date ? new Date(s.date) : undefined
                                  }
                                  disabled={{ before: new Date() }}
                                  onSelect={(d) => {
                                    if (d) {
                                      updateSlot(i, {
                                        date: format(d, "yyyy-MM-dd"),
                                      });
                                    }
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                          {s.type !== "BLOCKED" && (
                            <>
                              <Input
                                type="time"
                                aria-label="Start time"
                                value={s.startTime ?? ""}
                                onChange={(e) =>
                                  updateSlot(i, {
                                    startTime: e.target.value,
                                  })
                                }
                                className="[&::-webkit-calendar-picker-indicator]:hidden"
                              />
                              <Input
                                type="time"
                                aria-label="End time"
                                value={s.endTime ?? ""}
                                onChange={(e) =>
                                  updateSlot(i, { endTime: e.target.value })
                                }
                                className="[&::-webkit-calendar-picker-indicator]:hidden"
                              />
                            </>
                          )}
                          <div className="col-span-2 flex items-center justify-between gap-1 text-xs text-muted-foreground sm:col-span-1">
                            <span>
                              {s.type === "BLOCKED"
                                ? "Blocked"
                                : `${formatClock(s.startTime)} – ${formatClock(s.endTime)}`}
                            </span>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              aria-label="Remove slot"
                              onClick={() =>
                                field.handleChange(
                                  slots.filter((_, j) => j !== i),
                                )
                              }
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {slots.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No slots yet. Add at least one.
                        </p>
                      )}
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <DialogFooter className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> Saving
                </>
              ) : (
                "Save profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

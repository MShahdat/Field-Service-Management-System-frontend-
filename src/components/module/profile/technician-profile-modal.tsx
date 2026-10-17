"use client";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import {
  BriefcaseBusiness,
  CalendarClock,
  Clock,
  MapPin,
  Plus,
  Trash2,
  UserRound,
  Wrench,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { IRegion, ISkills } from "@/types";
import type { IAvailabilityInput, ITechnician } from "@/types/technician.types";
import { completeProfileZodSchema } from "@/validation";
import { formatClock } from "../services/details-util";
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
      <DialogContent className="flex max-h-[calc(100dvh-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border p-0 sm:max-w-2xl lg:max-w-3xl">
        {/* Themed header */}
        <DialogHeader className="relative shrink-0 gap-1 overflow-hidden bg-primary px-5 pt-5 pb-5 sm:px-7 sm:pt-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="absolute -top-12 -right-12 size-44 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 left-24 size-40 rounded-full bg-black/10 blur-2xl" />
          </div>
          <div className="relative flex items-start gap-3 pr-8">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur">
              <BriefcaseBusiness className="size-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-base font-bold tracking-tight text-white sm:text-lg">
                {tech?.isProfileCompleted
                  ? "Update technician profile"
                  : "Complete technician profile"}
              </DialogTitle>
              <DialogDescription className="mt-1 text-[13px] leading-relaxed text-white/80">
                Required to become eligible for services. Times are Asia/Dhaka
                (HH:mm).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">
            <FieldGroup className="gap-5">
              {/* 1 — Contact */}
              <ModalSection
                step="01"
                icon={<UserRound className="size-4" />}
                title="Contact & identity"
                sub="Phone, NID and a short professional bio"
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <form.Field name="phone">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="phone">
                            Phone<span className="text-primary">*</span>
                          </FieldLabel>
                          <Input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="rounded-xl bg-background"
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
                            NID<span className="text-primary">*</span>
                          </FieldLabel>
                          <Input
                            id={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="NID number"
                            className="rounded-xl bg-background"
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
                          Bio<span className="text-primary">*</span>
                        </FieldLabel>
                        <Textarea
                          id={field.name}
                          rows={3}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Certified electrician, 8+ years experience…"
                          className="resize-none rounded-xl bg-background"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </ModalSection>

              {/* 2 — Address */}
              <ModalSection
                step="02"
                icon={<MapPin className="size-4" />}
                title="Address"
                sub="Street, city and postal code are all required"
              >
                <form.Field name="address">
                  {(field) => {
                    const addr = field.state.value;
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>
                          Address<span className="text-primary">*</span>
                        </FieldLabel>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
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
                            className="rounded-xl bg-background"
                          />
                          <Input
                            value={addr.city}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange({
                                ...addr,
                                city: e.target.value,
                              })
                            }
                            placeholder="City"
                            className="rounded-xl bg-background"
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
                            className="rounded-xl bg-background"
                          />
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </ModalSection>

              {/* 3 — Regions */}
              <ModalSection
                step="03"
                icon={<MapPin className="size-4" />}
                title="Service regions"
                sub="Choose every area you can take jobs in"
              >
                <form.Field name="region">
                  {(field) => {
                    const selected = field.state.value;
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>
                          Service regions<span className="text-primary">*</span>
                          <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                            {selected.length} selected
                          </span>
                        </FieldLabel>
                        <div className="max-h-44 overflow-y-auto rounded-xl border border-border bg-muted/30 p-2.5">
                          {regionPending && (
                            <p className="p-2 text-sm text-muted-foreground">
                              Loading regions…
                            </p>
                          )}
                          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                            {regions.map((r: IRegion) => {
                              const on = selected.includes(r.id);
                              return (
                                <label
                                  key={r.id}
                                  className={cn(
                                    "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-all",
                                    on
                                      ? "border-primary/40 bg-primary/[0.07] font-semibold text-foreground shadow-[inset_0_0_0_1px_var(--color-primary)]"
                                      : "border-transparent bg-card text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground",
                                  )}
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
                                    className="size-4 shrink-0 accent-(--color-primary)"
                                  />
                                  <span className="truncate">{r.area}</span>
                                </label>
                              );
                            })}
                          </div>
                          {!regionPending && regions.length === 0 && (
                            <p className="p-2 text-sm text-muted-foreground">
                              No regions available.
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
              </ModalSection>

              {/* 4 — Skills */}
              <ModalSection
                step="04"
                icon={<Wrench className="size-4" />}
                title="Skills"
                sub="Pick what customers can hire you for"
              >
                <form.Field name="skills">
                  {(field) => {
                    const selected = field.state.value;
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>
                          Skills<span className="text-primary">*</span>
                          <span className="ml-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                            {selected.length} selected
                          </span>
                        </FieldLabel>
                        <div className="max-h-52 overflow-y-auto rounded-xl border border-border bg-muted/30 p-2.5">
                          {skillPending && (
                            <p className="p-2 text-sm text-muted-foreground">
                              Loading skills…
                            </p>
                          )}
                          {skillError && (
                            <p className="p-2 text-sm text-destructive">
                              Could not load skills. Please try again.
                            </p>
                          )}
                          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                            {skills.map((s: ISkills) => {
                              const on = selected.includes(s.id);
                              return (
                                <label
                                  key={s.id}
                                  className={cn(
                                    "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-all",
                                    on
                                      ? "border-primary/40 bg-primary/[0.07] font-semibold text-foreground shadow-[inset_0_0_0_1px_var(--color-primary)]"
                                      : "border-transparent bg-card text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground",
                                  )}
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
                                    className="size-4 shrink-0 accent-(--color-primary)"
                                  />
                                  <span className="min-w-0">
                                    <span className="block truncate">
                                      {s.name}
                                    </span>
                                    {s.category?.name && (
                                      <span className="block truncate text-[11px] font-normal text-muted-foreground">
                                        {s.category.name}
                                      </span>
                                    )}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </ModalSection>

              {/* 5 — Availability */}
              <ModalSection
                step="05"
                icon={<CalendarClock className="size-4" />}
                title="Availability"
                sub="Asia/Dhaka · at least one slot is required"
                action={
                  <form.Field name="availability">
                    {(field) => (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() =>
                          field.handleChange([
                            ...field.state.value,
                            {
                              type: "RECURRING",
                              dayOfWeek: 1,
                              startTime: "09:00",
                              endTime: "17:00",
                            },
                          ])
                        }
                        className="gap-1.5 rounded-xl text-xs font-semibold shadow-sm"
                      >
                        <Plus className="size-3.5" /> Add slot
                      </Button>
                    )}
                  </form.Field>
                }
              >
                <form.Field name="availability">
                  {(field) => {
                    const slots = field.state.value;
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    const updateSlot = (i: number, patch: Partial<Slot>) =>
                      field.handleChange(
                        slots.map((s, idx) =>
                          idx === i ? { ...s, ...patch } : s,
                        ),
                      );
                    return (
                      <Field data-invalid={isInvalid}>
                        <div className="space-y-2.5">
                          {slots.map((s, i) => (
                            <div
                              key={`${s.type}-${s.dayOfWeek ?? s.date ?? "slot"}-${s.startTime ?? ""}-${s.endTime ?? ""}-${i}`}
                              className="rounded-xl border border-border bg-card p-3 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-colors focus-within:border-primary/40"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary uppercase">
                                  <Clock className="size-3" />
                                  Slot {i + 1}
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
                                  className="size-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                <Select
                                  value={s.type}
                                  onValueChange={(v) =>
                                    updateSlot(i, { type: v as AvailType })
                                  }
                                >
                                  <SelectTrigger className="w-full rounded-xl bg-background">
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
                                    <SelectTrigger className="w-full rounded-xl bg-background">
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
                                        className="w-full justify-start rounded-xl font-normal"
                                      >
                                        {s.date
                                          ? s.date.slice(0, 10)
                                          : "Pick date"}
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
                                      className="rounded-xl bg-background [&::-webkit-calendar-picker-indicator]:hidden"
                                    />
                                    <Input
                                      type="time"
                                      aria-label="End time"
                                      value={s.endTime ?? ""}
                                      onChange={(e) =>
                                        updateSlot(i, {
                                          endTime: e.target.value,
                                        })
                                      }
                                      className="rounded-xl bg-background [&::-webkit-calendar-picker-indicator]:hidden"
                                    />
                                  </>
                                )}
                              </div>
                              <p className="mt-2 rounded-lg bg-muted/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
                                {s.type === "BLOCKED"
                                  ? "Blocked — you won't receive jobs for this period."
                                  : `${formatClock(s.startTime)} – ${formatClock(s.endTime)} · Asia/Dhaka`}
                              </p>
                            </div>
                          ))}
                          {slots.length === 0 && (
                            <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-6 text-center">
                              <p className="text-sm text-muted-foreground">
                                No slots yet. Add at least one.
                              </p>
                            </div>
                          )}
                        </div>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </ModalSection>
            </FieldGroup>
          </div>

          <DialogFooter className="mx-0 mb-0 shrink-0 flex-col-reverse gap-2 rounded-b-2xl border-t border-border bg-muted/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-end sm:px-7">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl font-semibold sm:w-auto"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full gap-2 rounded-xl px-6 font-bold shadow-sm sm:w-auto"
            >
              {isPending ? (
                <>
                  <Spinner /> Saving…
                </>
              ) : tech?.isProfileCompleted ? (
                "Save changes"
              ) : (
                "Complete profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ModalSection({
  step,
  icon,
  title,
  sub,
  action,
  children,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  sub?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex items-start justify-between gap-3 border-b border-border/70 bg-muted/40 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground shadow-sm">
            {step}
          </span>
          <div className="min-w-0">
            <h3 className="flex items-center gap-1.5 truncate text-sm font-bold text-foreground">
              <span className="text-primary">{icon}</span>
              {title}
            </h3>
            {sub && (
              <p className="truncate text-xs text-muted-foreground">{sub}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className="space-y-3 p-4 sm:p-5">{children}</div>
    </section>
  );
}

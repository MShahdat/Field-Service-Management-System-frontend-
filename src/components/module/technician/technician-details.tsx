"use client";

import {
  BadgeCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Wrench,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ITechnicianDetail } from "@/types";
import { badgeText, getFallbackText, statusVarient } from "@/utils";
import {
  DAY_NAMES,
  formatAddress,
  formatMemberSince,
} from "../profile/profile-helpers";
import {
  CopyId,
  formatClock,
  formatServiceDate,
  InfoRow,
  Section,
  SummaryCard,
} from "../services/details-util";

type Props = {
  technician: ITechnicianDetail;
};

const TechnicianDetailsView = ({ technician }: Props) => {
  const rating = Number(technician.rating ?? 0);
  const firstName = technician.user.name.split(" ")[0] || "this technician";

  const recurring = technician.availability.filter(
    (slot) => slot.type === "RECURRING",
  );
  const recurringDays = new Set(
    recurring
      .map((slot) => slot.dayOfWeek)
      .filter((day): day is number => day !== null),
  );

  const specialSlots = technician.availability
    .filter((slot) => slot.type === "ONE_OFF" && slot.date)
    .sort(
      (a, b) =>
        new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime(),
    );

  const location =
    technician.address?.city ||
    technician.regions[0]?.area ||
    "Service area on request";

  const availabilityLabel =
    recurringDays.size > 0
      ? `${recurringDays.size} days a week`
      : specialSlots.length > 0
        ? `${specialSlots.length} special dates`
        : "On request";

  return (
    <div className="w-full">
      <header className="mb-5 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <Avatar className="size-16 shrink-0 rounded-full ring-1 ring-primary/15 sm:size-20">
            <AvatarImage
              src={technician.user.profileImg ?? ""}
              alt={technician.user.name}
            />
            <AvatarFallback className="rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
              {getFallbackText(technician.user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {technician.user.name}
              </h1>
              <Badge
                variant={statusVarient(technician.status)}
                className="gap-1.5 rounded-full ring-1 ring-border"
              >
                <span
                  className="size-1.5 rounded-full bg-current"
                  aria-hidden
                />
                {badgeText(technician.status)}
              </Badge>
              {technician.user.emailVerified && (
                <Badge
                  variant="accepted"
                  className="gap-1 rounded-full ring-1 ring-border"
                >
                  <BadgeCheck className="size-3.5" aria-hidden />
                  Verified
                </Badge>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <Star
                  className="size-4 fill-amber-500 text-amber-500"
                  aria-hidden
                />
                {rating > 0 ? rating.toFixed(1) : "New"}
              </span>
              <span aria-hidden>·</span>
              <span>{technician.jobsCompleted} jobs completed</span>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" aria-hidden />
                {location}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <CopyId value={technician.id} label="Copy technician ID" />
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                Member since {formatMemberSince(technician.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-2 md:w-auto md:shrink-0">
          <Button asChild className="flex-1 rounded-xl md:flex-none">
            <a href={`mailto:${technician.user.email}`}>
              <Mail className="size-4" aria-hidden />
              Email
            </a>
          </Button>
          {technician.phone && (
            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-xl md:flex-none"
            >
              <a href={`tel:${technician.phone}`}>
                <Phone className="size-4" aria-hidden />
                Call
              </a>
            </Button>
          )}
        </div>
      </header>

      <Section title="About" className="mb-4 rounded-2xl">
        <p className="text-sm leading-relaxed text-foreground/90">
          {technician.bio?.trim()
            ? technician.bio
            : "This technician has not added a bio yet."}
        </p>
      </Section>

      <section
        aria-label="Summary"
        className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <SummaryCard
          icon={Star}
          label="Average rating"
          value={rating > 0 ? `${rating.toFixed(1)}/5` : "New"}
          sub={`${technician.jobsCompleted} completed jobs`}
        />
        <SummaryCard
          icon={Wrench}
          label="Jobs completed"
          value={`${technician.jobsCompleted}`}
          sub="Through FieldDesk"
        />
        <SummaryCard
          icon={CalendarClock}
          label="Availability"
          value={availabilityLabel}
          sub="Published schedule"
        />
        <SummaryCard
          icon={MapPin}
          label="Based in"
          value={location}
          sub={formatAddress(technician.address) ?? "Address not shared"}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <Section title="Skills & expertise" className="rounded-2xl">
            {technician.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {technician.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
                  >
                    <Wrench className="size-3.5" aria-hidden />
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No skills have been listed yet.
              </p>
            )}
          </Section>

          <Section title="Service areas" className="rounded-2xl">
            {technician.regions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {technician.regions.map((region) => (
                  <span
                    key={region.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1 text-sm font-medium"
                  >
                    <MapPin className="size-3.5 text-primary" aria-hidden />
                    {region.area}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No service areas have been listed yet.
              </p>
            )}
          </Section>

          <Section title="Weekly availability" className="rounded-2xl">
            {recurringDays.size === 0 ? (
              <p className="text-sm text-muted-foreground">
                No recurring availability published. Contact the technician to
                arrange a time.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {DAY_NAMES.map((day, index) => {
                  const slots = recurring.filter(
                    (slot) => slot.dayOfWeek === index,
                  );

                  return (
                    <li
                      key={day}
                      className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-sm font-medium">{day}</span>
                      {slots.length > 0 ? (
                        <span className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                          {slots.map((slot) => (
                            <span key={slot.id}>
                              {formatClock(slot.startTime)} –{" "}
                              {formatClock(slot.endTime)}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Unavailable
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          {specialSlots.length > 0 && (
            <Section title="Special availability" className="rounded-2xl">
              <ul className="space-y-2">
                {specialSlots.map((slot) => (
                  <li
                    key={slot.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5 text-sm"
                  >
                    <span className="inline-flex items-center gap-2 font-medium">
                      <CalendarDays
                        className="size-4 text-primary"
                        aria-hidden
                      />
                      {formatServiceDate(slot.date)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatClock(slot.startTime)} –{" "}
                      {formatClock(slot.endTime)}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Section title="Contact" className="rounded-2xl">
            <InfoRow
              label="Email"
              value={
                <a
                  href={`mailto:${technician.user.email}`}
                  className="text-primary hover:underline"
                >
                  {technician.user.email}
                </a>
              }
            />
            <InfoRow
              label="Phone"
              value={
                technician.phone ? (
                  <a
                    href={`tel:${technician.phone}`}
                    className="text-primary hover:underline"
                  >
                    {technician.phone}
                  </a>
                ) : (
                  "Not shared"
                )
              }
            />
            <InfoRow
              label="Address"
              value={formatAddress(technician.address) ?? "Not shared"}
            />
          </Section>

          <Section title="Verification" className="rounded-2xl">
            <InfoRow
              label="Email"
              value={
                technician.user.emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" aria-hidden />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <XCircle className="size-4" aria-hidden />
                    Pending
                  </span>
                )
              }
            />
            <InfoRow
              label="Profile"
              value={
                technician.isProfileCompleted ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-4" aria-hidden />
                    Complete
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <XCircle className="size-4" aria-hidden />
                    Incomplete
                  </span>
                )
              }
            />
            <InfoRow
              label="Member since"
              value={formatMemberSince(technician.createdAt)}
            />
          </Section>

          <Section
            title={`Work with ${firstName}`}
            className="rounded-2xl border-primary/20 bg-primary/[0.04]"
          >
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" aria-hidden />
                Create a service request and get matched with a verified local
                pro.
              </p>
              <Button asChild className="w-full rounded-xl">
                <Link href="/register">Create a request</Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href="/support">Talk to support</Link>
              </Button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDetailsView;

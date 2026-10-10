"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";

const contactDetails = [
  { icon: Mail, label: "Email", value: "mdshahdat2504@gmail.com" },
  { icon: Phone, label: "Phone", value: "+880 1885374041" },
  { icon: MapPin, label: "Office", value: "Dhaka, Bangladesh" },
  { icon: Clock, label: "Hours", value: "Sat–Thu, 9AM–7PM" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: wire to POST /api/contact
    setSubmitted(true);
  }

  return (
    <div className="bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-8 sm:pb-10">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex flex-col items-center">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Contact
            </span>
            <span className="mt-3 h-px w-8 bg-primary" />
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            Get in touch
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground text-balance">
            Questions about a servicing, a technician application, or a
            partnership? Send it over — we reply within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 sm:gap-8 px-4 sm:px-6 pb-20 sm:pb-28 md:grid-cols-[1.25fr_1fr]">
        {/* Form */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-9 shadow-sm shadow-black/[0.03]">
          {submitted ? (
            <div className="flex h-full min-h-[340px] flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/5">
                <CheckCircle2
                  className="h-5 w-5 text-primary"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="mt-5 text-lg sm:text-xl font-semibold">
                We&apos;ve got your message
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                A member of our team will reach out to the email you provided
                shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    Full name
                  </Label>
                  <Input id="name" placeholder="Jane Rahman" required />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs uppercase tracking-wide text-muted-foreground"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="topic"
                  className="text-xs uppercase tracking-wide text-muted-foreground"
                >
                  Topic
                </Label>
                <Select required>
                  <SelectTrigger id="topic" className="w-full">
                    <SelectValue placeholder="What's this about?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">A schedule issue</SelectItem>
                    <SelectItem value="technician">
                      Technician application
                    </SelectItem>
                    <SelectItem value="billing">
                      Billing &amp; payments
                    </SelectItem>
                    <SelectItem value="press">
                      Press &amp; partnerships
                    </SelectItem>
                    <SelectItem value="other">Something else</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-xs uppercase tracking-wide text-muted-foreground"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's going on..."
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto sm:px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Send message
              </Button>
            </form>
          )}
        </div>

        {/* Directory panel */}
        <div className="h-fit rounded-2xl border border-border bg-card p-6 sm:p-9">
          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Direct lines
          </h3>

          <div className="mt-6 divide-y divide-border">
            {contactDetails.map((c, i) => (
              <div
                key={c.label}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span className="font-mono text-xs text-muted-foreground/70 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border">
                  <c.icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                  <div className="text-sm font-medium break-words">
                    {c.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
            For urgent, active-job issues, use the{" "}
            <span className="font-medium text-foreground">
              Report a problem
            </span>{" "}
            button on your booking page for the fastest response.
          </div>
        </div>
      </section>
    </div>
  );
}

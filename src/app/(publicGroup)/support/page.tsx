"use client";

import { FileText, MessageCircle, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const faqGroups = [
  {
    group: "Getting started",
    items: [
      {
        q: "How do I create an account?",
        a: "Go to Register and sign up as a Customer or Technician with your name, email, and password. You'll receive an OTP to verify your email before you can log in. You can also sign in with Google or Facebook.",
      },
      {
        q: "How does email verification work?",
        a: "After registering, check your inbox for a one-time code and enter it on the Email Verify page. Didn't get it? Wait a minute, check spam, then request a new code.",
      },
      {
        q: "How do I become a manager or technician?",
        a: "Technicians register directly. Manager access needs approval — submit the Manager Apply form and wait for your verification status to move from Pending to Approved. You'll be notified once reviewed.",
      },
      {
        q: "Where do I go after logging in?",
        a: "You're routed by role: customers to /customer-dashboard, technicians to /technician-dashboard, managers to /manager-dashboard, and admins to /admin-dashboard. The navbar Dashboard button always points to the right one.",
      },
    ],
  },
  {
    group: "Booking & tracking",
    items: [
      {
        q: "How do I book a service?",
        a: "Browse categories on the home page or technician list, pick a service, choose a time slot, and confirm. Your request starts as Pending, then moves to Approved, Assigned, In Progress, and finally Completed.",
      },
      {
        q: "How do I track my booking?",
        a: "Open your customer dashboard → Order to see live status, or Service → My Services / Today's Service for the day's jobs. Work orders move through Scheduled → En Route → Started → Completed.",
      },
      {
        q: "How do I cancel a servicing?",
        a: "Go to your customer dashboard, open the booking, and select Cancel. Cancellation is only available before the technician marks the job In Progress — once work has started, contact support instead.",
      },
      {
        q: "What happens if no technician accepts my request?",
        a: "Requests stay open while managers assign a technician. If a request can't be fulfilled it ends as Cancelled — if payment was already held, it is released as Refunded.",
      },
      {
        q: "Something went wrong during the job — what do I do?",
        a: "Use the Report a problem button on your booking page and attach a photo if you can (before/after photos and documents are supported). For urgent, active-job issues this is faster than the contact form.",
      },
    ],
  },
  {
    group: "Payments",
    items: [
      {
        q: "When am I charged?",
        a: "You're only charged after a technician accepts your booking. A payment can be Unpaid, Paid, Failed, or Refunded — you'll see the current state on the booking and on the My Payment page.",
      },
      {
        q: "What payment methods are supported?",
        a: "We support cards and mobile wallets through our checkout partner. All payments are encrypted end-to-end.",
      },
      {
        q: "Where are my receipts?",
        a: "Open your customer dashboard → Payment → My Payment for charges, refunds, and statuses. Managers and admins have their own payment overviews per role.",
      },
    ],
  },
  {
    group: "For technicians",
    items: [
      {
        q: "How do I set my availability?",
        a: "Set your weekly schedule (Asia/Dhaka) during signup — recurring, one-off, or blocked slots. You can review it anytime on your technician dashboard → Profile under Weekly Availability.",
      },
      {
        q: "Where do I find jobs?",
        a: "Check your technician dashboard → Work Orders: Incoming Orders for new requests, Today's Orders for the day's jobs, and My Orders for everything you've taken on.",
      },
      {
        q: "How do I start and complete a job?",
        a: "Open the work order and use the Start button when you arrive (En Route → Started), then Complete when the work is done (Started → Completed). The customer is notified at each step.",
      },
      {
        q: "How and when do I get paid?",
        a: "Earnings are released to your linked account once the customer marks a job as Completed. Track payouts on your dashboard → Payment page.",
      },
    ],
  },
  {
    group: "Account",
    items: [
      {
        q: "How do I change my role after signing up?",
        a: "Roles can't be switched directly — contact support and we'll help migrate your profile.",
      },
      {
        q: "I forgot my password — what now?",
        a: "Use Forgot Password on the login page to get an OTP by email, then set a new password on the Reset Password page.",
      },
      {
        q: "How do I update my profile photo?",
        a: "Open your dashboard → Profile and upload a new photo. It appears across your bookings, navbar avatar, and technician listings.",
      },
    ],
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex flex-col items-center">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {children}
      </span>
      <span className="mt-3 h-px w-8 bg-primary" />
    </div>
  );
}

export default function SupportPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqGroups;
    return faqGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.q.toLowerCase().includes(q) ||
            item.a.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  const total = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="bg-background text-foreground">
      <section className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-20 pb-10 sm:pb-12 text-center">
        <Eyebrow>Support</Eyebrow>
        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance">
          How can we help?
        </h1>
        <div className="relative mx-auto mt-8 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help articles..."
            aria-label="Search help articles"
            className="pl-9 pr-9 bg-card"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {query.trim() && (
          <output className="mt-3 block text-sm text-muted-foreground">
            {total === 0
              ? `No results for "${query.trim()}"`
              : `${total} result${total === 1 ? "" : "s"} for "${query.trim()}"`}
          </output>
        )}
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-16 sm:pb-20">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-sm shadow-black/[0.03]">
            <h2 className="font-semibold">Nothing matched your search</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Try different keywords, or reach our support team directly and
              we&apos;ll point you to the right page.
            </p>
            <Button asChild className="mt-5">
              <Link href="/contact">Contact support</Link>
            </Button>
          </div>
        ) : (
          filtered.map((group) => (
            <div key={group.group} className="mb-8 sm:mb-10">
              <h2 className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {group.group}
              </h2>
              <Accordion
                type="single"
                collapsible
                className="rounded-2xl border border-border bg-card shadow-sm shadow-black/[0.03]"
              >
                {group.items.map((item, i) => (
                  <AccordionItem
                    key={item.q}
                    value={`${group.group}-${i}`}
                    className="border-border px-4 sm:px-5 last:border-b-0"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        )}
      </section>

      <section className="border-t border-border bg-secondary/40 py-14 sm:py-16">
        <div className="mx-auto grid max-w-3xl gap-5 sm:gap-6 px-4 sm:px-6 sm:grid-cols-2">
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border">
              <MessageCircle
                className="h-4.5 w-4.5 text-primary"
                strokeWidth={1.75}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold">Still stuck?</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Email mdshahdat2504@gmail.com or call +880 1885374041 (Sat–Thu,
                9AM–7PM) — we reply within one business day.
              </p>
              <Button
                variant="link"
                className="mt-2 h-auto p-0 text-primary"
                asChild
              >
                <Link href="/contact">Contact support →</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border">
              <FileText
                className="h-4.5 w-4.5 text-primary"
                strokeWidth={1.75}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold">Check a booking</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Most status questions are answered on your bookings page — live
                service and work-order status included.
              </p>
              <Button
                variant="link"
                className="mt-2 h-auto p-0 text-primary"
                asChild
              >
                <Link href="/customer-dashboard/order">Go to my orders →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

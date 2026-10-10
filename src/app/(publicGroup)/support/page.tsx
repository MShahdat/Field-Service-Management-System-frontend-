import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, MessageCircle, FileText } from "lucide-react";

const faqGroups = [
  {
    group: "Servicing",
    items: [
      {
        q: "How do I cancel a servicing?",
        a: "Go to your customer dashboard, open the booking, and select Cancel. Cancellation is only available before the technician marks the job In Progress.",
      },
      {
        q: "Can I reschedule instead of cancelling?",
        a: "Yes — open the booking and choose Reschedule to pick a new available time slot with the same technician.",
      },
      {
        q: "What happens if no technician accepts my request?",
        a: "Requests left unaccepted for 24 hours are automatically cancelled and refunded if payment was already held.",
      },
    ],
  },
  {
    group: "Payments",
    items: [
      {
        q: "When am I charged?",
        a: "You're only charged after a technician accepts your booking. You'll see a Pay Now button appear on the booking card.",
      },
      {
        q: "What payment methods are supported?",
        a: "We support cards and mobile wallets through our checkout partner. All payments are encrypted end-to-end.",
      },
    ],
  },
  {
    group: "For technicians",
    items: [
      {
        q: "How do I set my availability?",
        a: "From your technician dashboard, open the Availability tab and click a day to add or remove working hours.",
      },
      {
        q: "How and when do I get paid?",
        a: "Earnings are released to your linked account once the customer marks a job as Completed.",
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
        q: "How do I delete my account?",
        a: "Go to Settings → Account, and select Delete account. This is permanent and can't be undone.",
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
            placeholder="Search help articles..."
            className="pl-9 bg-card"
          />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-16 sm:pb-20">
        {faqGroups.map((group) => (
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
        ))}
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
                Reach our support team directly and we&apos;ll get back within a
                business day.
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
                Most status questions are answered right on your booking page.
              </p>
              <Button
                variant="link"
                className="mt-2 h-auto p-0 text-primary"
                asChild
              >
                <Link href="/customer-dashboard">Go to dashboard →</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

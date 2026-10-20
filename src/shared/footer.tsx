import { Wrench } from "lucide-react";
import Link from "next/link";
import { FaInstagramSquare, FaTwitter } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FOOTER_LINKS = {
  company: [
    { label: "About us", href: "/about-us" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Careers", href: "/about-us" },
    { label: "Support", href: "/support" },
  ],
  customers: [
    { label: "Browse services", href: "/technician" },
    { label: "Find technicians", href: "/technician" },
    { label: "Booking help", href: "/support" },
    { label: "Cancellations", href: "/support" },
  ],
  technicians: [
    { label: "Become a pro", href: "/manager-apply" },
    { label: "Technician dashboard", href: "/technician" },
    { label: "Payouts", href: "/support" },
    { label: "Community", href: "/about-us" },
  ],
};

const SOCIALS = [
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: IoLogoYoutube, href: "https://youtube.com", label: "YouTube" },
  {
    icon: FaInstagramSquare,
    href: "https://instagram.com",
    label: "Instagram",
  },
  { icon: FaTwitter, href: "https://x.com", label: "X (Twitter)" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-11/12 px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold"
            >
              <Wrench className="h-5 w-5 text-primary" />
              FieldDesk
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-xs">
              Connecting homeowners with trusted, verified service professionals
              since 2023.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Company" links={FOOTER_LINKS.company} />
          <FooterColumn title="For customers" links={FOOTER_LINKS.customers} />
          <FooterColumn
            title="For technicians"
            links={FOOTER_LINKS.technicians}
          />
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Stay updated</p>
            <p className="text-sm text-muted-foreground">
              Tips and updates, no spam.
            </p>
          </div>
          <form
            className="flex w-full max-w-sm gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              required
              aria-label="Email address"
              placeholder="you@email.com"
              className="h-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              className="h-10 px-5 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              Join
            </Button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} FieldDesk, Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link href="/" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <div>
    <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
      {title}
    </p>
    <ul className="mt-4 space-y-3">
      {links.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;

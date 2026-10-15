import { Logo } from "@/assets/logo";
import Link from "next/link";

const Header = () => {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-5xl shrink-0 items-center justify-between px-6 py-3">
      <Logo />
      <p className="hidden text-sm text-muted-foreground sm:block">
        Need help?{" "}
        <Link
          href="/support"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Contact support
        </Link>
      </p>
    </header>
  );
};

export default Header;

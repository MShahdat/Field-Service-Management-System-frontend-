import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";


type Props = {
  backHref: string
  back: string
  current: string
}

const Breadcrumb = ({ backHref, back, current }: Props) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground"
    >
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 rounded-sm font-medium transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden />
        <span>{back}</span>
      </Link>
      <ChevronRight className="size-3.5" aria-hidden />
      <span className="font-medium text-foreground">{current}</span>
    </nav>
  );
};

export default Breadcrumb;
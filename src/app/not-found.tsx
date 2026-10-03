import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </main>
  );
}

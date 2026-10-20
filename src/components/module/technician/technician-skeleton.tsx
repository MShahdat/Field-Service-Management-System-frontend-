import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CARD_KEYS = [
  "technician-card-1",
  "technician-card-2",
  "technician-card-3",
  "technician-card-4",
  "technician-card-5",
  "technician-card-6",
];

export const TechnicianGridSkeleton = () => (
  <div
    className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
    aria-hidden
  >
    {CARD_KEYS.map((key) => (
      <Card key={key} className="h-full gap-0 overflow-hidden p-0">
        <Skeleton className="h-16 w-full rounded-none" />
        <CardContent className="flex flex-1 flex-col px-5 pb-5">
          <div className="-mt-10 flex justify-center">
            <Skeleton className="size-20 rounded-full ring-4 ring-card" />
          </div>
          <Skeleton className="mx-auto mt-3 h-5 w-36" />
          <Skeleton className="mx-auto mt-2 h-3 w-28" />
          <Skeleton className="mt-4 h-16 w-full rounded-xl" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-9 w-full rounded-lg" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const TechnicianDirectorySkeleton = () => (
  <div className="flex flex-col gap-6 lg:flex-row" aria-hidden>
    <Skeleton className="hidden h-[560px] w-72 rounded-2xl lg:block" />
    <div className="min-w-0 flex-1 space-y-5">
      <Skeleton className="h-[76px] w-full rounded-2xl" />
      <TechnicianGridSkeleton />
    </div>
  </div>
);

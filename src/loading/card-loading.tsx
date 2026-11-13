import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  length?: number
}

export function CardSkeleton({ length = 6 }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[...Array(length)].map((_, index) => (
        <div key={index as number}>
          <Card className="w-full max-w-sm">
            <CardHeader>
              <Skeleton className="aspect-video w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-1.5 h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

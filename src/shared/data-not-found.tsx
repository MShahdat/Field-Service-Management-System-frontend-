import React from "react";
import { AlertCircle, MoveLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  message?: string;
  description?: string;
};

const DataNotFoundCard = ({ message, description }: Props) => {
  return (
    <div className="mt-4 md:mt-8 flex flex-col items-center">
      <Card className="w-full max-w-5xl border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <div className="space-y-1 flex flex-col items-center">
            <p className="text-base font-semibold text-destructive">
              {message || "Something went wrong"}
            </p>
            <p className="text-sm text-muted-foreground max-w-md">
              {description || "Please try again, or go back to the homepage."}
            </p>
            <Button asChild variant="link" className="mt-3 gap-1 px-0">
              <Link href="/">
                <MoveLeft className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataNotFoundCard;

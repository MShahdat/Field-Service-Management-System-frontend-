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
    <div className="mt-4 flex w-full flex-col items-center px-2 md:mt-8">
      <Card className="w-full max-w-5xl border-dashed border-border/80 bg-chart-1/10 shadow-sm dark:border-border dark:bg-card dark:shadow-black/20">
        <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-5 text-center sm:py-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20 dark:bg-destructive/15 dark:ring-destructive/30">
            <AlertCircle className="h-7 w-7 text-destructive dark:text-destructive" />
          </div>
          <div className="flex flex-col items-center space-y-1.5">
            <p className="text-base font-semibold tracking-tight text-destructive">
              {message || "Something went wrong"}
            </p>
            <p className="max-w-md text-sm leading-relaxed text-balance text-muted-foreground">
              {description || "Please try again, or go back to the homepage."}
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-4 gap-1.5 rounded-full border-border bg-background px-5 shadow-xs hover:bg-muted hover:text-foreground dark:border-input dark:bg-transparent dark:hover:bg-muted/60 dark:hover:text-foreground"
            >
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


import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import React from "react";



type Props = {
  label: string;
  component: React.ReactNode
}

const FilterBtn = ({ label, component }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <SlidersHorizontal className="size-4 text-primary" />
          Filters
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[200px] overflow-y-auto p-0 sm:max-w-sm"
      >
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle>{label ?? "-"}</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          {component}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterBtn;
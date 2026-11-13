"use client";

import type { ITechnician } from "@/types";
import TechnicianCard from "./technician-card";
import { cn } from "cn";

type Props = {
  technicians: ITechnician[];
  className?: string;
};

const TechnicianLists = ({
  technicians,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {technicians.map((technician) => (
        <TechnicianCard key={technician.id} technician={technician} />
      ))}
    </div>
  );
};

export default TechnicianLists;

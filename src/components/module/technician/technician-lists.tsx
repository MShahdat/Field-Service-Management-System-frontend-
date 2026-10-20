import type { ITechnicianPublic } from "@/types";
import TechnicianCard from "./technician-card";

type Props = {
  technicians: ITechnicianPublic[];
};

const TechnicianLists = ({ technicians }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {technicians.map((technician) => (
        <TechnicianCard key={technician.id} technician={technician} />
      ))}
    </div>
  );
};

export default TechnicianLists;

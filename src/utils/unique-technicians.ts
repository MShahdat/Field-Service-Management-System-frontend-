export type TechnicianLike = {
  id: string;
};

export const dedupeTechniciansById = <T extends TechnicianLike>(
  technicians: T[] | null | undefined,
): T[] => {
  if (!technicians?.length) {
    return [];
  }

  return Array.from(
    new Map(technicians.map((technician) => [technician.id, technician] as const)).values(),
  );
};

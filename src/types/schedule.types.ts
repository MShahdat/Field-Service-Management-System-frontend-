type ScheduleStatus = "SCHEDULED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface ISchedule {
  id: string;
  servicingDate: string;
  startTime: string;
  endTime: string;
  actualStart: string | null;
  actualEnd: string | null;
  status: ScheduleStatus;
  isdeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  technicianId: string;
  workOrderId: string;
}

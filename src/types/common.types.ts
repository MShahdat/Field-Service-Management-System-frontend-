export interface Coordinates {
  latitude: number;
  longtude: number;
}

export interface Address {
  city: string;
  street: string;
  postalCode: string;
  coordinates?: Coordinates;
}

export type WorkOrderStatus =
  | "SCHEDULED"
  | "EN_ROUTE"
  | "STARTED"
  | "COMPLETED"
  | "CANCELLED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type ServiceStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ASSIGMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type FileAttachmentType =
  | "BEFORE_PHOTO"
  | "AFTER_PHOTO"
  | "SIGNATURE"
  | "DOCUMENT";

export type ScheduleStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

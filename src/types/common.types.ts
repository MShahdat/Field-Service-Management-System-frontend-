export interface Coordinates {
  latitude: number | null;
  longitude: number | null;
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
  | "ASSIGNED"
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

export type Endpoint = "today" | "incoming" | "all";

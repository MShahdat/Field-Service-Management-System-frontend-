export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "CUSTOMER"
  | "TECHNICIAN"
  | "MANAGER";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type AuthProvider = "CREDENTIAL" | "GOOGLE" | "FACEBOOK";

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

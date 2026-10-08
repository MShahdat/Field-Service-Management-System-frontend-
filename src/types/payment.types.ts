type PaymentStatus =
  "UNPAID" |
  "PAID" |
  "FAILED" |
  "CANCELLED" |
  "REFUNDED"




export interface IPayment {
  id: string;
  paymentId: string;
  amount: number;
  method: 'bKash' | string;
  transectionId: string | null;
  status: PaymentStatus
  paidAt: string | null;
  payerReference: string;
  currency: 'BDT' | string;
  merchantInvoiceNumber: string;
  refundTrxId: string | null;
  refundAmount: number | null;
  refundedAt: string | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  workOrderId: string;
}

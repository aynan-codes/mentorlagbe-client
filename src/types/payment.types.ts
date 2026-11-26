export interface Payment {
  _id: string;
  userEmail: string;
  userName: string;
  userRole: "student" | "tutor";
  planName: "pro";
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid" | "pending" | "failed";
  paidAt: string;
}
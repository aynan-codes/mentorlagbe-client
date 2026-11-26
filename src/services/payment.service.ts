import apiClient from "@/lib/api-client";

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

interface PaymentHistoryResponse {
  success: boolean;
  totalPayments: number;
  payments: Payment[];
}

export const createCheckoutSession = async (): Promise<string> => {
  const response = await apiClient.post(
    "/payments/create-checkout-session"
  );

  const checkoutUrl = response.data?.checkoutUrl;

  if (!checkoutUrl) {
    throw new Error("Unable to create Stripe checkout session.");
  }

  return checkoutUrl;
};

export const getMyPaymentHistory = async (): Promise<Payment[]> => {
  const response = await apiClient.get<PaymentHistoryResponse>(
    "/payments/history"
  );

  if (!response.data?.success) {
    throw new Error("Unable to retrieve payment history.");
  }

  return response.data.payments || [];
};
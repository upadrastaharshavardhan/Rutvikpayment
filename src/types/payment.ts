export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  upiId: string;
  qrCodeUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface QRPayment {
  id: string;
  bookingId: string;
  bankAccountId: string;
  payerName: string;
  payerPhone: string;
  utrNumber: string;
  amount?: number;
  proofUrl?: string;
  status: 'pending' | 'verified' | 'failed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface PaymentConfig {
  enableQRPayments: boolean;
  defaultBankAccountId: string;
}
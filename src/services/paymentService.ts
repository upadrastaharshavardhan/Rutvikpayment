import { collection, addDoc, getDocs, doc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import { db, auth, isAdmin, ensureAuthenticated } from '../lib/firebase';
import { QRPayment, BankAccount } from '../types/payment';
import { bankAccounts } from '../data/bankAccounts';

export async function createQRPayment(paymentData: Omit<QRPayment, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const user = ensureAuthenticated();
  
  const payment: Omit<QRPayment, 'id'> = {
    ...paymentData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'qr_payments'), payment);
  return docRef.id;
}

export async function fetchQRPayments(): Promise<QRPayment[]> {
  if (!isAdmin()) {
    throw new Error('Unauthorized access');
  }

  const querySnapshot = await getDocs(collection(db, 'qr_payments'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as QRPayment[];
}

export async function updateQRPaymentStatus(
  paymentId: string,
  status: 'verified' | 'failed',
  adminNotes?: string
): Promise<void> {
  if (!isAdmin()) {
    throw new Error('Unauthorized access');
  }

  const paymentRef = doc(db, 'qr_payments', paymentId);
  const updateData: Record<string, any> = {
    status,
    updatedAt: new Date().toISOString(),
    verifiedBy: auth.currentUser?.uid,
    verifiedAt: new Date().toISOString()
  };
  
  if (adminNotes) {
    updateData.adminNotes = adminNotes;
  }
  
  await updateDoc(paymentRef, updateData);
}

export async function fetchBankAccounts(): Promise<BankAccount[]> {
  // Return the static bank accounts from our data file
  return bankAccounts.filter(account => account.isActive);
}

export async function getActiveBankAccount(): Promise<BankAccount | null> {
  const accounts = await fetchBankAccounts();
  return accounts[0] || null; // Return first active account as default
}

export async function getPaymentConfig(): Promise<{ enableQRPayments: boolean }> {
  // For now, return a default config. This can be made dynamic later
  return { enableQRPayments: true };
}
import React, { useState, useEffect } from 'react';
import { X, Copy, Upload, CheckCircle } from 'lucide-react';
import { BankAccount } from '../../types/payment';
import { getActiveBankAccount, createQRPayment } from '../../services/paymentService';
import toast from 'react-hot-toast';

interface QRPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount?: number;
  onPaymentSubmitted: () => void;
}

export function QRPaymentModal({ isOpen, onClose, bookingId, amount, onPaymentSubmitted }: QRPaymentModalProps) {
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [step, setStep] = useState<'payment' | 'details' | 'confirmation'>('payment');
  const [paymentDetails, setPaymentDetails] = useState({
    payerName: '',
    payerPhone: '',
    utrNumber: '',
    proofUrl: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadBankAccount();
    }
  }, [isOpen]);

  const loadBankAccount = async () => {
    try {
      const account = await getActiveBankAccount();
      setBankAccount(account);
    } catch (error) {
      console.error('Error loading bank account:', error);
      toast.error('Failed to load payment details');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const generateUPILink = () => {
    if (!bankAccount) return '';
    const upiUrl = `upi://pay?pa=${bankAccount.upiId}&pn=${encodeURIComponent(bankAccount.accountHolderName)}`;
    if (amount) {
      return `${upiUrl}&am=${amount}`;
    }
    return upiUrl;
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createQRPayment({
        bookingId,
        bankAccountId: bankAccount!.id,
        payerName: paymentDetails.payerName,
        payerPhone: paymentDetails.payerPhone,
        utrNumber: paymentDetails.utrNumber,
        amount,
        proofUrl: paymentDetails.proofUrl
      });

      setStep('confirmation');
      onPaymentSubmitted();
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error('Failed to submit payment details');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('payment');
    setPaymentDetails({
      payerName: '',
      payerPhone: '',
      utrNumber: '',
      proofUrl: ''
    });
    onClose();
  };

  if (!isOpen || !bankAccount) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">QR/UPI Payment</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm text-gray-600">QR Code</p>
                      <p className="text-xs text-gray-500">Scan with any UPI app</p>
                    </div>
                  </div>
                  {amount && (
                    <p className="text-lg font-semibold text-green-600">Amount: ₹{amount}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium">UPI ID:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{bankAccount.upiId}</span>
                      <button
                        onClick={() => copyToClipboard(bankAccount.upiId)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <a
                    href={generateUPILink()}
                    className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg text-center font-medium hover:bg-green-700 transition-colors"
                  >
                    Pay with UPI App
                  </a>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Bank Details</h3>
                  <div className="text-sm space-y-1 text-blue-700">
                    <p><strong>Bank:</strong> {bankAccount.bankName}</p>
                    <p><strong>Account:</strong> {bankAccount.accountNumber}</p>
                    <p><strong>IFSC:</strong> {bankAccount.ifscCode}</p>
                    <p><strong>Name:</strong> {bankAccount.accountHolderName}</p>
                  </div>
                </div>

                <button
                  onClick={() => setStep('details')}
                  className="w-full mt-6 bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  I've Made the Payment
                </button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payer Name *
                </label>
                <input
                  type="text"
                  required
                  value={paymentDetails.payerName}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, payerName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter payer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={paymentDetails.payerPhone}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, payerPhone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UTR/Transaction ID *
                </label>
                <input
                  type="text"
                  required
                  value={paymentDetails.utrNumber}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, utrNumber: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter UTR/Transaction ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Screenshot URL (Optional)
                </label>
                <input
                  type="url"
                  value={paymentDetails.proofUrl}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, proofUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter screenshot URL"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload to any image hosting service and paste the URL
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Details'}
                </button>
              </div>
            </form>
          )}

          {step === 'confirmation' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold text-green-800">Payment Submitted!</h3>
              <p className="text-gray-600">
                Your payment details have been submitted and are under review. 
                You will be notified once the payment is verified.
              </p>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Status:</strong> Pending Verification
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  UTR: {paymentDetails.utrNumber}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
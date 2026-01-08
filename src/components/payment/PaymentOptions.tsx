import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone } from 'lucide-react';
import { BankSelectionModal } from './BankSelectionModal';
import { RazorpayPayment } from './RazorpayPayment';
import { getPaymentConfig } from '../../services/paymentService';

interface PaymentOptionsProps {
  bookingId: string;
  amount?: number;
  onPaymentMethodSelected: (method: 'qr' | 'gateway') => void;
  onPaymentCompleted: () => void;
}

export function PaymentOptions({ bookingId, amount, onPaymentMethodSelected, onPaymentCompleted }: PaymentOptionsProps) {
  const [showBankModal, setShowBankModal] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [qrPaymentsEnabled, setQRPaymentsEnabled] = useState(false);

  useEffect(() => {
    loadPaymentConfig();
  }, []);

  const loadPaymentConfig = async () => {
    try {
      const config = await getPaymentConfig();
      setQRPaymentsEnabled(config.enableQRPayments);
    } catch (error) {
      console.error('Error loading payment config:', error);
    }
  };

  const handleQRPayment = () => {
    onPaymentMethodSelected('qr');
    setShowBankModal(true);
  };

  const handleGatewayPayment = () => {
    onPaymentMethodSelected('gateway');
    setShowRazorpay(true);
  };

  const handleBankPaymentSubmitted = () => {
    setShowBankModal(false);
    onPaymentCompleted();
  };

  const handleRazorpaySuccess = () => {
    setShowRazorpay(false);
    onPaymentCompleted();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
      
      <div className="grid gap-4">
        {qrPaymentsEnabled && (
          <button
            onClick={handleQRPayment}
            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Bank QR/UPI Payment</p>
                <p className="text-sm text-gray-600">Choose from multiple banks & UPI options</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-600 font-medium">Instant</p>
              <p className="text-xs text-gray-500">6 Bank options</p>
            </div>
          </button>
        )}

        <button
          onClick={handleGatewayPayment}
          className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Card/Net Banking</p>
              <p className="text-sm text-gray-600">Secure payment via Razorpay</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-600 font-medium">Secure</p>
            <p className="text-xs text-gray-500">Instant verification</p>
          </div>
        </button>
      </div>

      <BankSelectionModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        bookingId={bookingId}
        amount={amount}
        onPaymentSubmitted={handleBankPaymentSubmitted}
      />

      <RazorpayPayment
        isOpen={showRazorpay}
        onClose={() => setShowRazorpay(false)}
        bookingId={bookingId}
        amount={amount || 1000}
        onSuccess={handleRazorpaySuccess}
      />
    </div>
  );
}
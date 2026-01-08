import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}

export function RazorpayPayment({ 
  isOpen, 
  onClose, 
  bookingId, 
  amount, 
  onSuccess 
}: RazorpayPaymentProps) {

  useEffect(() => {
    if (isOpen && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded');
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      toast.error('Payment gateway not loaded. Please try again.');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with your key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'RUTVIK Services',
      description: `Booking Payment - ${bookingId}`,
      image: 'https://stackblitz.com/storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBKzAwR0E9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--ad5dfaa420a2ac59f9e85d05857c4c8a980e2f91/Screenshot%202024-09-08%20191118.png',
      order_id: '', // You'll need to create this from your backend
      handler: function (response: any) {
        console.log('Payment successful:', response);
        toast.success('Payment successful!');
        
        // Here you would typically verify the payment on your backend
        // For now, we'll just call the success callback
        onSuccess();
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      notes: {
        booking_id: bookingId
      },
      theme: {
        color: '#ea580c' // Orange color matching your theme
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed');
          onClose();
        }
      }
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      toast.error('Failed to open payment gateway');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Secure Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-800 mb-2">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Booking ID:</span>
                <span className="font-mono">{bookingId.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">₹{amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Gateway:</span>
                <span>Razorpay</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Accepted Payment Methods</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
              <div>• Credit Cards</div>
              <div>• Debit Cards</div>
              <div>• Net Banking</div>
              <div>• UPI</div>
              <div>• Wallets</div>
              <div>• EMI Options</div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Pay ₹{amount} Securely
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Powered by Razorpay • 256-bit SSL Encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
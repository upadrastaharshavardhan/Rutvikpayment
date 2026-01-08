import React, { useState } from 'react';
import { X, Copy, ExternalLink, Smartphone } from 'lucide-react';
import { bankAccounts, BankAccount } from '../../data/bankAccounts';
import toast from 'react-hot-toast';

interface BankSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount?: number;
  onPaymentSubmitted: () => void;
}

export function BankSelectionModal({ 
  isOpen, 
  onClose, 
  bookingId, 
  amount, 
  onPaymentSubmitted 
}: BankSelectionModalProps) {
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(null);
  const [step, setStep] = useState<'selection' | 'payment' | 'details' | 'confirmation'>('selection');
  const [paymentDetails, setPaymentDetails] = useState({
    payerName: '',
    payerPhone: '',
    utrNumber: '',
    proofUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const generateUPILink = (bank: BankAccount) => {
    const upiUrl = `upi://pay?pa=${bank.upiId}&pn=${encodeURIComponent(bank.accountHolderName)}`;
    if (amount) {
      return `${upiUrl}&am=${amount}&cu=INR`;
    }
    return upiUrl;
  };

  const openUPIApp = (appName: string, bank: BankAccount) => {
    const upiLink = generateUPILink(bank);
    
    const appLinks: Record<string, string> = {
      phonepe: `phonepe://pay?${upiLink.split('?')[1]}`,
      gpay: `tez://upi/pay?${upiLink.split('?')[1]}`,
      paytm: `paytmmp://pay?${upiLink.split('?')[1]}`,
      bhim: upiLink
    };

    const link = appLinks[appName] || upiLink;
    
    try {
      window.location.href = link;
      setTimeout(() => {
        toast.success(`Opening ${appName.toUpperCase()}...`);
      }, 100);
    } catch (error) {
      toast.error(`Could not open ${appName.toUpperCase()}`);
    }
  };

  const handleBankSelect = (bank: BankAccount) => {
    setSelectedBank(bank);
    setStep('payment');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically save to your database
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStep('confirmation');
      toast.success('Payment details submitted successfully');
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error('Failed to submit payment details');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('selection');
    setSelectedBank(null);
    setPaymentDetails({
      payerName: '',
      payerPhone: '',
      utrNumber: '',
      proofUrl: ''
    });
    onClose();
  };

  const handlePaymentCompleted = () => {
    handleClose();
    onPaymentSubmitted();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {step === 'selection' ? 'Select Bank for Payment' : 
               step === 'payment' ? `Pay via ${selectedBank?.bankName}` :
               step === 'details' ? 'Payment Details' : 'Payment Submitted'}
            </h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          {step === 'selection' && (
            <div className="space-y-3">
              <p className="text-gray-600 mb-4">Choose your preferred bank for UPI/QR payment:</p>
              {bankAccounts.filter(bank => bank.isActive).map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => handleBankSelect(bank)}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        {bank.bankName.split(' ').map(word => word[0]).join('').slice(0, 3)}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{bank.bankName}</p>
                      <p className="text-sm text-gray-600">{bank.upiId}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          )}

          {step === 'payment' && selectedBank && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    <img 
                      src={selectedBank.qrCodeUrl} 
                      alt={`${selectedBank.bankName} QR Code`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `
                          <div class="text-center">
                            <div class="text-4xl mb-2">📱</div>
                            <p class="text-sm text-gray-600">${selectedBank.bankName}</p>
                            <p class="text-xs text-gray-500">QR Code</p>
                          </div>
                        `;
                      }}
                    />
                  </div>
                  {amount && (
                    <p className="text-lg font-semibold text-green-600">Amount: ₹{amount}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium">UPI ID:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono">{selectedBank.upiId}</span>
                      <button
                        onClick={() => copyToClipboard(selectedBank.upiId)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => openUPIApp('phonepe', selectedBank)}
                      className="bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      PhonePe
                    </button>
                    <button
                      onClick={() => openUPIApp('gpay', selectedBank)}
                      className="bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Google Pay
                    </button>
                    <button
                      onClick={() => openUPIApp('paytm', selectedBank)}
                      className="bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      Paytm
                    </button>
                    <button
                      onClick={() => openUPIApp('bhim', selectedBank)}
                      className="bg-orange-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                    >
                      BHIM UPI
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Bank Details</h3>
                  <div className="text-sm space-y-1 text-blue-700">
                    <p><strong>Bank:</strong> {selectedBank.bankName}</p>
                    <p><strong>Account:</strong> {selectedBank.accountNumber}</p>
                    <p><strong>IFSC:</strong> {selectedBank.ifscCode}</p>
                    <p><strong>Name:</strong> {selectedBank.accountHolderName}</p>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setStep('selection')}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Change Bank
                  </button>
                  <button
                    onClick={() => setStep('details')}
                    className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    I've Made Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'details' && selectedBank && (
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Paid to:</strong> {selectedBank.bankName} ({selectedBank.upiId})
                </p>
              </div>

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

          {step === 'confirmation' && selectedBank && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
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
                  <strong>Bank:</strong> {selectedBank.bankName}
                </p>
                <p className="text-sm text-yellow-700">
                  <strong>UTR:</strong> {paymentDetails.utrNumber}
                </p>
              </div>
              <button
                onClick={handlePaymentCompleted}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
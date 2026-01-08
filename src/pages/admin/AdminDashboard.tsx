import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, LogOut, CreditCard, Calendar } from 'lucide-react';
import { auth, isAdmin } from '../../lib/firebase';
import { BookingTable } from '../../components/admin/BookingTable';
import { QRPaymentsTable } from '../../components/admin/QRPaymentsTable';
import { fetchBookings, updateBookingStatus, generateMeetingLink } from '../../services/bookingService';
import { fetchQRPayments, updateQRPaymentStatus } from '../../services/paymentService';
import { Booking } from '../../types/booking';
import { QRPayment } from '../../types/payment';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [qrPayments, setQRPayments] = useState<QRPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'bookings' | 'payments'>('bookings');
  const navigate = useNavigate();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        // Check if user is logged in and is admin
        if (!auth.currentUser) {
          navigate('/admin/login');
          return;
        }

        if (!isAdmin()) {
          toast.error('Unauthorized access');
          navigate('/admin/login');
          return;
        }

        const data = await fetchBookings();
        setBookings(data);
        
        const paymentsData = await fetchQRPayments();
        setQRPayments(paymentsData);
      } catch (error: any) {
        console.error('Error fetching bookings:', error);
        toast.error(error.message || 'Failed to fetch bookings');
        if (error.code === 'permission-denied' || error.message === 'Unauthorized access') {
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleApprove = async (bookingId: string, booking: Booking) => {
    try {
      await updateBookingStatus(bookingId, 'approved');
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'approved' } : b
        )
      );
      toast.success('Booking approved successfully');
    } catch (error: any) {
      console.error('Error approving booking:', error);
      toast.error(error.message || 'Failed to approve booking');
      if (error.message === 'Unauthorized access') {
        navigate('/admin/login');
      }
    }
  };

  const handleReject = async (bookingId: string, booking: Booking) => {
    const reason = window.prompt('Please enter a reason for rejection:');
    if (reason === null) return;

    try {
      await updateBookingStatus(bookingId, 'rejected', reason);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: 'rejected', rejectionReason: reason } : b
        )
      );
      toast.success('Booking rejected successfully');
    } catch (error: any) {
      console.error('Error rejecting booking:', error);
      toast.error(error.message || 'Failed to reject booking');
      if (error.message === 'Unauthorized access') {
        navigate('/admin/login');
      }
    }
  };

  const handleGenerateMeetLink = async (bookingId: string, booking: Booking) => {
    try {
      const meetLink = await generateMeetingLink(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, meetingLink: meetLink } : b
        )
      );
      toast.success('Meeting link generated successfully');
    } catch (error: any) {
      console.error('Error generating meeting link:', error);
      toast.error(error.message || 'Failed to generate meeting link');
      if (error.message === 'Unauthorized access') {
        navigate('/admin/login');
      }
    }
  };

  const handleVerifyPayment = async (paymentId: string, payment: QRPayment) => {
    const notes = window.prompt('Add verification notes (optional):');
    
    try {
      await updateQRPaymentStatus(paymentId, 'verified', notes || undefined);
      setQRPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId ? { ...p, status: 'verified', adminNotes: notes || undefined } : p
        )
      );
      toast.success('Payment verified successfully');
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      toast.error(error.message || 'Failed to verify payment');
    }
  };

  const handleRejectPayment = async (paymentId: string, payment: QRPayment) => {
    const reason = window.prompt('Please enter a reason for rejection:');
    if (reason === null) return;

    try {
      await updateQRPaymentStatus(paymentId, 'failed', reason);
      setQRPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId ? { ...p, status: 'failed', adminNotes: reason } : p
        )
      );
      toast.success('Payment marked as failed');
    } catch (error: any) {
      console.error('Error rejecting payment:', error);
      toast.error(error.message || 'Failed to reject payment');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-5 h-5 inline mr-2" />
                QR/UPI Payments ({qrPayments.filter(p => p.status === 'pending').length})
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  >
                    {activeTab === 'bookings' ? (
                      <>
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </>
                    ) : (
                      <>
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="failed">Failed</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {activeTab === 'bookings' ? (
            <BookingTable
              bookings={bookings.filter(booking => 
                statusFilter === 'all' || booking.status === statusFilter
              )}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              onApprove={handleApprove}
              onReject={handleReject}
              onGenerateMeetLink={handleGenerateMeetLink}
            />
          ) : (
            <QRPaymentsTable
              payments={qrPayments.filter(payment => 
                statusFilter === 'all' || payment.status === statusFilter
              )}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              onVerify={handleVerifyPayment}
              onReject={handleRejectPayment}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
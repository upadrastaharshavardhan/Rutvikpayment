import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Calendar, User, MapPin, LogOut, Plus, Flower2, Star } from 'lucide-react';

interface UserData {
  fullName: string;
  email: string;
  city: string;
  country: string;
}

interface BookingData {
  id: string;
  date: string;
  time: string;
  poojaType: string;
  requirements: string;
  status: string;
  createdAt: string;
}

function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        const userDocRef = doc(db, 'registerformData', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
        }

        const bookingsRef = collection(db, 'bookings');
        const q = query(bookingsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const bookingsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as BookingData[];

        setBookings(bookingsList);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* User Profile Section */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{userData?.fullName}</h2>
                <p className="text-gray-600">{userData?.email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{userData?.city}, {userData?.country}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-6 w-full flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="md:col-span-3">
          {/* Services Quick Access */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Rutvik NRI Services</h3>
                <Flower2 className="w-8 h-8" />
              </div>
              <p className="mb-4">Book online poojas and ceremonies</p>
              <Link
                to="/book-pooja"
                className="inline-block bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
              >
                Book online Pooja
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">RUTVIK Services</h3>
                <Star className="w-8 h-8" />
              </div>
              <p className="mb-4">Book online poojas and ceremonies</p>
              <Link
                to="/rutvik-services"
                className="inline-block bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Book offline pooja
              </Link>
            </div>

                 <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Book Muhurtham</h3>
                <Star className="w-8 h-8" />
              </div>
              <p className="mb-4">Expert Muhurtham Consultancy & Traditional Pooja Services</p>
              <Link
                to="https://bookmuhurtam.netlify.app/"
                className="inline-block bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
              >
                Book Muhurtham
              </Link>
            </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Rutvik Pooja store</h3>
                <Flower2 className="w-8 h-8" />
              </div>
              <p className="mb-4">Pooja Samagri & pooja Kits Available at Rutvik Pooja Store</p>
              <Link
                to="https://rutvikpoojastore.netlify.app/"
                className="inline-block bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
              >
                Book Pooja samagri
              </Link>
            </div>
           </div>
         </div>
            
         

          {/* Bookings Section */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
              Recent Bookings
            </h3>
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking.id} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Service Type</p>
                        <p className="text-gray-600">{booking.poojaType}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Status</p>
                        <p className={`capitalize ${
                          booking.status === 'pending'
                            ? 'text-yellow-600'
                            : booking.status === 'completed'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {booking.status}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Date</p>
                        <p className="text-gray-600">{booking.date}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Time</p>
                        <p className="text-gray-600">{booking.time}</p>
                      </div>
                    </div>
                    {booking.requirements && (
                      <div className="mt-4">
                        <p className="font-semibold">Special Requirements</p>
                        <p className="text-gray-600">{booking.requirements}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No bookings found.</p>
                <div className="space-x-4">
                  <Link
                    to="/book-pooja"
                    className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Book Pooja
                  </Link>
                  <Link
                    to="/rutvik-services"
                    className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
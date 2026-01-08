import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Video, Users, Star, BookOpen, PhoneCall, Flower2, ArrowRight, Globe, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: <Video className="w-6 h-6 text-orange-500" />,
      title: "Online Sessions",
      description: "Connect with experienced priests and astrologers from anywhere"
    },
    {
      icon: <Star className="w-6 h-6 text-purple-500" />,
      title: "Premium Services",
      description: "Access exclusive ceremonies and personalized consultations"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      title: "Expert Guidance",
      description: "Get guidance from our team of experienced professionals"
    },
    {
      icon: <Globe className="w-6 h-6 text-green-500" />,
      title: "Global Reach",
      description: "Serve devotees across continents with online services"
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-500" />,
      title: "Certified Priests",
      description: "All our priests are thoroughly vetted and certified"
    },
    {
      icon: <Calendar className="w-6 h-6 text-indigo-500" />,
      title: "Flexible Scheduling",
      description: "Book services at your convenient time"
    }
  ];

  return (
    <div className="w-full">
      {/* Main Hero Section */}
      <section className="relative min-h-[100vh] md:h-screen flex items-center justify-center text-white py-20 md:py-0">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/004/896/848/original/zodiac-wheel-with-galaxy-stars-background-astrology-horoscope-with-signs-aries-taurus-gemini-cancer-leo-virgo-libra-scorpio-sagittarius-capricorn-aquarius-pisces-symbols-free-vector.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4"></h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"></p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
            {/* Rutvik NRI Services Card */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-orange-600/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Flower2 className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold mb-3">Rutvik NRI Services</h2>
              <p className="mb-4 text-white/80 text-sm">Connect with your spiritual roots through online pooja services and ceremonies</p>
              <Link
                to="/book-pooja"
                className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors w-full text-center"
              >
                Book Online Pooja
              </Link>
            </div>

            {/* Rutvik Services Card */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-xl font-bold mb-3">RUTVIK Services</h2>
              <p className="mb-4 text-white/80 text-sm">Connect with your spiritual roots through offline pooja services and ceremonies</p>
              <Link
                to="/rutvik-services"
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full text-center"
              >
                Book Offline Pooja
              </Link>
            </div>

            {/* Muhurtham Services Card */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
              <h2 className="text-xl font-bold mb-3">Rutvik Muhurtham</h2>
              <p className="mb-4 text-white/80 text-sm">Expert muhurtham consultancy and astrological guidance for life's important moments</p>
              <Link
                to="https://bookmuhurtam.netlify.app/"
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full text-center"
              >
                Book Muhurtham
              </Link>
            </div>

            {/* Join Rutvik Card */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
              <div className="w-16 h-16 bg-orange-600/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold mb-3">Join RUTVIK</h2>
              <p className="mb-4 text-white/80 text-sm">Connect with us & join with us to Perform pooja services and ceremonies</p>
              <Link
                to="https://registerinrutvik.netlify.app/"
                className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full text-center"
              >
                Join RUTVIK
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-orange-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-purple-700 transition-all flex items-center justify-center mx-auto"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Welcome to RUTVIK Family</h2>
          <p className="text-lg md:text-xl text-center mb-12 text-gray-300">Experience the divine through our comprehensive spiritual services</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-orange-500 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
              <div className="text-sm md:text-base text-white/80">Poojas Conducted</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-sm md:text-base text-white/80">Expert Priests</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">20+</div>
              <div className="text-sm md:text-base text-white/80">Countries Served</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">5000+</div>
              <div className="text-sm md:text-base text-white/80">Happy Devotees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Ready to Begin Your Spiritual Journey?</h2>
          <p className="text-gray-600 mb-8">
            Let us guide you through your spiritual path with our expert services
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link
              to="/book-pooja"
              className="w-full md:w-auto flex items-center justify-center bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book a Pooja
            </Link>
            <Link
              to="/rutvik-services"
              className="w-full md:w-auto flex items-center justify-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Star className="w-5 h-5 mr-2" />
              Explore Services
            </Link>
            <a
              href="tel:+917993924499"
              className="w-full md:w-auto flex items-center justify-center bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
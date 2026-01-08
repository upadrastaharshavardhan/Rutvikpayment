import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Video, Users, Star, BookOpen, PhoneCall, Flower2, Filter, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { poojaTypes } from '../data/poojaTypes';

function RutvikServices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'life_events', name: 'Life Events' },
    { id: 'homam', name: 'Homams' },
    { id: 'special_occasions', name: 'Special Occasions' }
  ];

  const filteredPoojas = selectedCategory === 'all' 
    ? poojaTypes 
    : poojaTypes.filter(pooja => pooja.category === selectedCategory);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?q=80&w=1800&auto=format&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-indigo-900/80" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">RUTVIK Services</h1>
          <p className="text-xl mb-8">Expert Muhurtham Consultancy & Traditional Pooja Services</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleGetStarted}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Get Started
            </button>
            <Link
              to="/book-pooja"
              className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Book Pooja
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center mb-12 gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-purple-100'
                } border border-purple-200`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPoojas.map(pooja => (
              <div key={pooja.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all border border-purple-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Flower2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{pooja.name}</h3>
                <p className="text-gray-600 mb-4">{pooja.description}</p>
                
                {pooja.duration && (
                  <div className="flex items-center text-gray-500 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{pooja.duration}</span>
                  </div>
                )}

                {pooja.requirements && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm text-purple-600 mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {pooja.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {pooja.samagri && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm text-purple-600 mb-2">Pooja Samagri:</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {pooja.samagri.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => user ? navigate('/book-pooja') : navigate('/login')}
                  className="mt-6 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-purple-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose RUTVIK Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Priests</h3>
              <p className="text-purple-200">Experienced and knowledgeable priests for all ceremonies</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-purple-200">Choose times that work best for you and your family</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Online Consultations</h3>
              <p className="text-purple-200">Get guidance from anywhere in the world</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Need Help Choosing?</h2>
          <p className="text-gray-600 mb-8">
            Our experts are here to guide you in selecting the right services for your needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              <PhoneCall className="w-5 h-5 mr-2" />
              Contact Us
            </button>
            <button className="flex items-center bg-white text-purple-600 border border-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors">
              <Calendar className="w-5 h-5 mr-2" />
             <Link
              to="https://bookmuhurtam.netlify.app"
              className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
             Schedule Consultation
            </Link> 
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RutvikServices;
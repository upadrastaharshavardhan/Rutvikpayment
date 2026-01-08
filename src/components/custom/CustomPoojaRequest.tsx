import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Calendar, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface CustomPoojaRequestProps {
  category: 'life_events' | 'homam' | 'special_occasions';
}

export function CustomPoojaRequest({ category }: CustomPoojaRequestProps) {
  const [formData, setFormData] = useState({
    poojaName: '',
    requirements: '',
    date: '',
    time: '',
    additionalNotes: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!auth.currentUser) {
      toast.error('Please login to submit a custom request');
      navigate('/login');
      return;
    }

    try {
      await addDoc(collection(db, 'customRequests'), {
        ...formData,
        category,
        userId: auth.currentUser.uid,
        status: 'pending',
        createdAt: new Date().toISOString()
      });

      toast.success('Custom request submitted successfully');
      setFormData({
        poojaName: '',
        requirements: '',
        date: '',
        time: '',
        additionalNotes: ''
      });
    } catch (error) {
      console.error('Error submitting custom request:', error);
      toast.error('Failed to submit request. Please try again.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
      <h3 className="text-xl font-semibold mb-4">Request Custom {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="poojaName" className="block text-sm font-medium text-gray-700">
            Custom Pooja Name
          </label>
          <input
            type="text"
            id="poojaName"
            name="poojaName"
            required
            value={formData.poojaName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter custom pooja name"
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
            Requirements
          </label>
          <textarea
            id="requirements"
            name="requirements"
            required
            value={formData.requirements}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Describe your requirements"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Preferred Date
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">
              Preferred Time
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={2}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Any additional information..."
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Submit Custom Request
        </button>
      </form>
    </div>
  );
}
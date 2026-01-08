import React from 'react';
import { Clock, Calendar } from 'lucide-react';

interface CustomRequest {
  id: string;
  poojaName: string;
  requirements: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
  additionalNotes?: string;
}

interface CustomRequestsListProps {
  requests: CustomRequest[];
}

export function CustomRequestsList({ requests }: CustomRequestsListProps) {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {request.poojaName}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                Category: {request.category.replace('_', ' ')}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                request.status === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : request.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
            <p className="text-gray-600">{request.requirements}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{request.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{request.time}</span>
            </div>
          </div>

          {request.additionalNotes && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Additional Notes:
              </h4>
              <p className="text-sm text-gray-600">{request.additionalNotes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
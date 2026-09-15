'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

export default function ApprovalPage() {
  const { token } = useParams();
  const [status, setStatus] = useState<'IDLE' | 'APPROVING' | 'APPROVED' | 'ERROR'>('IDLE');

  const handleApprove = async () => {
    setStatus('APPROVING');
    try {
      const response = await fetch(`/api/approval/approve`, {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setStatus('APPROVED');
      } else {
        setStatus('ERROR');
      }
    } catch (error) {
      setStatus('ERROR');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
        <h1 className="text-2xl font-bold">Proof Review</h1>
        <p className="text-gray-600">Please review the digital proof of your order below.</p>

        <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
          {/* In a real app, this would be an <iframe> or <img> of the Canva proof */}
          [Canva Proof Preview]
        </div>

        {status === 'IDLE' && (
          <div className="flex gap-4">
            <button
              onClick={() => alert('Request sent to staff for changes.')}
              className="flex-1 py-2 px-4 border rounded font-medium hover:bg-gray-50"
            >
              Request Changes
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
            >
              Approve
            </button>
          </div>
        )}

        {status === 'APPROVING' && <p className="text-blue-600 font-medium">Processing approval...</p>}
        {status === 'APPROVED' && <p className="text-green-600 font-bold">✅ Order Approved! It has been sent to print.</p>}
        {status === 'ERROR' && <p className="text-red-600 font-medium">Something went wrong. Please try again.</p>}
      </div>
    </div>
  );
}

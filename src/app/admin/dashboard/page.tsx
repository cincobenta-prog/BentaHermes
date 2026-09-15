'use client';

import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [lateOrders, setLateOrders] = useState<any[]>([]);

  useEffect(() => {
    // Mock fetch of late orders
    setLateOrders([
      { id: 'order_1', client: 'John Doe', due: '2026-09-15' },
      { id: 'order_2', client: 'Jane Smith', due: '2026-09-14' },
    ]);
  }, []);

  const handleOverride = async (orderId: string) => {
    try {
      const response = await fetch('/api/admin/override', {
        method: 'POST',
        body: JSON.stringify({ orderId, adminUserId: 'admin_1' }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setLateOrders(prev => prev.filter(o => o.id !== orderId));
        alert('Submission override approved.');
      }
    } catch (error) {
      alert('Error overriding submission.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Governance</h1>

      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b font-medium">
          Late Submissions (Requires Approval)
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="p-4">Client</th>
              <th className="p-4">Due Date</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {lateOrders.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-400">No late submissions pending.</td>
              </tr>
            ) : (
              lateOrders.map(order => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{order.client}</td>
                  <td className="p-4">{order.due}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOverride(order.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Approve Late Order
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

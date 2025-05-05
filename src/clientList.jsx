import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ClientList = () => {
  const [savedClients, setSavedClients] = useState([]);

  useEffect(() => {
    // Load saved clients from localStorage when component mounts
    const loadedClients = JSON.parse(localStorage.getItem('clientOrders') || '[]');
    setSavedClients(loadedClients);
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-3 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Client Orders</h1>
          <Link to="/" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            New Order
          </Link>
        </div>

        {savedClients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No saved orders found. Create your first order!
          </div>
        ) : (
          <div className="space-y-4">
            {savedClients.map((client, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between mb-2">
                  <h2 className="text-lg font-semibold">{client.clientName || 'Unnamed Client'}</h2>
                  <span className="text-sm text-gray-500">{formatDate(client.timestamp)}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div>
                    <span className="text-gray-600">Products: {client.products.length}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">Total: {client.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t">
                  <Link 
                    to={`/order/${index}`} 
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList; 
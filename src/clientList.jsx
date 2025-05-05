import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ClientList = () => {
  const [savedClients, setSavedClients] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved clients from localStorage when component mounts
    const loadedClients = JSON.parse(localStorage.getItem('clientOrders') || '[]');
    setSavedClients(loadedClients);
    
    // Add window resize listener for responsive behavior
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString(undefined, 
      isSmallScreen ? { dateStyle: 'short', timeStyle: 'short' } : { dateStyle: 'medium', timeStyle: 'short' }
    );
  };

  const deleteOrder = (index) => {
    const updatedClients = [...savedClients];
    updatedClients.splice(index, 1);
    setSavedClients(updatedClients);
    localStorage.setItem('clientOrders', JSON.stringify(updatedClients));
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Client Orders</h1>
          <div className="flex gap-3">
            <Link to="/" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center sm:text-left">
              New Order
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-center sm:text-left"
            >
              Logout
            </button>
          </div>
        </div>

        {savedClients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg">No saved orders found.</p>
            <p className="mt-2">Create your first order!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedClients.map((client, index) => (
              <div 
                key={index} 
                className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                  <h2 className="text-lg font-semibold truncate">{client.clientName || 'Unnamed Client'}</h2>
                  <span className="text-xs sm:text-sm text-gray-500">{formatDate(client.timestamp)}</span>
                </div>
                
                <div className="mb-3">
                  <span className="text-gray-600 text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded-full">Order #{index + 1}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-md p-2 text-center">
                    <div className="text-xs text-gray-500">Products</div>
                    <div className="font-medium">{client.products.length}</div>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2 text-center">
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="font-medium text-green-600">{client.grandTotal.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="mt-2 border-t pt-3">
                  <div className="text-xs text-gray-500 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Product Summary:
                  </div>
                  <div className="max-h-20 sm:max-h-24 overflow-y-auto mb-3 bg-gray-50 rounded-md p-2">
                    <ul className="space-y-1">
                      {client.products.map((product, prodIndex) => (
                        <li key={prodIndex} className="text-xs sm:text-sm flex justify-between">
                          <span className="font-medium truncate max-w-[150px] sm:max-w-none">
                            {product.name || 'Unnamed Product'}
                          </span>
                          <span className="text-gray-600 whitespace-nowrap ml-2">
                            {product.count} × {product.price.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t flex flex-col sm:flex-row sm:justify-between gap-3">
                  <Link 
                    to={`/order/${index}`} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center justify-center sm:justify-start bg-blue-50 hover:bg-blue-100 py-2 px-3 rounded-md transition-colors w-full sm:w-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Full Details
                  </Link>
                  <button
                    onClick={() => deleteOrder(index)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium inline-flex items-center justify-center sm:justify-start bg-red-50 hover:bg-red-100 py-2 px-3 rounded-md transition-colors w-full sm:w-auto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
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
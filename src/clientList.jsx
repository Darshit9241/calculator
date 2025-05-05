import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ClientList = () => {
  const [savedClients, setSavedClients] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch clients from API when component mounts
    fetchClients();
    
    // Add window resize listener for responsive behavior
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setSavedClients(data);
      setError('');
    } catch (err) {
      setError('Error loading client orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString(undefined, 
      isSmallScreen ? { dateStyle: 'short', timeStyle: 'short' } : { dateStyle: 'medium', timeStyle: 'short' }
    );
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      
      // Update the UI by removing the deleted order
      setSavedClients(savedClients.filter(client => client.id !== id));
    } catch (err) {
      setError('Failed to delete order. Please try again.');
      console.error(err);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };
  
  const editOrder = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-4 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Client Orders
            </h1>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Order
            </Link>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md animate-pulse">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
                <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-blue-300 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              </div>
              <p className="ml-4 text-lg text-gray-600 font-medium">Loading orders...</p>
            </div>
          ) : savedClients.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-6">You haven't created any orders yet. Get started by creating your first order.</p>
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create First Order
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {savedClients.map((client) => (
                <div 
                  key={client.id} 
                  className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white"
                >
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <h2 className="text-xl font-bold truncate text-gray-800 flex-grow">
                        {client.clientName || 'Unnamed Client'}
                      </h2>
                      <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full shadow-sm">
                        {formatDate(client.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="inline-flex items-center text-gray-600 text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Order ID: {client.id}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Products</div>
                        <div className="font-bold text-xl">{client.products?.length || 0}</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total</div>
                        <div className="font-bold text-xl text-green-600">₹{client.grandTotal?.toFixed(2) || '0.00'}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Product Summary</span>
                      </div>
                      <div className="max-h-28 overflow-y-auto border border-gray-100 rounded-lg p-3 bg-gray-50">
                        <ul className="space-y-2">
                          {client.products?.map((product, prodIndex) => (
                            <li key={prodIndex} className="text-sm flex justify-between items-center">
                              <span className="font-medium truncate max-w-[150px] text-gray-800">
                                {product.name || 'Unnamed Product'}
                              </span>
                              <span className="text-gray-600 whitespace-nowrap ml-2 bg-white px-2 py-1 rounded-md text-xs">
                                {product.count} × ₹{parseFloat(product.price).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-4 border-t grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => navigate(`/order/${client.id}`)}
                      className="flex flex-col items-center justify-center py-2 px-1 rounded-lg hover:bg-green-50 transition-colors text-green-600 hover:text-green-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-xs font-medium">View</span>
                    </button>
                    <button 
                      onClick={() => editOrder(client.id)}
                      className="flex flex-col items-center justify-center py-2 px-1 rounded-lg hover:bg-blue-50 transition-colors text-blue-600 hover:text-blue-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="text-xs font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => deleteOrder(client.id)}
                      className="flex flex-col items-center justify-center py-2 px-1 rounded-lg hover:bg-red-50 transition-colors text-red-500 hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="text-xs font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientList; 
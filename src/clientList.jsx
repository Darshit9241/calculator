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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-8 px-4 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl p-5 sm:p-8 mb-8 border border-white/50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Client Orders
            </h1>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-200/50 transform hover:-translate-y-0.5 duration-200 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Order
            </Link>
          </div>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl animate-pulse backdrop-blur-sm shadow-sm">
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
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="ml-6 text-lg text-gray-600 font-medium">Loading orders...</p>
            </div>
          ) : savedClients.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-white/70 shadow-inner">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-blue-400 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">No orders found</h2>
              <p className="text-gray-500 max-w-lg mx-auto mb-8">You haven't created any orders yet. Get started by creating your first order.</p>
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg hover:shadow-blue-200/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create First Order
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {savedClients.map((client) => (
                <div 
                  key={client.id} 
                  className="border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm hover:bg-white/90 transform hover:-translate-y-1"
                >
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <h2 className="text-xl font-bold truncate text-gray-800 flex-grow">
                        {client.clientName || 'Unnamed Client'}
                      </h2>
                      <span className="text-sm text-gray-600 font-medium bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/50">
                        {formatDate(client.timestamp)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="inline-flex items-center text-gray-600 text-sm bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Order ID: {client.id}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-3 text-center border border-white/50 shadow-sm">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Products</div>
                        <div className="font-bold text-2xl text-gray-700">{client.products?.length || 0}</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 text-center border border-white/50 shadow-sm">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total</div>
                        <div className="font-bold text-2xl text-green-600">₹{client.grandTotal?.toFixed(2) || '0.00'}</div>
                      </div>
                    </div>
                    
                    {/* Payment information */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center border border-white/50 shadow-sm">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Amount Paid</div>
                        <div className="font-bold text-2xl text-blue-600">₹{client.amountPaid?.toFixed(2) || '0.00'}</div>
                      </div>
                      <div className={`${(client.grandTotal - (client.amountPaid || 0)) <= 0 ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-yellow-50 to-amber-50'} rounded-xl p-3 text-center border border-white/50 shadow-sm`}>
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Balance</div>
                        <div className={`font-bold text-2xl ${(client.grandTotal - (client.amountPaid || 0)) <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                          ₹{(client.grandTotal - (client.amountPaid || 0)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment status badge */}
                    <div className="mt-3 mb-4 flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${client.paymentStatus === 'cleared' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border border-yellow-200'}`}>
                        {client.paymentStatus === 'cleared' ? 'Payment Cleared' : 'Payment Pending'}
                      </span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Product Summary</span>
                      </div>
                      <div className="max-h-32 overflow-y-auto border border-gray-100 rounded-xl p-3 bg-gradient-to-br from-gray-50 to-blue-50/30 shadow-inner">
                        <ul className="space-y-2.5">
                          {client.products?.map((product, prodIndex) => (
                            <li key={prodIndex} className="text-sm flex justify-between items-center">
                              <span className="font-medium truncate max-w-[150px] text-gray-800">
                                {product.name || 'Unnamed Product'}
                              </span>
                              <span className="text-gray-600 whitespace-nowrap ml-2 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs shadow-sm border border-white/50">
                                {product.count} × ₹{parseFloat(product.price).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-4 border-t border-gray-100 grid grid-cols-3 gap-2 bg-gradient-to-br from-gray-50 to-blue-50/30">
                    <button 
                      onClick={() => navigate(`/order/${client.id}`)}
                      className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl hover:bg-white/70 transition-all text-green-600 hover:text-green-700 hover:shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-xs font-medium">View</span>
                    </button>
                    <button 
                      onClick={() => editOrder(client.id)}
                      className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl hover:bg-white/70 transition-all text-blue-600 hover:text-blue-700 hover:shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span className="text-xs font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => deleteOrder(client.id)}
                      className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl hover:bg-white/70 transition-all text-red-500 hover:text-red-600 hover:shadow-sm"
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
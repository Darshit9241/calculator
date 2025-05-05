import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ClientList = () => {
  const [savedClients, setSavedClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
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

  useEffect(() => {
    // Apply filters when savedClients or activeFilter changes
    applyFilters();
  }, [savedClients, activeFilter]);

  const applyFilters = () => {
    if (activeFilter === 'all') {
      setFilteredClients(savedClients);
    } else if (activeFilter === 'pending') {
      setFilteredClients(savedClients.filter(client => client.paymentStatus !== 'cleared'));
    } else if (activeFilter === 'cleared') {
      setFilteredClients(savedClients.filter(client => client.paymentStatus === 'cleared'));
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      // Sort data by timestamp in descending order (newest first)
      const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setSavedClients(sortedData);
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
  
  const clearOrderPayment = async (id) => {
    if (!window.confirm('Mark this order payment as cleared?')) {
      return;
    }
    
    try {
      // Find the client to update
      const clientToUpdate = savedClients.find(client => client.id === id);
      if (!clientToUpdate) return;
      
      // Update the payment status to cleared
      const updatedClient = {
        ...clientToUpdate,
        paymentStatus: 'cleared',
        amountPaid: clientToUpdate.grandTotal // Set amount paid to the grand total
      };
      
      const response = await fetch(`https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order payment status');
      }
      
      // Update the UI with the updated order
      setSavedClients(savedClients.map(client => 
        client.id === id ? updatedClient : client
      ));
    } catch (err) {
      setError('Failed to clear order payment. Please try again.');
      console.error(err);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };
  
  const deleteAllOrders = async () => {
    if (!window.confirm('Are you sure you want to delete ALL orders? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    let hasError = false;
    
    try {
      // Delete each order one by one
      const deletePromises = savedClients.map(async (client) => {
        try {
          const response = await fetch(`https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram/${client.id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error(`Failed to delete order ${client.id}`);
          }
          return true;
        } catch (err) {
          console.error(`Error deleting order ${client.id}:`, err);
          hasError = true;
          return false;
        }
      });
      
      await Promise.all(deletePromises);
      
      if (hasError) {
        setError('Some orders could not be deleted. Please refresh and try again.');
      } else {
        // Clear the clients list
        setSavedClients([]);
        setFilteredClients([]);
      }
    } catch (err) {
      setError('Failed to delete all orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      // Clear error after 3 seconds if there was one
      if (hasError) {
        setTimeout(() => setError(''), 3000);
      }
    }
  };
  
  const editOrder = (id) => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="backdrop-blur-md bg-white/10 rounded-xl shadow-2xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Orders Dashboard
            </h1>
            <div className="flex gap-3">
              {savedClients.length > 0 && (
                <button 
                  onClick={deleteAllOrders}
                  className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-200 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete All
                </button>
              )}
              <Link 
                to="/" 
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Order
              </Link>
            </div>
          </div>
          
          {/* Filter options */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              All Orders ({savedClients.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              Pending ({savedClients.filter(client => client.paymentStatus !== 'cleared').length})
            </button>
            <button
              onClick={() => setActiveFilter('cleared')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'cleared'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              Cleared ({savedClients.filter(client => client.paymentStatus === 'cleared').length})
            </button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 text-red-100 p-4 mb-6 rounded-lg animate-pulse backdrop-blur-sm shadow-xl">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-emerald-500 animate-spin"></div>
              <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-r-4 border-teal-300 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <p className="ml-6 text-lg text-slate-300 font-medium">Loading orders...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-slate-600 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {savedClients.length === 0 
                ? 'No orders found' 
                : `No ${activeFilter === 'pending' ? 'pending payment' : activeFilter === 'cleared' ? 'cleared payment' : ''} orders found`}
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              {savedClients.length === 0 
                ? 'You haven\'t created any orders yet. Get started by creating your first order.' 
                : activeFilter !== 'all' 
                  ? `There are no orders with ${activeFilter === 'pending' ? 'pending' : 'cleared'} payment status.`
                  : 'You haven\'t created any orders yet.'}
            </p>
            {savedClients.length === 0 && (
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg shadow-lg hover:shadow-emerald-500/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create First Order
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredClients.map((client) => (
              <div 
                key={client.id} 
                className="backdrop-blur-md bg-white/10 rounded-xl shadow-xl overflow-hidden border border-white/10 group hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Card header */}
                <div className="p-5 bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-b border-slate-600/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-white">{client.clientName || 'Unnamed Client'}</h3>
                      <p className="text-xs text-slate-400 mt-1">Order ID: {client.id}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      client.paymentStatus === 'cleared' 
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {client.paymentStatus === 'cleared' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    {formatDate(client.timestamp)}
                  </p>
                </div>
                
                {/* Card content */}
                <div className="p-5 space-y-4">
                  {/* Financial summary - with better mobile handling */}
                  <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 flex xs:block justify-between items-center">
                      <p className="text-xs text-slate-400 mr-2 xs:mr-0 whitespace-nowrap">Total:</p>
                      <p className="font-medium text-white text-sm sm:text-base truncate">₹{client.grandTotal?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 flex xs:block justify-between items-center">
                      <p className="text-xs text-slate-400 mr-2 xs:mr-0 whitespace-nowrap">Paid:</p>
                      <p className="font-medium text-emerald-400 text-sm sm:text-base truncate">₹{client.amountPaid?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 flex xs:block justify-between items-center">
                      <p className="text-xs text-slate-400 mr-2 xs:mr-0 whitespace-nowrap">Balance:</p>
                      <p className={`font-medium text-sm sm:text-base truncate ${(client.grandTotal - (client.amountPaid || 0)) <= 0 ? 'text-sky-400' : 'text-amber-400'}`}>
                        ₹{(client.grandTotal - (client.amountPaid || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Products section - better mobile handling */}
                  <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <p className="text-xs sm:text-sm font-medium text-white">Products</p>
                      <span className="bg-white/10 text-xs text-white px-2 py-0.5 sm:py-1 rounded-full">
                        {client.products?.length || 0} items
                      </span>
                    </div>
                    
                    {client.products && client.products.length > 0 ? (
                      <div className="max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                        <ul className="space-y-2">
                          {client.products.slice().reverse().map((product, index) => (
                            <li key={index} className="flex justify-between items-center text-sm bg-white/5 rounded-lg p-2 border border-white/5">
                              <span className="text-slate-300 truncate max-w-[120px]">
                                {product.name || 'Unnamed Product'}
                              </span>
                              <span className="text-slate-400 whitespace-nowrap text-xs bg-white/10 px-2 py-0.5 rounded">
                                {product.count} × ₹{parseFloat(product.price).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No products</p>
                    )}
                  </div>
                </div>
                
                {/* Card actions - improved for mobile */}
                <div className="grid grid-cols-4 border-t border-slate-700/50">
                  <button 
                    onClick={() => navigate(`/order/${client.id}`)}
                    className="py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors border-r border-slate-700/50 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  <button 
                    onClick={() => editOrder(client.id)}
                    className="py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-slate-300 hover:bg-white/10 transition-colors border-r border-slate-700/50 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  {client.paymentStatus !== 'cleared' ? (
                    <button 
                      onClick={() => clearOrderPayment(client.id)}
                      className="py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors border-r border-slate-700/50 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pay
                    </button>
                  ) : (
                    <div className="py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-sky-400 bg-sky-500/10 border-r border-slate-700/50 flex items-center justify-center opacity-70">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Paid
                    </div>
                  )}
                  <button 
                    onClick={() => deleteOrder(client.id)}
                    className="py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center"
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
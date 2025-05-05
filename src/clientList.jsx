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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-8 px-4 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl p-5 sm:p-8 mb-8 border border-white/50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-800 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 xs:h-10 xs:w-10 mr-2 xs:mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Client Orders
            </h1>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {savedClients.length > 0 && (
                <button 
                  onClick={deleteAllOrders}
                  className="flex-1 sm:flex-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200/50 transform hover:-translate-y-0.5 duration-200 font-medium text-sm sm:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden xs:inline">Delete All</span>
                  <span className="xs:hidden">Delete</span>
                </button>
              )}
              <Link 
                to="/" 
                className="flex-1 sm:flex-auto inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-200/50 transform hover:-translate-y-0.5 duration-200 font-medium text-sm sm:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="hidden xs:inline">New Order</span>
                <span className="xs:hidden">New</span>
              </Link>
            </div>
          </div>
          
          {/* Filter options */}
          <div className="mb-6 flex flex-wrap gap-3 justify-center sm:justify-start">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="hidden xxs:inline">All Orders</span>
              <span className="xxs:hidden">All</span> ({savedClients.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="hidden xxs:inline">Pending Payment</span>
              <span className="xxs:hidden">Pending</span> ({savedClients.filter(client => client.paymentStatus !== 'cleared').length})
            </button>
            <button
              onClick={() => setActiveFilter('cleared')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'cleared'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="hidden xxs:inline">Payment Cleared</span>
              <span className="xxs:hidden">Cleared</span> ({savedClients.filter(client => client.paymentStatus === 'cleared').length})
            </button>
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
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-white/70 shadow-inner">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-blue-400 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                {savedClients.length === 0 
                  ? 'No orders found' 
                  : `No ${activeFilter === 'pending' ? 'pending payment' : activeFilter === 'cleared' ? 'cleared payment' : ''} orders found`}
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto mb-8">
                {savedClients.length === 0 
                  ? 'You haven\'t created any orders yet. Get started by creating your first order.' 
                  : activeFilter !== 'all' 
                    ? `There are no orders with ${activeFilter === 'pending' ? 'pending' : 'cleared'} payment status.`
                    : 'You haven\'t created any orders yet.'}
              </p>
              {savedClients.length === 0 && (
                <Link 
                  to="/" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-lg hover:shadow-blue-200/50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create First Order
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop view - Table format */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Client Name</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Products</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product Details</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Total</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Paid</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Balance</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client, index) => (
                      <tr 
                        key={client.id} 
                        className={`hover:bg-blue-50/50 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-800">{client.clientName || 'Unnamed Client'}</div>
                          <div className="text-xs text-gray-500">ID: {client.id}</div>
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-gray-600">{formatDate(client.timestamp)}</td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                            {client.products?.length || 0}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="max-h-24 overflow-y-auto pr-2">
                            {client.products && client.products.length > 0 ? (
                              <ul className="space-y-1.5">
                                {client.products.slice().reverse().map((product, prodIndex) => (
                                  <li key={prodIndex} className="text-xs flex justify-between">
                                    <span className="font-medium text-gray-700 truncate max-w-[120px]">
                                      {product.name || 'Unnamed Product'}
                                    </span>
                                    <span className="text-gray-500 whitespace-nowrap ml-2">
                                      {product.count} × ₹{parseFloat(product.price).toFixed(2)}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-xs text-gray-500 italic">No products</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-medium text-gray-800">₹{client.grandTotal?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-4 text-center font-medium text-blue-600">₹{client.amountPaid?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`font-medium ${(client.grandTotal - (client.amountPaid || 0)) <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                            ₹{(client.grandTotal - (client.amountPaid || 0)).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${client.paymentStatus === 'cleared' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {client.paymentStatus === 'cleared' ? 'Cleared' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button 
                              onClick={() => navigate(`/order/${client.id}`)}
                              className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600" 
                              title="View Order"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => editOrder(client.id)}
                              className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600" 
                              title="Edit Order"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {client.paymentStatus !== 'cleared' && (
                              <button 
                                onClick={() => clearOrderPayment(client.id)}
                                className="p-1.5 rounded-lg hover:bg-green-100 text-green-600" 
                                title="Clear Payment"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            )}
                            <button 
                              onClick={() => deleteOrder(client.id)}
                              className="p-1.5 rounded-lg hover:bg-red-100 text-red-500" 
                              title="Delete Order"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile view - Card format */}
              <div className="md:hidden space-y-4">
                {filteredClients.map((client) => (
                  <div 
                    key={client.id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                  >
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{client.clientName || 'Unnamed Client'}</h3>
                          <p className="text-xs text-gray-500">ID: {client.id}</p>
                        </div>
                        <span className="text-xs text-gray-600 bg-white/80 px-2 py-1 rounded-full">
                          {formatDate(client.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      {/* Financial information in columns */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-xs text-gray-500">Products</div>
                          <div className="font-semibold text-blue-600">{client.products?.length || 0}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-xs text-gray-500">Total</div>
                          <div className="font-semibold text-gray-800">₹{client.grandTotal?.toFixed(2) || '0.00'}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-xs text-gray-500">Status</div>
                          <div className={`text-xs font-medium ${client.paymentStatus === 'cleared' ? 'text-green-600' : 'text-amber-600'}`}>
                            {client.paymentStatus === 'cleared' ? 'Cleared' : 'Pending'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment details */}
                      <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg p-3">
                        <div>
                          <div className="text-xs text-gray-500">Amount Paid</div>
                          <div className="font-semibold text-blue-600">₹{client.amountPaid?.toFixed(2) || '0.00'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Balance</div>
                          <div className={`font-semibold ${(client.grandTotal - (client.amountPaid || 0)) <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                            ₹{(client.grandTotal - (client.amountPaid || 0)).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Product list */}
                      {client.products && client.products.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-2 font-medium border-b border-gray-200 pb-1">Product List</div>
                          <div className="max-h-32 overflow-y-auto">
                            <ul className="space-y-2">
                              {client.products.slice().reverse().map((product, index) => (
                                <li key={index} className="flex justify-between items-center text-sm">
                                  <span className="font-medium truncate max-w-[150px] text-gray-800">
                                    {product.name || 'Unnamed Product'}
                                  </span>
                                  <span className="text-gray-600 whitespace-nowrap bg-white px-2 py-0.5 rounded text-xs border border-gray-200">
                                    {product.count} × ₹{parseFloat(product.price).toFixed(2)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="px-4 py-3 bg-gray-50 flex flex-wrap gap-2 border-t border-gray-100">
                      <button 
                        onClick={() => navigate(`/order/${client.id}`)}
                        className="flex-1 min-w-[70px] inline-flex items-center justify-center px-2 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                      <button 
                        onClick={() => editOrder(client.id)}
                        className="flex-1 min-w-[70px] inline-flex items-center justify-center px-2 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      {client.paymentStatus !== 'cleared' && (
                        <button 
                          onClick={() => clearOrderPayment(client.id)}
                          className="flex-1 min-w-[70px] inline-flex items-center justify-center px-2 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs sm:text-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Clear
                        </button>
                      )}
                      <button 
                        onClick={() => deleteOrder(client.id)}
                        className="flex-1 min-w-[70px] inline-flex items-center justify-center px-2 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs sm:text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientList; 
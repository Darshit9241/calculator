import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const OrderDetail = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      const data = await response.json();
      setOrderData(data);
      setError('');
    } catch (err) {
      setError('Error loading order details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-100 to-blue-50">
        <div className="relative px-10 py-12 bg-white rounded-3xl shadow-2xl transform transition-all">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-16 w-16 text-blue-600 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-1">Loading Order Details</h3>
            <p className="text-gray-500">Please wait while we fetch your information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-red-50 px-6 py-8 border-b border-red-100">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h2 className="text-center text-2xl font-extrabold text-gray-900">{error || 'Order not found'}</h2>
          </div>
          <div className="px-6 py-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/clients')}
                className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-300 transform hover:-translate-y-1"
              >
                <svg className="mr-2 -ml-1 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to List
              </button>
              <button
                onClick={fetchOrder}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-300 transform hover:-translate-y-1"
              >
                <svg className="mr-2 -ml-1 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="mb-8 bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 bg-gradient-to-r from-blue-600 to-indigo-700 sm:px-12">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-6 sm:mb-0">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Order #{orderData.id}</h1>
                <p className="text-blue-100">
                  <span className="inline-block">
                    <svg className="inline-block h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(orderData.timestamp).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </p>
              </div>
              <Link to="/clients" className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Orders
              </Link>
            </div>
          </div>
          
          {/* Customer & Payment Info */}
          <div className="px-6 py-8 sm:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer Info */}
              <div className="col-span-1 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer
                </h2>
                <div className="text-2xl font-bold text-gray-900 mb-2">{orderData.clientName || 'Unnamed Client'}</div>
              </div>
              
              {/* Order Summary */}
              <div className="col-span-1 lg:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Total Amount */}
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-sm font-medium text-blue-600 mb-1">Total Amount</div>
                    <div className="text-2xl font-bold text-gray-900">₹{orderData.grandTotal?.toFixed(2) || '0.00'}</div>
                  </div>
                  
                  {/* Amount Paid */}
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                    <div className="text-sm font-medium text-green-600 mb-1">Amount Paid</div>
                    <div className="text-2xl font-bold text-gray-900">₹{orderData.amountPaid?.toFixed(2) || '0.00'}</div>
                  </div>
                  
                  {/* Balance Due */}
                  <div className={`rounded-2xl p-6 border ${(orderData.grandTotal - (orderData.amountPaid || 0)) <= 0 ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                    <div className={`text-sm font-medium mb-1 ${(orderData.grandTotal - (orderData.amountPaid || 0)) <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                      Balance Due
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ₹{(orderData.grandTotal - (orderData.amountPaid || 0)).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {/* Payment Status */}
                <div className="mt-4 flex justify-end">
                  <span className={`inline-flex items-center px-6 py-2 rounded-full text-sm font-semibold ${orderData.paymentStatus === 'cleared' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    <span className={`h-2 w-2 rounded-full mr-2 ${orderData.paymentStatus === 'cleared' ? 'bg-green-600' : 'bg-amber-600'} animate-pulse`}></span>
                    {orderData.paymentStatus === 'cleared' ? 'Payment Cleared' : 'Payment Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Items Card */}
        <div className="mb-8 bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-6 sm:px-12 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="h-6 w-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Order Items
            </h2>
          </div>
          
          {/* Order Items - Mobile View */}
          <div className="px-6 py-6 sm:px-12 md:hidden">
            <div className="space-y-4">
              {orderData.products?.map((product, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 transition-colors duration-200 hover:bg-blue-50">
                  <div className="font-bold text-gray-900 mb-2">{product.name || 'Unnamed Product'}</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-gray-500">Quantity:</div>
                    <div className="font-medium text-gray-900">{product.count}</div>
                    
                    <div className="text-gray-500">Price:</div>
                    <div className="font-medium text-gray-900">₹{parseFloat(product.price).toFixed(2)}</div>
                    
                    <div className="text-gray-500">Total:</div>
                    <div className="font-bold text-blue-600">₹{product.total.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-100 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Grand Total:</span>
                <span className="font-bold text-blue-700 text-xl">₹{orderData.grandTotal?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </div>
          
          {/* Order Items - Desktop View */}
          <div className="hidden md:block px-6 py-6 sm:px-12">
            <div className="overflow-hidden border border-gray-200 rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderData.products?.map((product, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">{product.name || 'Unnamed Product'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">{product.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">₹{parseFloat(product.price).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 text-left">₹{product.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50">
                    <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900 text-left">Grand Total</td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-700 text-left">₹{orderData.grandTotal?.toFixed(2) || '0.00'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
          <button 
            onClick={() => window.print()} 
            className="px-6 py-4 bg-white text-gray-700 border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Order
          </button>
          <button 
            onClick={() => navigate(`/edit/${id}`)}
            className="px-6 py-4 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 
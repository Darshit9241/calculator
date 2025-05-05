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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-16 w-16 rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-6 text-indigo-800 font-medium text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center transition-all duration-300 border border-gray-100">
          <div className="text-red-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">{error || 'Order not found'}</h2>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/clients')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md transform transition duration-200 hover:-translate-y-1 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to List
            </button>
            <button 
              onClick={fetchOrder}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl shadow-md transform transition duration-200 hover:-translate-y-1 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-10 px-4 sm:px-6">
      <div className="w-full max-w-5xl mx-auto backdrop-blur-sm bg-white/90 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-5">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Order Details
          </h1>
          <Link to="/clients" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 text-sm sm:text-base font-medium shadow-lg flex items-center group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </Link>
        </div>

        {/* Client Info Section */}
        <div className="mb-10 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {orderData.clientName || 'Unnamed Client'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-xl shadow-md transform transition duration-200 hover:shadow-lg hover:scale-[1.02] group">
              <div className="text-sm text-indigo-500 mb-2 flex items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date
              </div>
              <div className="font-semibold text-base text-gray-800">{new Date(orderData.timestamp).toLocaleString()}</div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md transform transition duration-200 hover:shadow-lg hover:scale-[1.02] group">
              <div className="text-sm text-indigo-500 mb-2 flex items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Order ID
              </div>
              <div className="font-semibold text-base text-gray-800">{orderData.id}</div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md sm:col-span-2 lg:col-span-1 transform transition duration-200 hover:shadow-lg hover:scale-[1.02] group">
              <div className="text-sm text-indigo-500 mb-2 flex items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Total Amount
              </div>
              <div className="font-bold text-indigo-700 text-xl">${orderData.grandTotal?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
          
          {/* Payment Details */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-xl shadow-md transform transition duration-200 hover:shadow-lg hover:scale-[1.02] group">
              <div className="text-sm text-indigo-500 mb-2 flex items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Amount Paid
              </div>
              <div className="font-bold text-green-600 text-xl">${orderData.amountPaid?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md transform transition duration-200 hover:shadow-lg hover:scale-[1.02] group">
              <div className="text-sm text-indigo-500 mb-2 flex items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Balance
              </div>
              <div className={`font-bold text-xl ${(orderData.grandTotal - (orderData.amountPaid || 0)) <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                ${(orderData.grandTotal - (orderData.amountPaid || 0)).toFixed(2)}
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md transform transition duration-200 hover:shadow-lg hover:scale-[1.02] group">
              <div className="text-sm text-indigo-500 mb-2 flex items-center font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payment Status
              </div>
              <div className="mt-1">
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${orderData.paymentStatus === 'cleared' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {orderData.paymentStatus === 'cleared' ? 
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-600 mr-2 animate-pulse"></span>
                      Payment Cleared
                    </> : 
                    <>
                      <span className="h-2 w-2 rounded-full bg-amber-600 mr-2 animate-pulse"></span>
                      Payment Pending
                    </>
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <h2 className="text-2xl font-bold mb-6 text-indigo-900 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Order Items
        </h2>
        
        {/* Mobile view - Card layout */}
        <div className="block md:hidden mb-8">
          {orderData.products?.map((product, index) => (
            <div key={index} className="mb-4 border border-gray-100 rounded-xl bg-white p-5 shadow-md transform transition duration-200 hover:shadow-lg hover:scale-[1.01] group">
              <div className="font-bold text-gray-800 mb-3 text-lg">{product.name || 'Unnamed Product'}</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-indigo-500 text-left flex items-center font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Count:
                </div>
                <div className="text-left font-semibold text-gray-800">{product.count}</div>
                
                <div className="text-indigo-500 text-left flex items-center font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price:
                </div>
                <div className="text-left font-semibold text-gray-800">${parseFloat(product.price).toFixed(2)}</div>
                
                <div className="text-indigo-500 text-left flex items-center font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Total:
                </div>
                <div className="text-left font-bold text-indigo-700">${product.total.toFixed(2)}</div>
              </div>
            </div>
          ))}
          <div className="mt-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-5 flex justify-between items-center shadow-md">
            <span className="font-bold text-indigo-900 text-lg">Grand Total:</span>
            <span className="font-bold text-indigo-700 text-xl">${orderData.grandTotal?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
        
        {/* Desktop view - Table layout */}
        <div className="hidden md:block relative overflow-hidden rounded-xl shadow-lg mb-10">
          <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th scope="col" className="py-4 px-6 text-left font-semibold">Product</th>
                  <th scope="col" className="py-4 px-6 text-left font-semibold">Count</th>
                  <th scope="col" className="py-4 px-6 text-left font-semibold">Price</th>
                  <th scope="col" className="py-4 px-6 text-left font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orderData.products?.map((product, index) => (
                  <tr key={index} className="hover:bg-indigo-50 transition-colors duration-150">
                    <td className="py-4 px-6 whitespace-normal text-left font-medium text-gray-800">{product.name || 'Unnamed Product'}</td>
                    <td className="py-4 px-6 text-left text-gray-800">{product.count}</td>
                    <td className="py-4 px-6 text-left text-gray-800">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="py-4 px-6 text-left font-medium text-indigo-700">${product.total.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-gradient-to-r from-indigo-100 to-purple-100">
                  <td colSpan="3" className="py-4 px-6 text-left font-bold text-indigo-900 text-lg">Grand Total:</td>
                  <td className="py-4 px-6 text-left font-bold text-indigo-700 text-xl">${orderData.grandTotal?.toFixed(2) || '0.00'}</td>
                </tr>
                {/* Payment information rows for desktop view */}
                <tr className="bg-green-50">
                  <td colSpan="3" className="py-4 px-6 text-left font-semibold text-gray-800">Amount Paid:</td>
                  <td className="py-4 px-6 text-left font-bold text-green-600">${orderData.amountPaid?.toFixed(2) || '0.00'}</td>
                </tr>
                <tr className={`${(orderData.grandTotal - (orderData.amountPaid || 0)) <= 0 ? 'bg-green-50' : 'bg-amber-50'}`}>
                  <td colSpan="3" className="py-4 px-6 text-left font-semibold text-gray-800">Balance:</td>
                  <td className={`py-4 px-6 text-left font-bold ${(orderData.grandTotal - (orderData.amountPaid || 0)) <= 0 ? 'text-green-600' : 'text-amber-600'}`}>
                    ${(orderData.grandTotal - (orderData.amountPaid || 0)).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap justify-center sm:justify-end gap-5">
          <button 
            onClick={() => window.print()} 
            className="px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Order
          </button>
          <button 
            onClick={() => navigate(`/edit/${id}`)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
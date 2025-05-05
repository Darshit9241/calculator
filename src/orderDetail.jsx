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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center transition-all duration-300 transform hover:scale-[1.01]">
          <div className="text-red-500 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">{error || 'Order not found'}</h2>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/clients')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transform transition duration-200 hover:-translate-y-1 font-medium"
            >
              Back to List
            </button>
            <button 
              onClick={fetchOrder}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg shadow-md transform transition duration-200 hover:-translate-y-1 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:py-8 md:py-12 sm:px-6">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-5 sm:p-7 md:p-10 transition-all duration-300 transform hover:shadow-xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-16 after:h-1 after:bg-blue-600 after:rounded-full pb-2">
            Order Details
          </h1>
          <Link to="/clients" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm sm:text-base font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </Link>
        </div>

        {/* Client Info Section */}
        <div className="mb-8 p-5 sm:p-6 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {orderData.clientName || 'Unnamed Client'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm transform transition duration-200 hover:shadow-md hover:scale-[1.02]">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date
              </div>
              <div className="font-medium text-base">{new Date(orderData.timestamp).toLocaleString()}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm transform transition duration-200 hover:shadow-md hover:scale-[1.02]">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Order ID
              </div>
              <div className="font-medium text-base">{orderData.id}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm sm:col-span-2 lg:col-span-1 transform transition duration-200 hover:shadow-md hover:scale-[1.02]">
              <div className="text-sm text-gray-500 mb-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Total Amount
              </div>
              <div className="font-semibold text-blue-700 text-xl">${orderData.grandTotal?.toFixed(2) || '0.00'}</div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Order Items
        </h2>
        
        {/* Mobile view - Card layout */}
        <div className="block md:hidden mb-8">
          {orderData.products?.map((product, index) => (
            <div key={index} className={`mb-4 border rounded-xl ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} p-4 sm:p-5 shadow-sm transform transition duration-200 hover:shadow-md hover:scale-[1.01]`}>
              <div className="font-semibold text-gray-800 mb-3 text-lg">{product.name || 'Unnamed Product'}</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-gray-500 text-left flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Count:
                </div>
                <div className="text-left font-medium">{product.count}</div>
                
                <div className="text-gray-500 text-left flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price:
                </div>
                <div className="text-left font-medium">${parseFloat(product.price).toFixed(2)}</div>
                
                <div className="text-gray-500 text-left flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Total:
                </div>
                <div className="text-left font-medium text-blue-700">${product.total.toFixed(2)}</div>
              </div>
            </div>
          ))}
          <div className="mt-5 bg-blue-100 rounded-xl p-5 flex justify-between items-center shadow-sm transform transition duration-200 hover:shadow-md">
            <span className="font-semibold text-gray-800 text-lg">Grand Total:</span>
            <span className="font-bold text-blue-700 text-xl">${orderData.grandTotal?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
        
        {/* Desktop view - Table layout */}
        <div className="hidden md:block relative overflow-hidden border border-gray-200 rounded-xl shadow-sm mb-8 transform transition duration-200 hover:shadow-md">
          <div className="overflow-x-auto overflow-y-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="py-4 px-5 text-left border-b font-semibold text-gray-700">Product</th>
                  <th scope="col" className="py-4 px-5 text-left border-b font-semibold text-gray-700">Count</th>
                  <th scope="col" className="py-4 px-5 text-left border-b font-semibold text-gray-700">Price</th>
                  <th scope="col" className="py-4 px-5 text-left border-b font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderData.products?.map((product, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                    <td className="py-4 px-5 whitespace-normal text-left font-medium">{product.name || 'Unnamed Product'}</td>
                    <td className="py-4 px-5 text-left">{product.count}</td>
                    <td className="py-4 px-5 text-left">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="py-4 px-5 text-left font-medium text-blue-700">${product.total.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-blue-100">
                  <td colSpan="3" className="py-4 px-5 text-left font-semibold text-gray-800 text-lg">Grand Total:</td>
                  <td className="py-4 px-5 text-left font-bold text-blue-700 text-lg">${orderData.grandTotal?.toFixed(2) || '0.00'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center sm:justify-end gap-4">
          <button 
            onClick={() => window.print()} 
            className="px-5 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Order
          </button>
          <button 
            onClick={() => navigate(`/edit/${id}`)}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
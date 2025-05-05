import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderDetail = () => {
  const [orderData, setOrderData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Load saved clients from localStorage
    const savedOrders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
    if (savedOrders[id]) {
      setOrderData(savedOrders[id]);
    }
  }, [id]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Order not found</h2>
          <Link to="/clients" className="inline-block text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200">
            Back to Client List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-3 sm:py-6 md:py-10 sm:px-4 md:px-6">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 transition-all duration-300">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-3 md:gap-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Order Details
          </h1>
          <Link to="/clients" className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base shadow-sm whitespace-nowrap">
            Back to List
          </Link>
        </div>

        {/* Client Info Section */}
        <div className="mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">{orderData.clientName || 'Unnamed Client'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-xs sm:text-sm text-gray-500">Date</div>
              <div className="font-medium text-sm sm:text-base">{new Date(orderData.timestamp).toLocaleString()}</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-xs sm:text-sm text-gray-500">Client</div>
              <div className="font-medium text-sm sm:text-base">{orderData.clientName || 'Unnamed Client'}</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="text-xs sm:text-sm text-gray-500">Total Amount</div>
              <div className="font-medium text-blue-600 text-sm sm:text-base">${orderData.grandTotal.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Order Items</h2>
        
        {/* Mobile view - Card layout */}
        <div className="block md:hidden mb-6">
          {orderData.products.map((product, index) => (
            <div key={index} className={`mb-3 border rounded-lg ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} p-3 sm:p-4 shadow-sm`}>
              <div className="font-semibold text-gray-800 mb-2">{product.name || 'Unnamed Product'}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500 text-left">Count:</div>
                <div className="text-left font-medium">{product.count}</div>
                
                <div className="text-gray-500 text-left">Price:</div>
                <div className="text-left font-medium">{product.price.toFixed(2)}</div>
                
                <div className="text-gray-500 text-left">Total:</div>
                <div className="text-left font-medium">{product.total.toFixed(2)}</div>
              </div>
            </div>
          ))}
          <div className="mt-4 bg-blue-100 rounded-lg p-3 sm:p-4 flex justify-between items-center">
            <span className="font-semibold text-gray-800">Grand Total:</span>
            <span className="font-bold text-blue-700">{orderData.grandTotal.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Desktop view - Table layout */}
        <div className="hidden md:block relative overflow-hidden border border-gray-200 rounded-lg shadow mb-6">
          <div className="overflow-x-auto overflow-y-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th scope="col" className="py-3 px-4 text-left border-b font-semibold text-gray-700">Product</th>
                  <th scope="col" className="py-3 px-4 text-left border-b font-semibold text-gray-700">Count</th>
                  <th scope="col" className="py-3 px-4 text-left border-b font-semibold text-gray-700">Price</th>
                  <th scope="col" className="py-3 px-4 text-left border-b font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderData.products.map((product, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                    <td className="py-3 px-4 whitespace-normal text-left">{product.name || 'Unnamed Product'}</td>
                    <td className="py-3 px-4 text-left">{product.count}</td>
                    <td className="py-3 px-4 text-left">{product.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-left font-medium">${product.total.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-blue-100">
                  <td colSpan="3" className="py-3 px-4 text-left font-semibold text-gray-800">Grand Total:</td>
                  <td className="py-3 px-4 text-left font-bold text-blue-700">{orderData.grandTotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2 shadow-sm text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 
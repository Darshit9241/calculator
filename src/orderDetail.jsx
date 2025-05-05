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
      <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Order not found</h2>
          <Link to="/clients" className="text-blue-500 hover:underline">
            Back to Client List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-3 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Order Details: {orderData.clientName || 'Unnamed Client'}
          </h1>
          <Link to="/clients" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Back to List
          </Link>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <div className="mb-2"><strong>Date:</strong> {new Date(orderData.timestamp).toLocaleString()}</div>
          <div className="mb-2"><strong>Client:</strong> {orderData.clientName || 'Unnamed Client'}</div>
          <div><strong>Total:</strong> {orderData.grandTotal.toFixed(2)}</div>
        </div>

        <h2 className="text-lg font-semibold mb-3">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left border-b">Product</th>
                <th className="py-2 px-4 text-right border-b">Count</th>
                <th className="py-2 px-4 text-right border-b">Price</th>
                <th className="py-2 px-4 text-right border-b">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderData.products.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{product.name || 'Unnamed Product'}</td>
                  <td className="py-2 px-4 text-right">{product.count}</td>
                  <td className="py-2 px-4 text-right">{product.price.toFixed(2)}</td>
                  <td className="py-2 px-4 text-right font-medium">{product.total.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td colSpan="3" className="py-2 px-4 text-right font-semibold">Grand Total:</td>
                <td className="py-2 px-4 text-right font-bold">{orderData.grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => window.print()} 
            className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mx-2"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 
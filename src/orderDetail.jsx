import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const OrderDetail = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchOrder = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="relative px-4 sm:px-10 py-8 sm:py-12 bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Loading Invoice</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-red-50 px-4 sm:px-6 py-6 sm:py-8 border-b border-red-100">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="h-10 w-10 sm:h-12 sm:w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-900">{error || 'Invoice not found'}</h2>
          </div>
          <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/clients')}
                className="w-full flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="mr-2 -ml-1 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to List
              </button>
              <button
                onClick={fetchOrder}
                className="w-full flex justify-center items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="mr-2 -ml-1 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

  // Calculate payment status details
  const balanceDue = orderData.grandTotal - (orderData.amountPaid || 0);
  const isPaid = balanceDue <= 0 || orderData.paymentStatus === 'cleared';

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4 md:px-6 print:py-0 print:px-0">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden print:shadow-none">
        {/* Header with Company Info and Invoice Label */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gray-50 border-b print:hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <Link to="/clients" className="text-gray-500 hover:text-gray-700 flex items-center">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm sm:text-base">Back to Orders</span>
            </Link>
            <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
              <button 
                onClick={() => window.print()} 
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center text-sm"
              >
                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          {/* Company Logo and Invoice Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 md:mb-10 pb-4 sm:pb-6 border-b">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-600 text-white p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Company Name</h1>
                <p className="text-gray-500 text-xs sm:text-sm">123 Business Address, City, State, ZIP</p>
              </div>
            </div>
            <div className="text-right w-full md:w-auto mt-2 md:mt-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">INVOICE</h2>
              <p className="text-gray-500 mt-1">#{orderData.id}</p>
            </div>
          </div>

          {/* Bill To & Invoice Info */}
          <div className="flex flex-col md:flex-row justify-between mb-8 sm:mb-10 md:mb-12">
            <div className="mb-6 md:mb-0">
              <h3 className="text-gray-500 font-medium mb-2 text-xs sm:text-sm uppercase tracking-wider">Bill To</h3>
              <p className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{orderData.clientName || 'Client Name'}</p>
              <p className="text-sm sm:text-base text-gray-600">{orderData.clientAddress || 'Client Address'}</p>
              <p className="text-sm sm:text-base text-gray-600">{orderData.clientEmail || 'client@example.com'}</p>
            </div>
            <div className="md:text-right">
              <div className="grid grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-1 sm:gap-y-2 text-xs sm:text-sm">
                <div className="text-gray-500">Invoice Date:</div>
                <div className="text-gray-800 font-medium">{new Date(orderData.timestamp).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}</div>
                
                <div className="text-gray-500">Due Date:</div>
                <div className="text-gray-800 font-medium">{new Date(orderData.timestamp).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}</div>
                
                <div className="text-gray-500">Status:</div>
                <div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isPaid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="mb-8 sm:mb-10 md:mb-12 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Description</th>
                  <th scope="col" className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th scope="col" className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th scope="col" className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orderData.products?.map((product, index) => (
                  <tr key={index}>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{product.name || 'Product Item'}</td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-right">{product.count}</td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-right">₹{parseFloat(product.price).toFixed(2)}</td>
                    <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-medium text-right">₹{(parseFloat(product.price) * parseFloat(product.count)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 md:w-64">
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between py-1.5 sm:py-2">
                  <div className="text-xs sm:text-sm text-gray-500">Subtotal</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-900">₹{orderData.grandTotal?.toFixed(2) || '0.00'}</div>
                </div>
                <div className="flex justify-between py-1.5 sm:py-2 border-b">
                  <div className="text-xs sm:text-sm text-gray-500">Tax</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-900">₹0.00</div>
                </div>
                <div className="flex justify-between py-1.5 sm:py-2">
                  <div className="text-xs sm:text-sm font-bold text-gray-900">Total</div>
                  <div className="text-sm sm:text-lg font-bold text-gray-900">₹{orderData.grandTotal?.toFixed(2) || '0.00'}</div>
                </div>
                <div className="flex justify-between py-1.5 sm:py-2">
                  <div className="text-xs sm:text-sm text-gray-500">Amount Paid</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-900">₹{orderData.amountPaid?.toFixed(2) || '0.00'}</div>
                </div>
                <div className="flex justify-between py-1.5 sm:py-2 border-t border-gray-200">
                  <div className={`text-xs sm:text-sm font-bold ${isPaid ? 'text-green-600' : 'text-red-600'}`}>Balance Due</div>
                  <div className={`text-sm sm:text-lg font-bold ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Math.max(0, balanceDue).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Instructions & Notes */}
          <div className="mt-8 sm:mt-10 md:mt-12 pt-4 sm:pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-500 font-medium mb-2 text-xs sm:text-sm uppercase tracking-wider">Payment Instructions</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Please make payment via bank transfer to the following account:
                </p>
                <div className="mt-2 text-xs sm:text-sm">
                  <p><span className="font-medium text-gray-700">Bank Name:</span> Example Bank</p>
                  <p><span className="font-medium text-gray-700">Account Name:</span> Company Name</p>
                  <p><span className="font-medium text-gray-700">Account Number:</span> XXXX-XXXX-XXXX-XXXX</p>
                  <p><span className="font-medium text-gray-700">IFSC Code:</span> XXXX0000XXX</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <h3 className="text-gray-500 font-medium mb-2 text-xs sm:text-sm uppercase tracking-wider">Notes</h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Thank you for your business! If you have any questions about this invoice, please contact our customer support team at support@example.com.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200 text-center text-gray-500 text-xs sm:text-sm">
            <p>This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail; 
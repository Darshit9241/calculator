import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Calculator = () => {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState('');
  const [products, setProducts] = useState([
    { id: 1, name: '', count: '', price: '', total: 0 }
  ]);
  const [saveStatus, setSaveStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [amountPaid, setAmountPaid] = useState('');
  
  const handleChange = (id, field, value) => {
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };
        
        // Recalculate total when count or price changes
        if (field === 'count' || field === 'price') {
          const count = updatedProduct.count === '' ? 0 : parseFloat(updatedProduct.count);
          const price = updatedProduct.price === '' ? 0 : parseFloat(updatedProduct.price);
          updatedProduct.total = count * price;
        }
        
        return updatedProduct;
      }
      return product;
    });
    
    setProducts(updatedProducts);
  };
  
  const addProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { id: newId, name: '', count: '', price: '', total: 0 }]);
  };
  
  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };
  
  const saveOrder = async () => {
    // Create order data object
    const orderData = {
      clientName,
      products,
      grandTotal,
      paymentStatus,
      amountPaid: amountPaid === '' ? 0 : parseFloat(amountPaid),
      timestamp: new Date().getTime()
    };
    
    // Show loading status
    setSaveStatus('Saving order...');
    setIsLoading(true);
    
    try {
      // Save to API instead of localStorage
      const response = await fetch('https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save order');
      }
      
      // Show success message
      setSaveStatus('Order saved successfully!');
      
      // Clear status message after 1.5 seconds and navigate
      setTimeout(() => {
        setSaveStatus('');
        setIsLoading(false);
        // Navigate to the client list page
        // navigate('/clients');
      }, 1500);
    } catch (error) {
      setSaveStatus(`Error: ${error.message}`);
      setIsLoading(false);
      // Clear error after 3 seconds
      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    }
  };
  
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    
    // Redirect to login page
    navigate('/login');
  };
  
  const grandTotal = products.reduce((sum, product) => sum + product.total, 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4 sm:py-12 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Header with modern glass morphism design */}
        <div className="bg-gradient-to-r from-purple-700 to-blue-600 px-6 py-6 backdrop-blur-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Siyaram Lace</h1>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/clients')}
                className="flex items-center px-4 py-2.5 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all duration-300 text-sm sm:text-base backdrop-blur-md shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                View Clients
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2.5 bg-red-500/80 text-white rounded-xl hover:bg-red-500/100 transition-all duration-300 text-sm sm:text-base backdrop-blur-md shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm1 2v10h10V5H4zm4 5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M11 10a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8 md:p-10 backdrop-blur-lg bg-white/5 text-white">
          {/* Client name input with modern design */}
          <div className="mb-8">
            <label htmlFor="clientName" className="block text-white/90 font-medium mb-2 text-sm">Client Name</label>
            <input
              type="text"
              id="clientName"
              className="w-full p-3.5 border border-gray-300/20 bg-white/10 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-white placeholder-white/50"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
            />
          </div>
          
          {/* Payment status and amount section */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-xl shadow-lg border border-white/10">
              <label className="block text-white/90 font-medium mb-3 text-sm">Payment Status</label>
              <div className="flex gap-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="pending"
                    checked={paymentStatus === 'pending'}
                    onChange={() => setPaymentStatus('pending')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-500/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  <span className="ms-3 text-white">Pending</span>
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="cleared"
                    checked={paymentStatus === 'cleared'}
                    onChange={() => setPaymentStatus('cleared')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-500/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  <span className="ms-3 text-white">Cleared</span>
                </label>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-xl shadow-lg border border-white/10">
              <label htmlFor="amountPaid" className="block text-white/90 font-medium mb-3 text-sm">Amount Paid</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <span className="text-white/70">₹</span>
                </div>
                <input
                  type="number"
                  id="amountPaid"
                  className="w-full p-3.5 ps-8 border border-gray-300/20 bg-white/10 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-white placeholder-white/50"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          
          {/* Products section with glass morphism */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/10 mb-8 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-md border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Product Details</h2>
            </div>
            
            {/* Table header - Only visible on larger screens */}
            <div className="hidden md:grid md:grid-cols-12 md:gap-4 font-semibold text-white/90 border-b border-white/10 p-4">
              <div className="col-span-3">Product Name</div>
              <div className="col-span-2">Count</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-3">Total</div>
              <div className="col-span-2">Action</div>
            </div>
            
            <div className="divide-y divide-white/10">
              {products.map(product => (
                <div key={product.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center transition-all duration-200 hover:bg-white/5">
                  {/* Mobile layout */}
                  <div className="md:hidden mb-3">
                    <label className="block text-sm font-medium text-white/80 mb-1">Product Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300/20 bg-white/10 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-white placeholder-white/50"
                      value={product.name}
                      onChange={(e) => handleChange(product.id, 'name', e.target.value)}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="md:hidden mb-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">Count</label>
                      <input
                        type="number"
                        className="w-full p-3 border border-gray-300/20 bg-white/10 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-white placeholder-white/50"
                        value={product.count}
                        onChange={(e) => handleChange(product.id, 'count', e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">Price</label>
                      <input
                        type="number"
                        className="w-full p-3 border border-gray-300/20 bg-white/10 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-white placeholder-white/50"
                        value={product.price}
                        onChange={(e) => handleChange(product.id, 'price', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="md:hidden mb-3 flex justify-between items-center">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">Total</label>
                      <div className="p-3 bg-blue-500/20 text-blue-300 rounded-xl font-medium border border-blue-500/30 backdrop-blur-md">
                        ₹ {product.total.toFixed(2)}
                      </div>
                    </div>
                    <button
                      className="flex items-center p-2.5 bg-red-500/80 text-white rounded-xl hover:bg-red-600/80 transition-all duration-300 backdrop-blur-md"
                      onClick={() => removeProduct(product.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remove
                    </button>
                  </div>
                  
                  {/* Desktop layout */}
                  <div className="hidden md:block md:col-span-3">
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300/20 bg-white/10 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-white placeholder-white/50"
                      value={product.name}
                      onChange={(e) => handleChange(product.id, 'name', e.target.value)}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="hidden md:block md:col-span-2">
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300/20 bg-white/10 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-white placeholder-white/50"
                      value={product.count}
                      onChange={(e) => handleChange(product.id, 'count', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="hidden md:block md:col-span-2">
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300/20 bg-white/10 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-white placeholder-white/50"
                      value={product.price}
                      onChange={(e) => handleChange(product.id, 'price', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="hidden md:block md:col-span-3 font-medium">
                    <div className="p-3 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30 backdrop-blur-md">
                      ₹ {product.total.toFixed(2)}
                    </div>
                  </div>
                  <div className="hidden md:block md:col-span-2">
                    <button
                      className="flex items-center p-2.5 bg-red-500/80 text-white rounded-xl hover:bg-red-600/80 transition-all duration-300 backdrop-blur-md"
                      onClick={() => removeProduct(product.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions and total section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex items-center justify-center p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg"
                onClick={addProduct}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Product
              </button>
              
              <button
                className={`flex items-center justify-center p-3.5 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'} text-white rounded-xl transition-all duration-300 shadow-lg`}
                onClick={saveOrder}
                disabled={products.every(p => p.total === 0) || isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save Order
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 p-6 rounded-xl border border-white/10 shadow-lg backdrop-blur-md">
              <div className="text-xl md:text-2xl font-bold text-white text-center md:text-right">
                {clientName ? `${clientName}'s Total: ` : 'Grand Total: '}
                <span className="text-purple-300">₹ {grandTotal.toFixed(2)}</span>
              </div>
              {amountPaid && (
                <div className="text-base text-white/80 text-center md:text-right mt-3">
                  <span>Amount Paid: </span>
                  <span className="font-medium text-green-400">₹ {parseFloat(amountPaid).toFixed(2)}</span>
                  <span className="mx-2">|</span>
                  <span>Balance: </span>
                  <span className={`font-medium ${(grandTotal - parseFloat(amountPaid || 0)) <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹ {(grandTotal - parseFloat(amountPaid || 0)).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="text-sm font-medium mt-3 text-center md:text-right">
                <span className={`px-3 py-1.5 rounded-full ${paymentStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'} backdrop-blur-sm`}>
                  {paymentStatus === 'pending' ? 'Payment Pending' : 'Payment Cleared'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status message with animation */}
          {saveStatus && (
            <div className={`mt-6 p-4 ${saveStatus.includes('Error') ? 'bg-red-900/30 text-red-300 border-red-500/30' : 'bg-green-900/30 text-green-300 border-green-500/30'} rounded-xl text-center animate-fade-in border backdrop-blur-md`}>
              {saveStatus.includes('Error') ? (
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {saveStatus}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {saveStatus}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
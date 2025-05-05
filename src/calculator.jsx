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
        navigate('/clients');
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
  
  const grandTotal = products.reduce((sum, product) => sum + product.total, 0);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-6 px-4 sm:py-10 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Header with improved design */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-5 sm:px-6 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Product Calculator</h1>
          <button
            onClick={() => navigate('/clients')}
            className="flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            View Client List
          </button>
        </div>
        
        <div className="p-4 sm:p-6 md:p-8">
          {/* Client name input with improved design */}
          <div className="mb-6">
            <label htmlFor="clientName" className="block text-gray-700 font-medium mb-2 text-sm">Client Name</label>
            <input
              type="text"
              id="clientName"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
            />
          </div>
          
          {/* Card for products section with subtle shadow */}
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm mb-6">
            {/* Table header - Only visible on larger screens */}
            <div className="hidden md:grid md:grid-cols-12 md:gap-4 font-semibold text-gray-700 border-b p-4">
              <div className="col-span-3">Product Name</div>
              <div className="col-span-2">Count</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-3">Total</div>
              <div className="col-span-2">Action</div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {products.map(product => (
                <div key={product.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center transition-all duration-200 hover:bg-gray-50">
                  {/* Mobile layout - stacked fields with labels */}
                  <div className="md:hidden mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={product.name}
                      onChange={(e) => handleChange(product.id, 'name', e.target.value)}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="md:hidden mb-3 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Count</label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        value={product.count}
                        onChange={(e) => handleChange(product.id, 'count', e.target.value)}
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        value={product.price}
                        onChange={(e) => handleChange(product.id, 'price', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="md:hidden mb-3 flex justify-between items-center">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                      <div className="p-2 bg-blue-50 text-blue-800 rounded-lg font-medium border border-blue-100">
                        ${product.total.toFixed(2)}
                      </div>
                    </div>
                    <button
                      className="flex items-center p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                      onClick={() => removeProduct(product.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Remove
                    </button>
                  </div>
                  
                  {/* Desktop layout - grid layout */}
                  <div className="hidden md:block md:col-span-3">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={product.name}
                      onChange={(e) => handleChange(product.id, 'name', e.target.value)}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="hidden md:block md:col-span-2">
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={product.count}
                      onChange={(e) => handleChange(product.id, 'count', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="hidden md:block md:col-span-2">
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      value={product.price}
                      onChange={(e) => handleChange(product.id, 'price', e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="hidden md:block md:col-span-3 font-medium">
                    <div className="p-2 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                      ${product.total.toFixed(2)}
                    </div>
                  </div>
                  <div className="hidden md:block md:col-span-2">
                    <button
                      className="flex items-center p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
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
          <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm"
                onClick={addProduct}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Product
              </button>
              
              <button
                className={`flex items-center justify-center p-3 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition-all duration-300 shadow-sm`}
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
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
              <div className="text-lg md:text-xl font-bold text-gray-800 text-center md:text-right">
                {clientName ? `${clientName}'s Total: ` : 'Grand Total: '}
                <span className="text-blue-700">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Status message with animation */}
          {saveStatus && (
            <div className={`mt-6 p-3 ${saveStatus.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} rounded-lg text-center animate-fade-in border ${saveStatus.includes('Error') ? 'border-red-200' : 'border-green-200'}`}>
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
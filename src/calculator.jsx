import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Calculator = () => {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState('');
  const [products, setProducts] = useState([
    { id: 1, name: '', count: 0, price: 0, total: 0 }
  ]);
  const [saveStatus, setSaveStatus] = useState(''); // For showing save status message
  
  const handleChange = (id, field, value) => {
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };
        
        // Recalculate total when count or price changes
        if (field === 'count' || field === 'price') {
          updatedProduct.total = updatedProduct.count * updatedProduct.price;
        }
        
        return updatedProduct;
      }
      return product;
    });
    
    setProducts(updatedProducts);
  };
  
  const addProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { id: newId, name: '', count: 0, price: 0, total: 0 }]);
  };
  
  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };
  
  const saveOrder = () => {
    // Create order data object
    const orderData = {
      clientName,
      products,
      grandTotal,
      timestamp: new Date().getTime()
    };
    
    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
    
    // Add new order
    const updatedOrders = [...existingOrders, orderData];
    
    // Save back to localStorage
    localStorage.setItem('clientOrders', JSON.stringify(updatedOrders));
    
    // Show success message
    setSaveStatus('Order saved successfully!');
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      setSaveStatus('');
      // Navigate to the client list page
      navigate('/clients');
    }, 1500);
  };
  
  const grandTotal = products.reduce((sum, product) => sum + product.total, 0);
  
  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-3 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Product Calculator</h1>
          <button
            onClick={() => navigate('/clients')}
            className="text-blue-600 hover:text-blue-800"
          >
            View Client List
          </button>
        </div>
        
        <div className="mb-4 sm:mb-6">
          <label htmlFor="clientName" className="block text-gray-700 font-medium mb-1 sm:mb-2">Client Name</label>
          <input
            type="text"
            id="clientName"
            className="w-full p-2 sm:p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter client name"
          />
        </div>
        
        {/* Table header - Only visible on larger screens */}
        <div className="hidden sm:grid sm:grid-cols-12 sm:gap-4 font-semibold text-gray-700 border-b pb-2 mb-2">
          <div className="col-span-3">Product Name</div>
          <div className="col-span-2">Count</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-3">Total</div>
          <div className="col-span-2">Action</div>
        </div>
        
        {products.map(product => (
          <div key={product.id} className="mb-4 sm:mb-3 border-b pb-2 sm:border-0 sm:pb-0 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-center">
            {/* Mobile layout - stacked fields with labels */}
            <div className="sm:hidden mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={product.name}
                onChange={(e) => handleChange(product.id, 'name', e.target.value)}
                placeholder="Product name"
              />
            </div>
            <div className="sm:hidden mb-2 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Count</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={product.count}
                  onChange={(e) => handleChange(product.id, 'count', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={product.price}
                  onChange={(e) => handleChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="sm:hidden mb-2 flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <div className="p-2 bg-gray-100 rounded-md font-medium">
                  {product.total.toFixed(2)}
                </div>
              </div>
              <button
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => removeProduct(product.id)}
              >
                Remove
              </button>
            </div>
            
            {/* Desktop layout - grid layout */}
            <div className="hidden sm:block sm:col-span-3">
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={product.name}
                onChange={(e) => handleChange(product.id, 'name', e.target.value)}
                placeholder="Product name"
              />
            </div>
            <div className="hidden sm:block sm:col-span-2">
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={product.count}
                onChange={(e) => handleChange(product.id, 'count', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div className="hidden sm:block sm:col-span-2">
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={product.price}
                onChange={(e) => handleChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="hidden sm:block sm:col-span-3 font-medium">
              <div className="p-2 bg-gray-100 rounded-md">
                {product.total.toFixed(2)}
              </div>
            </div>
            <div className="hidden sm:block sm:col-span-2">
              <button
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => removeProduct(product.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="w-full sm:w-auto p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={addProduct}
            >
              Add Product
            </button>
            
            <button
              className="w-full sm:w-auto p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={saveOrder}
              disabled={products.every(p => p.total === 0)}
            >
              Save Order
            </button>
          </div>
          
          <div className="text-lg sm:text-xl font-bold text-gray-800 text-center sm:text-right">
            {clientName ? `${clientName}'s Total: ` : 'Grand Total: '}{grandTotal.toFixed(2)}
          </div>
        </div>
        
        {saveStatus && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-md text-center">
            {saveStatus}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calculator;
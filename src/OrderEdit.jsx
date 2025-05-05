import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [clientName, setClientName] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  
  useEffect(() => {
    fetchOrder();
  }, [id]);
  
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      
      const data = await response.json();
      setClientName(data.clientName || '');
      setProducts(data.products || []);
      setError('');
    } catch (err) {
      setError('Error loading order. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (id, field, value) => {
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };
        
        // Recalculate total when count or price changes
        if (field === 'count' || field === 'price') {
          // Convert empty strings to 0 for calculation
          const count = updatedProduct.count === '' ? 0 : updatedProduct.count;
          const price = updatedProduct.price === '' ? 0 : updatedProduct.price;
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
    setSaveStatus('Updating order...');
    
    try {
      // Update order using API
      const response = await fetch(`https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order');
      }
      
      // Show success message
      setSaveStatus('Order updated successfully!');
      
      // Clear status message after 1.5 seconds and navigate
      setTimeout(() => {
        setSaveStatus('');
        // Navigate to the client list page
        navigate('/clients');
      }, 1500);
    } catch (error) {
      setSaveStatus(`Error: ${error.message}`);
      // Clear error after 3 seconds
      setTimeout(() => {
        setSaveStatus('');
      }, 3000);
    }
  };
  
  const grandTotal = products.reduce((sum, product) => sum + product.total, 0);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Error</h2>
          <p className="text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/clients')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
            >
              Back to List
            </button>
            <button 
              onClick={fetchOrder}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-3 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Order</h1>
          <button
            onClick={() => navigate('/clients')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to List
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
              Update Order
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

export default OrderEdit; 
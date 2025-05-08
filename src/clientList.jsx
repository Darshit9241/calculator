import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './components/ThemeToggle';
import { useTheme } from './context/ThemeContext';

// Custom CSS for animations
const customStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
`;

const ClientList = () => {
  const { isDarkMode } = useTheme();
  const [savedClients, setSavedClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const [editFormData, setEditFormData] = useState({
    clientName: '',
    amountPaid: 0,
    paymentStatus: 'pending',
    products: []
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: 0,
    count: 1
  });
  const [activeTab, setActiveTab] = useState('general');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch clients from API when component mounts
    fetchClients();
    
    // Add window resize listener for responsive behavior
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Apply filters when savedClients or activeFilter changes
    applyFilters();
  }, [savedClients, activeFilter, searchQuery]);

  const applyFilters = () => {
    let filtered = savedClients;
    
    // First filter by payment status
    if (activeFilter === 'pending') {
      filtered = filtered.filter(client => client.paymentStatus !== 'cleared');
    } else if (activeFilter === 'cleared') {
      filtered = filtered.filter(client => client.paymentStatus === 'cleared');
    }
    
    // Then apply search query if it exists
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(client => 
        (client.id && client.id.toLowerCase().includes(query)) || 
        (client.clientName && client.clientName.toLowerCase().includes(query))
      );
    }
    
    setFilteredClients(filtered);
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      // Sort data by timestamp in descending order (newest first)
      const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setSavedClients(sortedData);
      setError('');
    } catch (err) {
      setError('Error loading client orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString(undefined, 
      isSmallScreen ? { dateStyle: 'short', timeStyle: 'short' } : { dateStyle: 'medium', timeStyle: 'short' }
    );
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete order');
      }
      
      // Update the UI by removing the deleted order
      setSavedClients(savedClients.filter(client => client.id !== id));
    } catch (err) {
      setError('Failed to delete order. Please try again.');
      console.error(err);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };
  
  const clearOrderPayment = async (id) => {
    if (!window.confirm('Mark this order payment as cleared?')) {
      return;
    }
    
    try {
      // Find the client to update
      const clientToUpdate = savedClients.find(client => client.id === id);
      if (!clientToUpdate) return;
      
      // Update the payment status to cleared
      const updatedClient = {
        ...clientToUpdate,
        paymentStatus: 'cleared',
        amountPaid: clientToUpdate.grandTotal // Set amount paid to the grand total
      };
      
      const response = await fetch(`https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order payment status');
      }
      
      // Update the UI with the updated order
      setSavedClients(savedClients.map(client => 
        client.id === id ? updatedClient : client
      ));
    } catch (err) {
      setError('Failed to clear order payment. Please try again.');
      console.error(err);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };
  
  const deleteAllOrders = async () => {
    if (!window.confirm('Are you sure you want to delete ALL orders? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    let hasError = false;
    
    try {
      // Delete each order one by one
      const deletePromises = savedClients.map(async (client) => {
        try {
          const response = await fetch(`https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram/${client.id}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            throw new Error(`Failed to delete order ${client.id}`);
          }
          return true;
        } catch (err) {
          console.error(`Error deleting order ${client.id}:`, err);
          hasError = true;
          return false;
        }
      });
      
      await Promise.all(deletePromises);
      
      if (hasError) {
        setError('Some orders could not be deleted. Please refresh and try again.');
      } else {
        // Clear the clients list
        setSavedClients([]);
        setFilteredClients([]);
      }
    } catch (err) {
      setError('Failed to delete all orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      // Clear error after 3 seconds if there was one
      if (hasError) {
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const editClient = (client) => {
    setEditingClient(client);
    setEditFormData({
      clientName: client.clientName || '',
      amountPaid: client.amountPaid || 0,
      paymentStatus: client.paymentStatus || 'pending',
      products: client.products ? [...client.products] : []
    });
    setActiveTab('general');
  };

  const closeEditForm = () => {
    setEditingClient(null);
    setEditFormData({
      clientName: '',
      amountPaid: 0,
      paymentStatus: 'pending',
      products: []
    });
    setEditingProduct(null);
    setProductFormData({
      name: '',
      price: 0,
      count: 1
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    // For numeric fields, convert to number
    if (name === 'amountPaid') {
      setEditFormData({ 
        ...editFormData, 
        [name]: parseFloat(value) || 0,
        // If amount paid equals grand total, automatically set payment status to cleared
        paymentStatus: parseFloat(value) >= (editingClient?.grandTotal || 0) ? 'cleared' : 'pending'
      });
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  // Product-related functions
  const editProduct = (product, index) => {
    setEditingProduct({ ...product, index });
    setProductFormData({
      name: product.name || '',
      price: product.price || 0,
      count: product.count || 1
    });
  };

  const cancelProductEdit = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      price: 0,
      count: 1
    });
  };

  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price' || name === 'count') {
      setProductFormData({
        ...productFormData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setProductFormData({
        ...productFormData,
        [name]: value
      });
    }
  };

  const saveProductChanges = () => {
    if (!editingProduct) return;
    
    const updatedProducts = [...editFormData.products];
    updatedProducts[editingProduct.index] = {
      ...editingProduct,
      name: productFormData.name,
      price: productFormData.price,
      count: productFormData.count
    };
    
    // Recalculate the grand total
    const grandTotal = updatedProducts.reduce((total, product) => 
      total + (parseFloat(product.price) || 0) * (parseFloat(product.count) || 0), 0);
    
    setEditFormData({
      ...editFormData,
      products: updatedProducts,
      grandTotal: grandTotal
    });
    
    // Reset product form
    cancelProductEdit();
  };

  const deleteProduct = (index) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    const updatedProducts = [...editFormData.products];
    updatedProducts.splice(index, 1);
    
    // Recalculate the grand total
    const grandTotal = updatedProducts.reduce((total, product) => 
      total + (parseFloat(product.price) || 0) * (parseFloat(product.count) || 0), 0);
    
    setEditFormData({
      ...editFormData,
      products: updatedProducts,
      grandTotal: grandTotal
    });
  };

  const addNewProduct = () => {
    setEditingProduct({ name: '', price: 0, count: 1, index: editFormData.products.length });
    setProductFormData({
      name: '',
      price: 0,
      count: 1
    });
  };

  const saveClientChanges = async (e) => {
    e.preventDefault();
    
    if (!editingClient) return;
    
    try {
      // Recalculate the grand total
      const grandTotal = editFormData.products.reduce((total, product) => 
        total + (parseFloat(product.price) || 0) * (parseFloat(product.count) || 0), 0);
      
      // Prepare updated client data
      const updatedClient = {
        ...editingClient,
        clientName: editFormData.clientName,
        amountPaid: editFormData.amountPaid,
        paymentStatus: editFormData.paymentStatus,
        products: editFormData.products,
        grandTotal: grandTotal
      };
      
      const response = await fetch(`https://68187c2b5a4b07b9d1cf4f40.mockapi.io/siyaram/${editingClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedClient),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update client details');
      }
      
      // Update the UI with the updated client
      setSavedClients(savedClients.map(client => 
        client.id === editingClient.id ? updatedClient : client
      ));
      
      // Close the edit form
      closeEditForm();
    } catch (err) {
      setError('Failed to update client details. Please try again.');
      console.error(err);
      
      // Clear error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'} py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200`}>
      {/* Inject custom styles */}
      <style>{customStyles}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`backdrop-blur-md ${isDarkMode ? 'bg-white/10' : 'bg-white/80'} rounded-xl shadow-2xl p-6 mb-8 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <h1 className={`text-xl sm:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Siyaram Lace
              </h1>
              <div className="flex items-center gap-2 pl-5">
                {isSmallScreen && (
                  <button
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
                <ThemeToggle />
              </div>
            </div>
            <div className="flex gap-3">
              {savedClients.length > 0 && (
                <button 
                  onClick={deleteAllOrders}
                  className="flex items-center justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-200 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete All
                </button>
              )}
              <Link 
                to="/" 
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Order
              </Link>
            </div>
          </div>
          
          {/* Mobile Info Dropdown */}
          {isSmallScreen && isInfoOpen && (
            <div className="mb-6 animate-fadeIn">
              {/* Stats Dropdown Button */}
              <button
                onClick={() => setIsStatsOpen(!isStatsOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-t-lg ${isStatsOpen ? `${isDarkMode ? 'bg-emerald-500/80' : 'bg-emerald-500'} text-white` : `${isDarkMode ? 'bg-white/5' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`} ${!isStatsOpen ? 'rounded-b-lg' : ''} border ${isStatsOpen ? (isDarkMode ? 'border-emerald-600' : 'border-emerald-600') : (isDarkMode ? 'border-white/10' : 'border-gray-200')} mb-3 transition-all duration-200 shadow-sm`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <span className="font-medium">Statistics Overview</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform duration-200 ${isStatsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Stats Content */}
              {isStatsOpen && (
                <div className={`backdrop-blur-md ${isDarkMode ? 'bg-white/5' : 'bg-white/95'} rounded-b-lg shadow-lg p-4 mb-4 border ${isDarkMode ? 'border-emerald-600/40' : 'border-emerald-100'} border-t-0 animate-fadeIn`}>
                  <div className="space-y-3">
                    <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-md rounded-lg p-3 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm flex items-center`}>
                      <div className="bg-blue-500/10 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] sm:text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Total Orders</p>
                        <p className={`text-lg sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-0.5 sm:mt-1`}>{savedClients.length}</p>
                        <div className={`h-0.5 sm:h-1 w-10 sm:w-12 ${isDarkMode ? 'bg-white/20' : 'bg-gray-200'} rounded mt-1.5 sm:mt-2 mb-0.5 sm:mb-1`}></div>
                        <p className={`text-[9px] sm:text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>All time</p>
                      </div>
                    </div>
                    
                    <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-md rounded-lg p-3 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm flex items-center`}>
                      <div className="bg-indigo-500/10 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] sm:text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Total Amount</p>
                        <p className={`text-lg sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-0.5 sm:mt-1 truncate`}>₹{savedClients.reduce((total, client) => total + (client.grandTotal || 0), 0).toFixed(2)}</p>
                        <div className={`h-0.5 sm:h-1 w-10 sm:w-12 ${isDarkMode ? 'bg-white/20' : 'bg-gray-200'} rounded mt-1.5 sm:mt-2 mb-0.5 sm:mb-1`}></div>
                        <p className={`text-[9px] sm:text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Order value</p>
                      </div>
                    </div>
                    
                    <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-md rounded-lg p-3 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm flex items-center`}>
                      <div className="bg-emerald-500/10 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] sm:text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Received</p>
                        <p className="text-lg sm:text-2xl font-bold text-emerald-500 mt-0.5 sm:mt-1 truncate">₹{savedClients.reduce((total, client) => total + (client.amountPaid || 0), 0).toFixed(2)}</p>
                        <div className="h-0.5 sm:h-1 w-10 sm:w-12 bg-emerald-500/20 rounded mt-1.5 sm:mt-2 mb-0.5 sm:mb-1"></div>
                        <p className={`text-[9px] sm:text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Payments</p>
                      </div>
                    </div>
                    
                    <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-md rounded-lg p-3 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm flex items-center`}>
                      <div className="bg-amber-500/10 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className={`text-[11px] sm:text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Pending</p>
                        <p className="text-lg sm:text-2xl font-bold text-amber-500 mt-0.5 sm:mt-1 truncate">₹{savedClients.reduce((total, client) => {
                          const pendingAmount = (client.grandTotal || 0) - (client.amountPaid || 0);
                          return total + (pendingAmount > 0 ? pendingAmount : 0);
                        }, 0).toFixed(2)}</p>
                        <div className="h-0.5 sm:h-1 w-10 sm:w-12 bg-amber-500/20 rounded mt-1.5 sm:mt-2 mb-0.5 sm:mb-1"></div>
                        <p className={`text-[9px] sm:text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>To collect</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters Dropdown Button */}
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-t-lg ${isFiltersOpen ? `${isDarkMode ? 'bg-amber-500/80' : 'bg-amber-500'} text-white` : `${isDarkMode ? 'bg-white/5' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`} ${!isFiltersOpen ? 'rounded-b-lg' : ''} border ${isFiltersOpen ? (isDarkMode ? 'border-amber-600' : 'border-amber-600') : (isDarkMode ? 'border-white/10' : 'border-gray-200')} mb-3 transition-all duration-200 shadow-sm`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">
                    {activeFilter === 'all' ? 'All Orders' : activeFilter === 'pending' ? 'Pending Orders' : 'Cleared Orders'}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transform transition-transform duration-200 ${isFiltersOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Filters Content */}
              {isFiltersOpen && (
                <div className={`backdrop-blur-md ${isDarkMode ? 'bg-white/5' : 'bg-white/95'} rounded-b-lg shadow-lg p-4 mb-4 border ${isDarkMode ? 'border-amber-600/40' : 'border-amber-100'} border-t-0 animate-fadeIn`}>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setActiveFilter('all');
                        setIsInfoOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                        activeFilter === 'all'
                          ? `${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600'} text-white shadow-md shadow-emerald-500/20`
                          : `${isDarkMode ? 'bg-white/5' : 'bg-white'} ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:${isDarkMode ? 'bg-white/10' : 'bg-gray-50'}`
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${activeFilter === 'all' ? 'bg-white' : 'bg-emerald-500'} mr-2`}></div>
                        <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>All Orders</span>
                      </div>
                      <span className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-600'} bg-black/10 px-2 py-0.5 rounded-full`}>{savedClients.length}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter('pending');
                        setIsInfoOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                        activeFilter === 'pending'
                          ? `${isDarkMode ? 'bg-amber-500' : 'bg-amber-600'} text-white shadow-md shadow-amber-500/20`
                          : `${isDarkMode ? 'bg-white/5' : 'bg-white'} ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:${isDarkMode ? 'bg-white/10' : 'bg-gray-50'}`
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${activeFilter === 'pending' ? 'bg-white' : 'bg-amber-500'} mr-2`}></div>
                        <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pending</span>
                      </div>
                      <span className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-600'} bg-black/10 px-2 py-0.5 rounded-full`}>{savedClients.filter(client => client.paymentStatus !== 'cleared').length}</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter('cleared');
                        setIsInfoOpen(false);
                      }}
                      className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                        activeFilter === 'cleared'
                          ? `${isDarkMode ? 'bg-sky-500' : 'bg-sky-600'} text-white shadow-md shadow-sky-500/20`
                          : `${isDarkMode ? 'bg-white/5' : 'bg-white'} ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:${isDarkMode ? 'bg-white/10' : 'bg-gray-50'}`
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${activeFilter === 'cleared' ? 'bg-white' : 'bg-sky-500'} mr-2`}></div>
                        <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cleared</span>
                      </div>
                      <span className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-gray-600'} bg-black/10 px-2 py-0.5 rounded-full`}>{savedClients.filter(client => client.paymentStatus === 'cleared').length}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Desktop Stats and Filters */}
          {!isSmallScreen && (
            <>
              {/* Summary stats */}
              <div className={`backdrop-blur-md ${isDarkMode ? 'bg-white/5' : 'bg-white/80'} rounded-xl shadow-lg p-3 sm:p-5 mb-4 sm:mb-8 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-md rounded-lg p-2.5 sm:p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm`}>
                    <p className={`text-[11px] sm:text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Total Orders</p>
                    <p className={`text-lg sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-0.5 sm:mt-1`}>{savedClients.length}</p>
                    <div className={`h-0.5 sm:h-1 w-10 sm:w-12 ${isDarkMode ? 'bg-white/20' : 'bg-gray-200'} rounded mt-1.5 sm:mt-2 mb-0.5 sm:mb-1`}></div>
                    <p className={`text-[9px] sm:text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>All time</p>
                  </div>
                  
                  <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-md rounded-lg p-2.5 sm:p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm`}>
                    <p className={`text-[11px] sm:text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Total Amount</p>
                    <p className={`text-lg sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-0.5 sm:mt-1 truncate`}>₹{savedClients.reduce((total, client) => total + (client.grandTotal || 0), 0).toFixed(2)}</p>
                    <div className={`h-0.5 sm:h-1 w-10 sm:w-12 ${isDarkMode ? 'bg-white/20' : 'bg-gray-200'} rounded mt-1.5 sm:mt-2 mb-0.5 sm:mb-1`}></div>
                    <p className={`text-[9px] sm:text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Order value</p>
                  </div>
                  
                  <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-md rounded-lg p-2.5 sm:p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm`}>
                    <p className={`text-[11px] sm:text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Received</p>
                    <p className="text-lg sm:text-2xl font-bold text-emerald-500 mt-0.5 sm:mt-1 truncate">₹{savedClients.reduce((total, client) => total + (client.amountPaid || 0), 0).toFixed(2)}</p>
                    <div className="h-0.5 sm:h-1 w-10 sm:w-12 bg-emerald-500/20 rounded mt-1.5 sm:mt-2 mb-0.5 sm:mb-1"></div>
                    <p className={`text-[9px] sm:text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Payments</p>
                  </div>
                  
                  <div className={`${isDarkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-md rounded-lg p-2.5 sm:p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} shadow-sm`}>
                    <p className={`text-[11px] sm:text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Pending</p>
                    <p className="text-lg sm:text-2xl font-bold text-amber-500 mt-0.5 sm:mt-1 truncate">₹{savedClients.reduce((total, client) => {
                      const pendingAmount = (client.grandTotal || 0) - (client.amountPaid || 0);
                      return total + (pendingAmount > 0 ? pendingAmount : 0);
                    }, 0).toFixed(2)}</p>
                    <div className="h-0.5 sm:h-1 w-10 sm:w-12 bg-amber-500/20 rounded mt-1.5 sm:mt-2 mb-0.5 sm:mb-1"></div>
                    <p className={`text-[9px] sm:text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>To collect</p>
                  </div>
                </div>
              </div>

              {/* Filter options */}
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center ${
                      activeFilter === 'all'
                        ? `${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600'} text-white shadow-md shadow-emerald-500/20`
                        : `${isDarkMode ? 'bg-white/5' : 'bg-white'} ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:${isDarkMode ? 'bg-white/10' : 'bg-gray-50'}`
                    }`}
                  >
                    <span className={`text-xs opacity-80 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>All Orders</span>
                    <span className={`text-lg mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{savedClients.length}</span>
                  </button>
                  <button
                    onClick={() => setActiveFilter('pending')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center ${
                      activeFilter === 'pending'
                        ? `${isDarkMode ? 'bg-amber-500' : 'bg-amber-600'} text-white shadow-md shadow-amber-500/20`
                        : `${isDarkMode ? 'bg-white/5' : 'bg-white'} ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:${isDarkMode ? 'bg-white/10' : 'bg-gray-50'}`
                    }`}
                  >
                    <span className={`text-xs opacity-80 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Pending</span>
                    <span className={`text-lg mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{savedClients.filter(client => client.paymentStatus !== 'cleared').length}</span>
                  </button>
                  <button
                    onClick={() => setActiveFilter('cleared')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center ${
                      activeFilter === 'cleared'
                        ? `${isDarkMode ? 'bg-sky-500' : 'bg-sky-600'} text-white shadow-md shadow-sky-500/20`
                        : `${isDarkMode ? 'bg-white/5' : 'bg-white'} ${isDarkMode ? 'text-slate-300' : 'text-gray-700'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} hover:${isDarkMode ? 'bg-white/10' : 'bg-gray-50'}`
                    }`}
                  >
                    <span className={`text-xs opacity-80 ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>Cleared</span>
                    <span className={`text-lg mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{savedClients.filter(client => client.paymentStatus === 'cleared').length}</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Search bar with improved design */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-3 ${isDarkMode ? 'bg-white/5' : 'bg-white'} border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} rounded-lg ${isDarkMode ? 'text-white placeholder-slate-400' : 'text-gray-900 placeholder-gray-400'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-sm`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 text-red-100 p-4 mb-6 rounded-lg animate-pulse backdrop-blur-sm shadow-xl">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Edit Client Modal */}
        {editingClient && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg border border-white/10 overflow-hidden animate-fadeIn">
              <div className="p-5 bg-gradient-to-r from-slate-700 to-slate-800 border-b border-slate-600/30">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-white">Edit Client Order</h3>
                  <button 
                    onClick={closeEditForm}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Tabs for General Info and Products */}
              <div className="flex border-b border-slate-700">
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === 'general'
                      ? 'bg-white/5 text-white border-b-2 border-emerald-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setActiveTab('general')}
                >
                  General Info
                </button>
                <button
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === 'products'
                      ? 'bg-white/5 text-white border-b-2 border-emerald-500'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setActiveTab('products')}
                >
                  Products
                  <span className="ml-2 px-1.5 py-0.5 bg-white/10 rounded text-xs">
                    {editFormData.products.length}
                  </span>
                </button>
              </div>
              
              <form onSubmit={saveClientChanges}>
                {activeTab === 'general' ? (
                  <div className="p-5 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Client Name</label>
                      <input
                        type="text"
                        name="clientName"
                        value={editFormData.clientName}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Amount Paid (₹)
                        <span className="text-xs text-slate-500 ml-2">
                          Total: ₹{editFormData.products.reduce((total, product) => 
                            total + (parseFloat(product.price) || 0) * (parseFloat(product.count) || 0), 0).toFixed(2)}
                        </span>
                      </label>
                      <input
                        type="number"
                        name="amountPaid"
                        value={editFormData.amountPaid}
                        onChange={handleEditInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Payment Status</label>
                      <select
                        name="paymentStatus"
                        value={editFormData.paymentStatus}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="cleared">Cleared</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="p-5">
                    {/* Product editing interface */}
                    {editingProduct ? (
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4 animate-fadeIn">
                        <h4 className="text-white font-medium mb-3">
                          {editingProduct.index !== undefined && editingProduct.name 
                            ? `Edit Product: ${editingProduct.name}`
                            : 'Add New Product'}
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Product Name</label>
                            <input
                              type="text"
                              name="name"
                              value={productFormData.name}
                              onChange={handleProductFormChange}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                              placeholder="Enter product name"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-1">Price (₹)</label>
                              <input
                                type="number"
                                name="price"
                                value={productFormData.price}
                                onChange={handleProductFormChange}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                                placeholder="0.00"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-1">Quantity</label>
                              <input
                                type="number"
                                name="count"
                                value={productFormData.count}
                                onChange={handleProductFormChange}
                                min="1"
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                                placeholder="1"
                              />
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={cancelProductEdit}
                              className="px-3 py-1.5 text-sm bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={saveProductChanges}
                              className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                            >
                              {editingProduct.index !== undefined && editingProduct.name ? 'Update Product' : 'Add Product'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={addNewProduct}
                        className="w-full py-2 px-4 mb-4 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-lg text-sm text-slate-300 flex items-center justify-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Product
                      </button>
                    )}
                    
                    {/* Products list */}
                    <div className="max-h-60 overflow-y-auto pr-1">
                      {editFormData.products.length > 0 ? (
                        <ul className="space-y-2">
                          {editFormData.products.map((product, index) => (
                            <li key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{product.name || 'Unnamed Product'}</p>
                                <div className="flex items-center mt-1">
                                  <span className="text-xs text-slate-400">
                                    {product.count} × ₹{parseFloat(product.price).toFixed(2)} = 
                                  </span>
                                  <span className="text-xs text-emerald-400 ml-1 font-medium">
                                    ₹{(product.count * parseFloat(product.price)).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex ml-4">
                                <button
                                  type="button"
                                  onClick={() => editProduct(product, index)}
                                  className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteProduct(index)}
                                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="py-4 text-center text-slate-500 text-sm">
                          No products have been added yet.
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="p-5 pt-2 border-t border-slate-700/50">
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeEditForm}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-emerald-500 animate-spin"></div>
              <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-r-4 border-teal-300 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
            <p className="ml-6 text-lg text-slate-300 font-medium">Loading orders...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-white/10 shadow-2xl backdrop-blur-md">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-slate-600 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-3">
              {savedClients.length === 0 
                ? 'No orders found' 
                : `No ${activeFilter === 'pending' ? 'pending payment' : activeFilter === 'cleared' ? 'cleared payment' : ''} orders found`}
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              {savedClients.length === 0 
                ? 'You haven\'t created any orders yet. Get started by creating your first order.' 
                : activeFilter !== 'all' 
                  ? `There are no orders with ${activeFilter === 'pending' ? 'pending' : 'cleared'} payment status.`
                  : 'You haven\'t created any orders yet.'}
            </p>
            {savedClients.length === 0 && (
              <Link 
                to="/" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg shadow-lg hover:shadow-emerald-500/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create First Order
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredClients.map((client) => (
              <div 
                key={client.id} 
                className={`backdrop-blur-md ${isDarkMode ? 'bg-white/10' : 'bg-white'} rounded-xl shadow-xl overflow-hidden border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} group hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Card header */}
                <div className={`p-5 ${isDarkMode ? 'bg-gradient-to-r from-slate-800/80 to-slate-700/80' : 'bg-gradient-to-r from-gray-50 to-gray-100'} border-b ${isDarkMode ? 'border-slate-600/30' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{client.clientName || 'Unnamed Client'}</h3>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} mt-1`}>Order ID: {client.id}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      client.paymentStatus === 'cleared' 
                        ? `${isDarkMode ? 'bg-sky-500/20' : 'bg-sky-100'} ${isDarkMode ? 'text-sky-300' : 'text-sky-700'} border ${isDarkMode ? 'border-sky-500/30' : 'border-sky-200'}`
                        : `${isDarkMode ? 'bg-amber-500/20' : 'bg-amber-100'} ${isDarkMode ? 'text-amber-300' : 'text-amber-700'} border ${isDarkMode ? 'border-amber-500/30' : 'border-amber-200'}`
                    }`}>
                      {client.paymentStatus === 'cleared' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} mt-3`}>
                    {formatDate(client.timestamp)}
                  </p>
                </div>
                
                {/* Card content */}
                <div className="p-5 space-y-4">
                  {/* Financial summary */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} backdrop-blur-md rounded-lg p-3 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} flex flex-col`}>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Total:</p>
                      <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm sm:text-base truncate`}>₹{client.grandTotal?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} backdrop-blur-md rounded-lg p-3 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} flex flex-col`}>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Paid:</p>
                      <p className="font-medium text-emerald-500 text-sm sm:text-base truncate">₹{client.amountPaid?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} backdrop-blur-md rounded-lg p-3 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} flex flex-col`}>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Balance:</p>
                      <p className={`font-medium text-sm sm:text-base truncate ${(client.grandTotal - (client.amountPaid || 0)) <= 0 ? 'text-sky-500' : 'text-amber-500'}`}>
                        ₹{(client.grandTotal - (client.amountPaid || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Products section */}
                  <div className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} backdrop-blur-md rounded-lg p-3 sm:p-4 border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Products</p>
                      <span className={`${isDarkMode ? 'bg-white/10' : 'bg-white'} text-xs ${isDarkMode ? 'text-white' : 'text-gray-700'} px-2 py-0.5 sm:py-1 rounded-full`}>
                        {client.products?.length || 0} items
                      </span>
                    </div>
                    
                    {client.products && client.products.length > 0 ? (
                      <div className="max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 hide-scrollbar">
                        <ul className="space-y-2">
                          {client.products.slice().reverse().map((product, index) => (
                            <li key={index} className={`flex justify-between items-center text-sm ${isDarkMode ? 'bg-white/5' : 'bg-white'} rounded-lg p-2 border ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                              <span className={`${isDarkMode ? 'text-slate-300' : 'text-gray-700'} truncate max-w-[120px]`}>
                                {product.name || 'Unnamed Product'}
                              </span>
                              <span className={`${isDarkMode ? 'text-slate-400' : 'text-gray-500'} whitespace-nowrap text-xs ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'} px-2 py-0.5 rounded`}>
                                {product.count} × ₹{parseFloat(product.price).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'} italic`}>No products</p>
                    )}
                  </div>
                </div>
                
                {/* Card actions */}
                <div className={`grid grid-cols-4 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
                  <button 
                    onClick={() => navigate(`/order/${client.id}`)}
                    className={`py-2 sm:py-3 text-center text-xs sm:text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-600'} hover:${isDarkMode ? 'bg-white/10' : 'bg-gray-50'} transition-colors border-r ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'} flex items-center justify-center`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="hidden xs:inline ml-0.5">View</span>
                  </button>
                  <button 
                    onClick={() => editClient(client)}
                    className={`py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-indigo-500 hover:${isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50'} transition-colors border-r ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'} flex items-center justify-center`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden xs:inline ml-0.5">Edit</span>
                  </button>
                  {client.paymentStatus !== 'cleared' ? (
                    <button 
                      onClick={() => clearOrderPayment(client.id)}
                      className={`py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-emerald-500 hover:${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'} transition-colors border-r ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'} flex items-center justify-center`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="hidden xs:inline ml-0.5">Pay</span>
                    </button>
                  ) : (
                    <div className={`py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-sky-500 ${isDarkMode ? 'bg-sky-500/10' : 'bg-sky-50'} border-r ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200'} flex items-center justify-center opacity-70`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="hidden xs:inline ml-0.5">Paid</span>
                    </div>
                  )}
                  <button 
                    onClick={() => deleteOrder(client.id)}
                    className={`py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-red-500 hover:${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'} transition-colors flex items-center justify-center`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden xs:inline ml-0.5">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList; 
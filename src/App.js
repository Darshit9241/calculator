import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Calculator from './calculator';
import ClientList from './clientList';
import OrderDetail from './orderDetail';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import OrderEdit from './OrderEdit';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Calculator />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/edit/:id" element={<OrderEdit />} />
          </Route>
          
          {/* Redirect any unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Calculator from './calculator';
import ClientList from './clientList';
import OrderDetail from './orderDetail';
// import Login from './Login';
// import Signup from './Signup';
// import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
          
          {/* Protected routes */}
          <Route>
            <Route path="/" element={<Calculator />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/order/:id" element={<OrderDetail />} />
          </Route>
          
          {/* Redirect any unknown routes to login */}
          {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

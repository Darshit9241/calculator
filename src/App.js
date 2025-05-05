import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calculator from './calculator';
import ClientList from './clientList';
import OrderDetail from './orderDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/order/:id" element={<OrderDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

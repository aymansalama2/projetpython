import { Routes, Route } from 'react-router-dom';
import { Home } from './components/Home.jsx';
import { Login } from './components/Login.jsx';
import { Register } from './components/Register.jsx';
import { AdminLogin } from './components/AdminLogin.jsx';
import { Dashboard } from './components/admin/Dashboard.jsx';
import { BusManagement } from './components/admin/BusManagement.jsx';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Routes administrateur */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="/admin/buses" element={<BusManagement />} />
    </Routes>
  );
}


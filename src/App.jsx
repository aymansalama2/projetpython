import { Routes, Route } from 'react-router-dom';
import { Home } from './components/Home.jsx';
import { Login } from './components/Login.jsx';
import { Register } from './components/Register.jsx';
import { AdminLogin } from './components/AdminLogin.jsx';
import { Dashboard } from './components/admin/Dashboard.jsx';
import { BusManagement } from './components/admin/BusManagement.jsx';
import { LocationManagement } from './components/admin/LocationManagement.jsx';
import { LocationForm } from './components/admin/LocationForm.jsx';
import { AdminRoute } from './components/AdminRoute.jsx';

export function App() {
  // Log les routes configurées
  console.log("App component - Routes configuration loaded");
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Routes administrateur */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      <Route path="/admin/buses/*" element={<AdminRoute><BusManagement /></AdminRoute>} />
      <Route path="/admin/locations/*" element={<AdminRoute><LocationManagement /></AdminRoute>} />
      
      {/* Route directe pour tester et résoudre le problème */}
      <Route path="/admin/locations/new-direct" element={<AdminRoute><LocationForm /></AdminRoute>} />
    </Routes>
  );
}


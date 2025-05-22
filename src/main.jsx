import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Home } from '@/components/Home';
import { Login } from '@/components/Login';
import { Register } from '@/components/Register';
import { UserDashboard } from '@/components/UserDashboard';
import { Dashboard } from '@/components/admin/Dashboard';
import { BusList } from '@/components/admin/BusList';
import { LocationList } from '@/components/admin/LocationList';
import { ScheduleList } from '@/components/admin/ScheduleList';
import { ReservationList } from '@/components/admin/ReservationList';
import { UserList } from '@/components/admin/UserList';
import { UserForm } from '@/components/admin/UserForm';
import { PrivateRoute } from './components/PrivateRoute';
import { AdminRoute } from './components/AdminRoute';
import { EditProfile } from '@/components/EditProfile';
import { NewReservation } from '@/components/NewReservation';
import AdminCreateReservation from './components/AdminCreateReservation';
import { BusForm } from '@/components/admin/BusForm';
import { RouteList } from '@/components/admin/RouteList';
import { RouteForm } from '@/components/admin/RouteForm';
import { ScheduleForm } from '@/components/admin/ScheduleForm';
import { BookingList } from '@/components/admin/BookingList';
import { Settings } from '@/components/admin/Settings';
import { LocationForm } from '@/components/admin/LocationForm';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
                        <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
                        <Route path="/reservations/new" element={<PrivateRoute><NewReservation /></PrivateRoute>} />
                        <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                        <Route path="/admin/buses" element={<AdminRoute><BusList /></AdminRoute>} />
                        <Route path="/admin/buses/new" element={<AdminRoute><BusForm /></AdminRoute>} />
                        <Route path="/admin/buses/:id/edit" element={<AdminRoute><BusForm /></AdminRoute>} />
                        <Route path="/admin/locations" element={<AdminRoute><LocationList /></AdminRoute>} />
                        <Route path="/admin/locations/new" element={<AdminRoute><LocationForm /></AdminRoute>} />
                        <Route path="/admin/locations/:id/edit" element={<AdminRoute><LocationForm /></AdminRoute>} />
                        <Route path="/admin/schedules" element={<AdminRoute><ScheduleList /></AdminRoute>} />
                        <Route path="/admin/schedules/new" element={<AdminRoute><ScheduleForm /></AdminRoute>} />
                        <Route path="/admin/schedules/:id/edit" element={<AdminRoute><ScheduleForm /></AdminRoute>} />
                        <Route path="/admin/reservations" element={<AdminRoute><ReservationList /></AdminRoute>} />
                        <Route path="/admin/reservations/new" element={<AdminRoute><AdminCreateReservation /></AdminRoute>} />
                        <Route path="/admin/users" element={<AdminRoute><UserList /></AdminRoute>} />
                        <Route path="/admin/users/new" element={<AdminRoute><UserForm /></AdminRoute>} />
                        <Route path="/admin/users/:id/edit" element={<AdminRoute><UserForm /></AdminRoute>} />
                        <Route path="/admin/routes" element={<AdminRoute><RouteList /></AdminRoute>} />
                        <Route path="/admin/routes/new" element={<AdminRoute><RouteForm /></AdminRoute>} />
                        <Route path="/admin/routes/:id/edit" element={<AdminRoute><RouteForm /></AdminRoute>} />
                        <Route path="/admin/bookings" element={<AdminRoute><BookingList /></AdminRoute>} />
                        <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);

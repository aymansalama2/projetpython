import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { Home } from './components/Home.jsx'
import { Login } from './components/Login.jsx'
import { Register } from './components/Register.jsx'
import { ScheduleSearch } from './components/ScheduleSearch.jsx'
import { UserProfile } from './components/UserProfile.jsx'
import { Dashboard } from './components/admin/Dashboard.jsx'
import { BusManagement } from './components/admin/BusManagement.jsx'
import { ThemeProvider } from './components/admin/ThemeContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { AdminLogin } from './components/AdminLogin.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/schedule-search',
    element: <ScheduleSearch />
  },
  {
    path: '/profile',
    element: <UserProfile />
  },
  // Routes administrateur
  {
    path: '/admin/login',
    element: <AdminLogin />
  },
  {
    path: '/admin/dashboard',
    element: <Dashboard />
  },
  {
    path: '/admin/buses',
    element: <BusManagement />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)

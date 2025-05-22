import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
    getBuses, 
    getLocations, 
    getSchedules, 
    getReservations,
    getUserProfile
} from '../../services/api';

// Composant Header du Dashboard
const DashboardHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(3);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  return (
    <header className={`${darkMode ? 'bg-dark-100 text-white' : 'bg-white text-gray-800'} shadow-md py-3 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300`}>
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className={`mr-4 p-2 rounded-md ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-black hover:bg-gray-100'} lg:hidden transition-colors`}
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold flex items-center">
          <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Bus</span>
          <span className="text-yellow-500">Booking</span>
          <span className={`hidden md:inline-block ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Admin</span>
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        {/* Search button */}
        <button className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors hidden md:flex`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        
        {/* Theme toggle button */}
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-blue-600 hover:bg-gray-200'} transition-all duration-300`}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Notifications button */}
        <button className={`relative p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifications > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center animate-pulse-subtle">{notifications}</span>
          )}
        </button>
        
        {/* Profile dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center p-1 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
          >
            <div className="h-8 w-8 rounded-full overflow-hidden mr-2 ring-2 ring-blue-500">
              <img src="https://i.pravatar.cc/36?img=68" alt="Admin" className="h-full w-full object-cover" />
            </div>
            <span className={`font-medium hidden sm:inline ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Admin</span>
            <svg className={`ml-1 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Profile dropdown menu */}
          {showProfileMenu && (
            <div 
              className={`absolute right-0 mt-2 w-48 py-2 ${darkMode ? 'bg-dark-100 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-200'} rounded-md shadow-lg border animate-fade-in transition-colors z-50`}
            >
              <a href="#profile" className={`block px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                Votre profil
              </a>
              <a href="#settings" className={`block px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                Paramètres
              </a>
              <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} my-1`}></div>
              <a href="#logout" className={`block px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30`}>
                Déconnexion
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Composant Sidebar
const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const { darkMode } = useTheme();
  
  // Déterminez le menu actif en fonction de l'URL actuelle
  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.includes('/admin/dashboard')) setActiveMenu('dashboard');
    else if (pathname.includes('/admin/buses')) setActiveMenu('buses');
    else if (pathname.includes('/admin/routes')) setActiveMenu('routes');
    else if (pathname.includes('/admin/schedules')) setActiveMenu('schedules');
    else if (pathname.includes('/admin/bookings')) setActiveMenu('bookings');
    else if (pathname.includes('/admin/users')) setActiveMenu('users');
    else if (pathname.includes('/admin/settings')) setActiveMenu('settings');
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  const MenuItem = ({ to, icon, label, menuKey }) => {
    const isActive = activeMenu === menuKey;
    return (
      <Link 
        to={to} 
        className={`flex items-center py-3 px-4 rounded-lg mb-1 transition-all duration-200 ${
          isActive 
            ? 'bg-primary-500 text-white font-medium shadow-md' 
            : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50`
        }`}
        onClick={() => setActiveMenu(menuKey)}
      >
        {icon}
        <span className={`ml-3 ${isActive ? 'text-white' : ''}`}>{label}</span>
        {isActive && (
          <span className="ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </Link>
    );
  };
  
  const MenuSection = ({ title, children }) => (
    <>
      <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</div>
      {children}
    </>
  );
  
  return (
    <aside className={`${darkMode ? 'bg-dark-200 text-white' : 'bg-slate-800 text-white'} w-64 fixed top-0 bottom-0 left-0 overflow-y-auto transition-all duration-300 z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 shadow-xl`}>
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-slate-700'}`}>
        <Link to="/admin/dashboard" className="flex items-center justify-center py-3">
          <span className="text-2xl font-bold flex items-center">
            <span className="text-blue-400">Bus</span>
            <span className="text-yellow-500">Booking</span>
            <span className="ml-1 text-sm bg-blue-500 text-white px-2 py-0.5 rounded-md opacity-90">Admin</span>
          </span>
        </Link>
      </div>
      
      <nav className="mt-6 px-2">
        <MenuSection title="Général">
          <MenuItem 
            to="/admin/dashboard" 
            menuKey="dashboard"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            label="Tableau de bord"
          />
        </MenuSection>
        
        <MenuSection title="Gestion">
          <MenuItem 
            to="/admin/buses" 
            menuKey="buses"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label="Bus"
          />
          
          <MenuItem 
            to="/admin/routes" 
            menuKey="routes"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            }
            label="Itinéraires"
          />
          
          <MenuItem 
            to="/admin/schedules" 
            menuKey="schedules"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Horaires"
          />
          
          <MenuItem 
            to="/admin/bookings" 
            menuKey="bookings"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            label="Réservations"
          />
          
          <MenuItem 
            to="/admin/users" 
            menuKey="users"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            label="Utilisateurs"
          />
        </MenuSection>
        
        <MenuSection title="Configuration">
          <MenuItem 
            to="/admin/settings" 
            menuKey="settings"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            label="Paramètres"
          />
        </MenuSection>
        
        <div className="px-2 mt-6 pb-4">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full py-3 px-4 rounded-lg text-white bg-red-500/30 hover:bg-red-500/70 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="ml-3">Déconnexion</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

// Composant de contenu du tableau de bord
const DashboardContent = ({ stats, loading, error }) => {
  const { darkMode } = useTheme();
  
  if (loading) {
    return (
      <div className={`flex-grow flex items-center justify-center ${darkMode ? 'bg-dark-200' : 'bg-gray-50'}`}>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex-grow flex items-center justify-center ${darkMode ? 'bg-dark-200' : 'bg-gray-50'}`}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-lg">
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-bold text-lg">Erreur</h3>
          </div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${darkMode ? 'bg-dark-200' : 'bg-gray-50'} transition-colors duration-300 min-h-screen`}>
      <div className="mb-8 animate-fade-in">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} mb-2`}>Vue d'ensemble</h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
          Bienvenue dans votre tableau de bord d'administration
        </p>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Carte des bus */}
        <StatCard 
          title="Total Bus" 
          value={stats.totalBuses} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          }
          linkText="Gérer les bus" 
          linkUrl="/admin/buses" 
          color="blue"
        />
        
        {/* Carte des locations */}
        <StatCard 
          title="Total Locations" 
          value={stats.totalLocations} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          linkText="Gérer les locations" 
          linkUrl="/admin/locations" 
          color="green"
        />
        
        {/* Carte des horaires */}
        <StatCard 
          title="Total Horaires" 
          value={stats.totalSchedules} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          linkText="Gérer les horaires" 
          linkUrl="/admin/schedules" 
          color="amber"
        />
        
        {/* Carte des réservations */}
        <StatCard 
          title="Total Réservations" 
          value={stats.totalReservations} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          linkText="Gérer les réservations" 
          linkUrl="/admin/reservations" 
          color="purple"
        />
        
        {/* Carte des réservations actives */}
        <StatCard 
          title="Réservations Actives" 
          value={stats.activeReservations} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          linkText="Voir les détails" 
          linkUrl="/admin/reservations" 
          color="indigo"
        />
        
        {/* Carte des utilisateurs */}
        <StatCard 
          title="Total Utilisateurs" 
          value={stats.totalUsers} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          linkText="Gérer les utilisateurs" 
          linkUrl="/admin/users" 
          color="rose"
        />
      </div>
      
      {/* Quick Actions */}
      <div className={`${darkMode ? 'bg-dark-100 border border-gray-800' : 'bg-white border border-gray-100'} shadow-lg rounded-lg p-6 transition-colors duration-300`}>
        <h2 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} mb-4 flex items-center`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionButton 
            to="/admin/buses/new" 
            text="Ajouter un Bus"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
          <QuickActionButton 
            to="/admin/locations/new" 
            text="Ajouter une Location"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
          <QuickActionButton 
            to="/admin/schedules/new" 
            text="Créer un Horaire"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
};

// Composant pour les cartes de statistiques
const StatCard = ({ title, value, icon, linkText, linkUrl, color }) => {
  const { darkMode } = useTheme();
  
  const colorClasses = {
    blue: {
      bg: darkMode ? 'from-blue-900/20 to-blue-800/10' : 'from-blue-50 to-blue-100/60',
      icon: darkMode ? 'text-blue-400' : 'text-blue-500',
      border: darkMode ? 'border-blue-800/30' : 'border-blue-200',
    },
    green: {
      bg: darkMode ? 'from-green-900/20 to-green-800/10' : 'from-green-50 to-green-100/60',
      icon: darkMode ? 'text-green-400' : 'text-green-500',
      border: darkMode ? 'border-green-800/30' : 'border-green-200',
    },
    amber: {
      bg: darkMode ? 'from-amber-900/20 to-amber-800/10' : 'from-amber-50 to-amber-100/60',
      icon: darkMode ? 'text-amber-400' : 'text-amber-500',
      border: darkMode ? 'border-amber-800/30' : 'border-amber-200',
    },
    purple: {
      bg: darkMode ? 'from-purple-900/20 to-purple-800/10' : 'from-purple-50 to-purple-100/60',
      icon: darkMode ? 'text-purple-400' : 'text-purple-500',
      border: darkMode ? 'border-purple-800/30' : 'border-purple-200',
    },
    indigo: {
      bg: darkMode ? 'from-indigo-900/20 to-indigo-800/10' : 'from-indigo-50 to-indigo-100/60',
      icon: darkMode ? 'text-indigo-400' : 'text-indigo-500',
      border: darkMode ? 'border-indigo-800/30' : 'border-indigo-200',
    },
    rose: {
      bg: darkMode ? 'from-rose-900/20 to-rose-800/10' : 'from-rose-50 to-rose-100/60',
      icon: darkMode ? 'text-rose-400' : 'text-rose-500',
      border: darkMode ? 'border-rose-800/30' : 'border-rose-200',
    },
  };
  
  const classes = colorClasses[color] || colorClasses.blue;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`overflow-hidden rounded-xl shadow-md border ${classes.border} bg-gradient-to-br ${classes.bg} transition-colors duration-300`}
    >
      <div className="px-4 py-5 sm:p-6 flex justify-between items-center">
        <div>
          <dt className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} truncate`}>
            {title}
          </dt>
          <dd className={`mt-1 text-3xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </dd>
        </div>
        <div className={`${classes.icon} opacity-80`}>
          {icon}
        </div>
      </div>
      <div className={`px-4 py-4 sm:px-6 border-t ${classes.border}`}>
        <Link
          to={linkUrl}
          className={`text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} flex items-center transition-colors`}
        >
          {linkText}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

// Composant pour les boutons d'action rapide
const QuickActionButton = ({ to, text, icon }) => {
  const { darkMode } = useTheme();
  
  return (
    <Link
      to={to}
      className={`flex items-center justify-center px-4 py-3 rounded-lg ${
        darkMode 
          ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-800/30' 
          : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100'
      } transition-colors duration-200 font-medium`}
    >
      {icon}
      {text}
    </Link>
  );
};

export function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalLocations: 0,
    totalSchedules: 0,
    totalReservations: 0,
    activeReservations: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [buses, locations, schedules, reservations, profile] = await Promise.all([
          getBuses(),
          getLocations(),
          getSchedules(),
          getReservations(),
          getUserProfile()
        ]);

        setStats({
          totalBuses: Array.isArray(buses) ? buses.length : 0,
          totalLocations: Array.isArray(locations) ? locations.length : 0,
          totalSchedules: Array.isArray(schedules) ? schedules.length : 0,
          totalReservations: Array.isArray(reservations) ? reservations.length : 0,
          activeReservations: Array.isArray(reservations) ? 
            reservations.filter(r => r.status === 'confirmed').length : 0,
          totalUsers: Array.isArray(profile) ? profile.length : 1
        });
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchStats();
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-200' : 'bg-gray-100'} transition-colors duration-300`}>
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className={`lg:ml-64 transition-all duration-300 min-h-screen flex flex-col`}>
        <DashboardHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-grow flex flex-col">
          <DashboardContent stats={stats} loading={loading} error={error} />
        </main>
      </div>
      
      {/* Overlay pour fermer le sidebar sur mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
} 
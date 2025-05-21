import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';

// Composant Header du Dashboard
const DashboardHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const { darkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(3);
  
  return (
    <header className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-md py-4 px-6 flex items-center justify-between theme-transition`}>
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className={`mr-4 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} lg:hidden`}
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold flex items-center">
          <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Bus</span>
          <span className="text-yellow-500">Booking</span>
          <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Admin</span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
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

        <button className={`relative p-2 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-full transition-colors`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">{notifications}</span>
        </button>
        
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full overflow-hidden mr-2 ring-2 ring-blue-500">
            <img src="https://i.pravatar.cc/36?img=68" alt="Admin" className="h-full w-full object-cover" />
          </div>
          <span className={`font-medium hidden sm:inline ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Admin</span>
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
  
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    navigate('/admin/login');
  };
  
  return (
    <aside className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-slate-800 text-white'} w-64 fixed top-0 bottom-0 left-0 overflow-y-auto transition-transform duration-300 z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 theme-transition`}>
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-slate-700'}`}>
        <Link to="/admin/dashboard" className="flex items-center justify-center py-3">
          <span className="text-2xl font-bold flex items-center">
            <span className="text-blue-400">Bus</span>
            <span className="text-yellow-500">Booking</span>
          </span>
        </Link>
      </div>
      
      <nav className="mt-6 px-2">
        <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">Général</div>
        <Link 
          to="/admin/dashboard" 
          className={`flex items-center py-3 px-4 rounded-lg mb-1 ${
            activeMenu === 'dashboard' 
              ? darkMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-600 text-white' 
              : darkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-300 hover:bg-slate-700'
          } transition-colors`}
          onClick={() => setActiveMenu('dashboard')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Tableau de bord</span>
        </Link>
        
        <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase">Gestion</div>
        
        <Link 
          to="/admin/buses" 
          className={`flex items-center py-3 px-4 rounded-lg mb-1 ${
            activeMenu === 'buses' 
              ? darkMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-600 text-white' 
              : darkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-300 hover:bg-slate-700'
          } transition-colors`}
          onClick={() => setActiveMenu('buses')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span>Bus</span>
        </Link>
        
        <Link 
          to="/admin/routes" 
          className={`flex items-center py-3 px-4 rounded-lg mb-1 ${
            activeMenu === 'routes' 
              ? darkMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-600 text-white' 
              : darkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-300 hover:bg-slate-700'
          } transition-colors`}
          onClick={() => setActiveMenu('routes')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span>Itinéraires</span>
        </Link>
        
        <Link 
          to="/admin/schedules" 
          className={`flex items-center py-3 px-4 rounded-lg mb-1 ${
            activeMenu === 'schedules' 
              ? darkMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-600 text-white' 
              : darkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-300 hover:bg-slate-700'
          } transition-colors`}
          onClick={() => setActiveMenu('schedules')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Horaires</span>
        </Link>
        
        <Link 
          to="/admin/bookings" 
          className={`flex items-center py-3 px-4 rounded-lg mb-1 ${
            activeMenu === 'bookings' 
              ? darkMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-600 text-white' 
              : darkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-300 hover:bg-slate-700'
          } transition-colors`}
          onClick={() => setActiveMenu('bookings')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Réservations</span>
        </Link>
        
        <Link 
          to="/admin/users" 
          className={`flex items-center py-3 px-4 rounded-lg mb-1 ${
            activeMenu === 'users' 
              ? darkMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-600 text-white' 
              : darkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-300 hover:bg-slate-700'
          } transition-colors`}
          onClick={() => setActiveMenu('users')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>Utilisateurs</span>
        </Link>
        
        <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase">Configuration</div>
        
        <Link 
          to="/admin/settings" 
          className={`flex items-center py-3 px-4 rounded-lg mb-1 ${
            activeMenu === 'settings' 
              ? darkMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-600 text-white' 
              : darkMode 
                ? 'text-gray-300 hover:bg-gray-800' 
                : 'text-gray-300 hover:bg-slate-700'
          } transition-colors`}
          onClick={() => setActiveMenu('settings')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Paramètres</span>
        </Link>
        
        <div className="px-2 mt-6">
          <button 
            onClick={handleLogout}
            className={`flex items-center w-full py-3 px-4 rounded-lg ${
              darkMode 
                ? 'text-gray-300 hover:bg-red-900/30 hover:text-red-300' 
                : 'text-gray-300 hover:bg-red-900/30 hover:text-red-300'
            } transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

// Composant de contenu du tableau de bord
const DashboardContent = () => {
  const { darkMode } = useTheme();
  
  // Données simulées pour les statistiques
  const stats = [
    { 
      title: "Réservations", 
      value: "1,248", 
      change: "+12.5%", 
      trend: "up",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    { 
      title: "Voyages actifs", 
      value: "36", 
      change: "+4.3%", 
      trend: "up",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      title: "Utilisateurs", 
      value: "854", 
      change: "+18.2%", 
      trend: "up",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      title: "Itinéraires", 
      value: "18", 
      change: "+0%", 
      trend: "neutral",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    }
  ];

  // Données simulées pour les réservations récentes
  const recentBookings = [
    { id: "RB-1234", customer: "Jean Dupont", route: "Paris - Lyon", date: "2023-08-15", status: "Confirmé" },
    { id: "RB-1235", customer: "Marie Laurent", route: "Marseille - Nice", date: "2023-08-16", status: "En attente" },
    { id: "RB-1236", customer: "Thomas Bernard", route: "Toulouse - Bordeaux", date: "2023-08-16", status: "Confirmé" },
    { id: "RB-1237", customer: "Sophie Martin", route: "Lyon - Grenoble", date: "2023-08-17", status: "Annulé" },
    { id: "RB-1238", customer: "Pierre Dubois", route: "Paris - Strasbourg", date: "2023-08-17", status: "Confirmé" }
  ];

  // Quick action buttons
  const quickActions = [
    {
      title: "Ajouter un bus",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      link: "/admin/buses",
      color: "blue"
    },
    {
      title: "Créer un itinéraire",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      link: "/admin/routes",
      color: "indigo"
    },
    {
      title: "Ajouter un horaire",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      link: "/admin/schedules",
      color: "purple"
    },
    {
      title: "Gérer les réservations",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      link: "/admin/bookings",
      color: "teal"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8 animate-fade-in">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} mb-2`}>Vue d'ensemble</h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
          Bienvenue dans votre tableau de bord d'administration
        </p>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-slate-800'} rounded-xl shadow-md overflow-hidden theme-transition`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{stat.title}</div>
                <div className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'bg-blue-900/30 text-blue-300' 
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className={`text-sm ${
                  stat.trend === 'up' 
                    ? darkMode ? 'text-green-400' : 'text-green-500' 
                    : stat.trend === 'down' 
                      ? darkMode ? 'text-red-400' : 'text-red-500'
                      : darkMode ? 'text-gray-400' : 'text-slate-400'
                }`}>
                  <div className="flex items-center">
                    {stat.trend === 'up' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    )}
                    {stat.trend === 'down' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
            <div className={`h-1 w-full ${
              stat.trend === 'up' 
                ? 'bg-gradient-to-r from-green-400 to-green-500' 
                : stat.trend === 'down' 
                  ? 'bg-gradient-to-r from-red-400 to-red-500'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
            }`}></div>
          </motion.div>
        ))}
      </div>
      
      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Réservations récentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`lg:col-span-2 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-md overflow-hidden theme-transition`}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Réservations récentes</h3>
              <button className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline transition-colors`}>
                Voir tout
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Itinéraire</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {recentBookings.map((booking, index) => (
                  <tr 
                    key={index} 
                    className={`${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-800'}`}>{booking.id}</td>
                    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-800'}`}>{booking.customer}</td>
                    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-800'}`}>{booking.route}</td>
                    <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-800'}`}>{booking.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${
                        booking.status === 'Confirmé' 
                          ? darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800' 
                          : booking.status === 'En attente' 
                            ? darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800' 
                            : darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-1 ${
                          booking.status === 'Confirmé' 
                            ? 'bg-green-500' 
                            : booking.status === 'En attente' 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                        }`}></span>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-xl shadow-md overflow-hidden theme-transition`}
        >
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold">Actions rapides</h3>
          </div>
          
          <div className="p-6 space-y-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  darkMode 
                    ? `bg-${action.color}-900/20 text-${action.color}-300 hover:bg-${action.color}-900/30` 
                    : `bg-${action.color}-50 text-${action.color}-600 hover:bg-${action.color}-100`
                }`}
              >
                <span className="flex items-center">
                  {action.icon}
                  {action.title}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  
  useEffect(() => {
    // Vérifier si l'administrateur est connecté
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    
    if (!userId || userRole !== 'admin') {
      navigate('/admin/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);
  
  if (!isLoggedIn) {
    return null; // ou un loader
  }
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} theme-transition`}>
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className={`lg:ml-64 transition-all duration-300 min-h-screen flex flex-col`}>
        <DashboardHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-grow">
          <DashboardContent />
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
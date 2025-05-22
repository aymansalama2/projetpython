import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { searchService, locationService } from '../services/api';

export function Home() {
  const [activeTab, setActiveTab] = useState('schedules');
  const [scrolled, setScrolled] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const { user, loading: authLoading } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          navigate('/login');
          return;
        }
        const [routesData, citiesData] = await Promise.all([
          searchService.getAllRoutes(),
          locationService.getAllCities()
        ]);
        setRoutes(routesData);
        setCities(citiesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, authLoading, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  const goToAdminDashboard = () => {
    navigate('/admin/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <Link to="/" className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Bus<span className="text-yellow-500">Booking</span>
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              {user ? (
                <>
                  {user.isAdmin && (
                    <button
                      onClick={goToAdminDashboard}
                      className="px-6 py-2 rounded-full bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      Dashboard Admin
                    </button>
                  )}
                  
                  <Link
                    to="/profile"
                    className="px-6 py-2 rounded-full bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Mon Profil
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2 rounded-full bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="px-6 py-2 rounded-full bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Se connecter
                  </Link>
                  <Link 
                    to="/register"
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            variants={itemVariants}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Voyagez avec <span className="text-yellow-400">confort</span> et <span className="text-yellow-400">simplicité</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Réservez vos billets de bus en ligne et profitez d'un voyage sans stress
            </p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link
                to="/schedule-search"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-blue-900 font-semibold text-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Réserver maintenant
              </Link>
              <button
                onClick={() => {
                  const element = document.getElementById('tabs-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Voir les horaires
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
            <path fill="#f8fafc" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,160C960,160,1056,128,1152,112C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </motion.section>

      {/* Affichage des routes dynamiques */}
      <motion.section
        id="routes-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-12"
          >
            Nos principaux itinéraires
          </motion.h2>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {routes.map((route) => (
                <motion.div
                  key={route.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-blue-800">{route.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-gray-500 text-sm">Départ</p>
                        <p className="font-medium">{route.origin}</p>
                      </div>
                      <div className="text-gray-400">→</div>
                      <div>
                        <p className="text-gray-500 text-sm">Arrivée</p>
                        <p className="font-medium">{route.destination}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div>
                        <span className="font-medium">{route.distance}</span> km
                      </div>
                      <div>
                        <span className="font-medium">{Math.floor(route.duration / 60)}h{route.duration % 60 > 0 ? ` ${route.duration % 60}min` : ''}</span>
                      </div>
                    </div>
                    <Link
                      to={`/schedule-search?origin=${route.origin}&destination=${route.destination}`}
                      className="mt-4 block w-full py-2 text-center bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                    >
                      Voir les horaires
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Affichage des villes */}
      <motion.section
        id="cities-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-center mb-12"
          >
            Nos destinations
          </motion.h2>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {cities.map((city, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white px-6 py-3 rounded-full shadow hover:shadow-md transition-shadow"
                >
                  {city}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BusBooking</h3>
              <p className="text-blue-200">La meilleure façon de voyager en bus en France.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens rapides</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-blue-200 hover:text-white">Accueil</Link></li>
                <li><Link to="/schedule-search" className="text-blue-200 hover:text-white">Recherche</Link></li>
                <li><Link to="/login" className="text-blue-200 hover:text-white">Connexion</Link></li>
                <li><Link to="/register" className="text-blue-200 hover:text-white">Inscription</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Aide</h4>
              <ul className="space-y-2">
                <li><Link to="#" className="text-blue-200 hover:text-white">FAQ</Link></li>
                <li><Link to="#" className="text-blue-200 hover:text-white">Support client</Link></li>
                <li><Link to="#" className="text-blue-200 hover:text-white">Remboursements</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Nous contacter</h4>
              <ul className="space-y-2">
                <li className="text-blue-200">support@busbooking.fr</li>
                <li className="text-blue-200">01 23 45 67 89</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300">
            <p>&copy; {new Date().getFullYear()} BusBooking. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


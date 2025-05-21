import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function ScheduleSearch() {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0],
    passengers: 1
  });
  
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const cities = [
    'Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 
    'Strasbourg', 'Nice', 'Nantes', 'Montpellier', 'Lille'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simuler un appel API
    setTimeout(() => {
      // Données factices - dans une application réelle, ces données viendraient d'un API
      const mockResults = [
        {
          id: 1,
          from: searchParams.from,
          to: searchParams.to,
          departureTime: '08:30',
          arrivalTime: '10:45',
          duration: '2h15',
          price: 29,
          busType: 'Standard',
          availableSeats: 23
        },
        {
          id: 2,
          from: searchParams.from,
          to: searchParams.to,
          departureTime: '10:45',
          arrivalTime: '13:00',
          duration: '2h15',
          price: 25,
          busType: 'Standard',
          availableSeats: 12
        },
        {
          id: 3,
          from: searchParams.from,
          to: searchParams.to,
          departureTime: '14:30',
          arrivalTime: '16:45',
          duration: '2h15',
          price: 32,
          busType: 'Confort',
          availableSeats: 18
        },
        {
          id: 4,
          from: searchParams.from,
          to: searchParams.to,
          departureTime: '18:15',
          arrivalTime: '20:30',
          duration: '2h15',
          price: 35,
          busType: 'Premium',
          availableSeats: 8
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BusBooking
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Se connecter
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Recherche de trajets</h1>
          <p className="text-gray-600 mt-2">Trouvez les meilleurs itinéraires pour votre voyage</p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md mb-8"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                <select
                  id="from"
                  name="from"
                  value={searchParams.from}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionnez une ville</option>
                  {cities.map(city => (
                    <option key={`from-${city}`} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <select
                  id="to"
                  name="to"
                  value={searchParams.to}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionnez une ville</option>
                  {cities.map(city => (
                    <option key={`to-${city}`} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={searchParams.date}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">Passagers</label>
                <select
                  id="passengers"
                  name="passengers"
                  value={searchParams.passengers}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'passager' : 'passagers'}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Recherche en cours...
                  </>
                ) : (
                  'Rechercher'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
        
        {searchResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Résultats de la recherche</h2>
            <div className="space-y-4">
              {searchResults.map(result => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="p-4 md:col-span-2">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="font-bold text-xl md:mr-4">{result.departureTime}</div>
                        <div className="flex items-center flex-grow">
                          <div className="font-medium">{result.from}</div>
                          <div className="mx-2 flex-grow h-0.5 bg-gray-300 relative">
                            <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-gray-400"></div>
                          </div>
                          <div className="font-medium">{result.to}</div>
                        </div>
                        <div className="font-bold text-xl md:ml-4">{result.arrivalTime}</div>
                      </div>
                      <div className="mt-2 flex justify-between text-gray-600">
                        <div>Durée: {result.duration}</div>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.busType === 'Premium' ? 'bg-purple-100 text-purple-800' :
                            result.busType === 'Confort' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {result.busType}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t md:border-t-0 md:border-l border-gray-100 flex items-center justify-center md:col-span-1">
                      <div>
                        <div className="text-sm text-gray-500">Prix par personne</div>
                        <div className="text-2xl font-bold text-blue-600">{result.price}€</div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t md:border-t-0 md:border-l border-gray-100 flex items-center md:col-span-2">
                      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="mb-3 md:mb-0">
                          <div className="text-sm text-gray-500">Places disponibles</div>
                          <div className="font-medium">{result.availableSeats} places</div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Réserver
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        
        {!isSearching && searchResults.length === 0 && searchParams.from && searchParams.to && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">Aucun trajet trouvé</h3>
            <p className="text-gray-600">
              Nous n'avons pas trouvé de trajet correspondant à votre recherche. Essayez une autre date ou d'autres villes.
            </p>
          </div>
        )}
      </div>
      
      <footer className="bg-gray-800 text-white p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">© 2023 BusBooking - Tous droits réservés</div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-300 transition-colors">Aide</a>
              <a href="#" className="hover:text-blue-300 transition-colors">Contact</a>
              <a href="#" className="hover:text-blue-300 transition-colors">Conditions d'utilisation</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
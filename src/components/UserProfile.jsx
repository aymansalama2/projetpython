import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function UserProfile() {
  const [activeTab, setActiveTab] = useState('reservations');
  
  // Données utilisateur factices - dans une application réelle, ces données viendraient d'un API
  const user = {
    id: 1,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '06 12 34 56 78',
    address: '123 Avenue des Champs-Élysées',
    postalCode: '75008',
    city: 'Paris',
    profilePicture: null,
    memberSince: '2022-05-15'
  };
  
  // Réservations factices
  const reservations = [
    {
      id: 'RES-123456',
      from: 'Paris',
      to: 'Lyon',
      departureDate: '2023-11-25',
      departureTime: '10:30',
      arrivalTime: '12:45',
      status: 'upcoming',
      price: 29.50,
      passengers: 1,
      busType: 'Standard'
    },
    {
      id: 'RES-123123',
      from: 'Lyon',
      to: 'Marseille',
      departureDate: '2023-12-10',
      departureTime: '14:15',
      arrivalTime: '15:45',
      status: 'upcoming',
      price: 35.00,
      passengers: 2,
      busType: 'Confort'
    },
    {
      id: 'RES-121212',
      from: 'Marseille',
      to: 'Paris',
      departureDate: '2023-09-15',
      departureTime: '08:45',
      arrivalTime: '12:30',
      status: 'completed',
      price: 49.00,
      passengers: 1,
      busType: 'Premium'
    }
  ];
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  const handleLogout = () => {
    console.log('Déconnexion...');
    // Logique de déconnexion à implémenter
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              BusBooking
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link to="/schedule-search" className="text-gray-600 hover:text-blue-600 transition-colors">
                Rechercher
              </Link>
              <div className="relative">
                <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <span className="mr-2">{user.firstName}</span>
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mon profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles et vos réservations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-md h-fit"
          >
            <div className="text-center mb-6">
              <div className="h-24 w-24 rounded-full bg-blue-100 mx-auto flex items-center justify-center text-blue-600 text-3xl font-semibold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <h2 className="text-xl font-bold mt-4">{user.firstName} {user.lastName}</h2>
              <p className="text-sm text-gray-500">Membre depuis {formatDate(user.memberSince)}</p>
            </div>
            
            <div className="space-y-1 mb-6">
              <button 
                onClick={() => setActiveTab('reservations')} 
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'reservations' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Mes réservations
              </button>
              <button 
                onClick={() => setActiveTab('personal')} 
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'personal' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Informations personnelles
              </button>
              <button 
                onClick={() => setActiveTab('password')} 
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'password' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Modifier mot de passe
              </button>
              <button 
                onClick={() => setActiveTab('preferences')} 
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'preferences' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Préférences
              </button>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Se déconnecter
            </button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-3"
          >
            {activeTab === 'reservations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Mes réservations</h2>
                  <Link to="/schedule-search" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Nouvelle réservation
                  </Link>
                </div>
                
                {reservations.length > 0 ? (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl overflow-hidden shadow-md">
                      <div className="border-b border-gray-200">
                        <div className="flex">
                          <button 
                            className="px-6 py-3 font-medium text-blue-600 border-b-2 border-blue-600"
                          >
                            À venir
                          </button>
                          <button 
                            className="px-6 py-3 font-medium text-gray-600 hover:text-blue-500"
                          >
                            Historique
                          </button>
                        </div>
                      </div>
                      
                      <div className="divide-y divide-gray-100">
                        {reservations
                          .filter(res => res.status === 'upcoming')
                          .map(reservation => (
                            <div key={reservation.id} className="p-6">
                              <div className="flex flex-wrap justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center mb-1">
                                    <span className="font-bold text-lg">{reservation.from} → {reservation.to}</span>
                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                      Confirmé
                                    </span>
                                  </div>
                                  <div className="text-gray-600">{formatDate(reservation.departureDate)} • {reservation.departureTime} - {reservation.arrivalTime}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-gray-500">Réservation #{reservation.id}</div>
                                  <div className="font-bold text-xl text-blue-600">{reservation.price.toFixed(2)}€</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <div className="text-sm text-gray-500">Passagers</div>
                                  <div className="font-medium">{reservation.passengers} {reservation.passengers > 1 ? 'personnes' : 'personne'}</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <div className="text-sm text-gray-500">Type de bus</div>
                                  <div className="font-medium">{reservation.busType}</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <div className="text-sm text-gray-500">E-billet</div>
                                  <div className="font-medium text-blue-600 cursor-pointer">Télécharger</div>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-3 mt-4">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                  Voir les détails
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="bg-white border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  Annuler
                                </motion.button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-8 shadow-md text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">Aucune réservation</h3>
                    <p className="text-gray-600 mb-6">
                      Vous n'avez pas encore de réservation. Commencez par rechercher un trajet.
                    </p>
                    <Link to="/schedule-search" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                      Rechercher un trajet
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'personal' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations personnelles</h2>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                        <input
                          id="firstName"
                          type="text"
                          defaultValue={user.firstName}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          id="lastName"
                          type="text"
                          defaultValue={user.lastName}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input
                        id="phone"
                        type="tel"
                        defaultValue={user.phone}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                      <input
                        id="address"
                        type="text"
                        defaultValue={user.address}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                        <input
                          id="postalCode"
                          type="text"
                          defaultValue={user.postalCode}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                        <input
                          id="city"
                          type="text"
                          defaultValue={user.city}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Enregistrer les modifications
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {activeTab === 'password' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Modifier le mot de passe</h2>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <form className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                      <input
                        id="currentPassword"
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                      <input
                        id="newPassword"
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                      <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères, dont une majuscule et un chiffre</p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mettre à jour le mot de passe
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Préférences</h2>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label htmlFor="emailNotif" className="text-gray-700">Notifications par email</label>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                            <input
                              id="emailNotif"
                              type="checkbox"
                              className="absolute w-6 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer focus:outline-none appearance-none checked:bg-blue-600 checked:translate-x-6 bg-gray-300"
                              defaultChecked
                            />
                            <label
                              htmlFor="emailNotif"
                              className="block h-6 overflow-hidden rounded-full cursor-pointer bg-gray-200"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label htmlFor="smsNotif" className="text-gray-700">Notifications par SMS</label>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                            <input
                              id="smsNotif"
                              type="checkbox"
                              className="absolute w-6 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer focus:outline-none appearance-none checked:bg-blue-600 checked:translate-x-6 bg-gray-300"
                            />
                            <label
                              htmlFor="smsNotif"
                              className="block h-6 overflow-hidden rounded-full cursor-pointer bg-gray-200"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label htmlFor="promoNotif" className="text-gray-700">Offres promotionnelles</label>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                            <input
                              id="promoNotif"
                              type="checkbox"
                              className="absolute w-6 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer focus:outline-none appearance-none checked:bg-blue-600 checked:translate-x-6 bg-gray-300"
                              defaultChecked
                            />
                            <label
                              htmlFor="promoNotif"
                              className="block h-6 overflow-hidden rounded-full cursor-pointer bg-gray-200"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Préférences de voyage</h3>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="prefBusType" className="block text-sm font-medium text-gray-700 mb-1">Type de bus préféré</label>
                          <select
                            id="prefBusType"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            defaultValue="standard"
                          >
                            <option value="standard">Standard</option>
                            <option value="comfort">Confort</option>
                            <option value="premium">Premium</option>
                            <option value="any">Tous types</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="prefSeatPosition" className="block text-sm font-medium text-gray-700 mb-1">Position de siège préférée</label>
                          <select
                            id="prefSeatPosition"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            defaultValue="window"
                          >
                            <option value="window">Fenêtre</option>
                            <option value="aisle">Couloir</option>
                            <option value="any">Indifférent</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Enregistrer les préférences
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white p-6 mt-12">
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
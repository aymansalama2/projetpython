import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getReservations, getUserProfile, reservationService } from '../services/api';

export function UserDashboard() {
    const { darkMode } = useTheme();
    const [reservations, setReservations] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeReservation, setActiveReservation] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reservationsData, profileData] = await Promise.all([
                    getReservations(),
                    getUserProfile()
                ]);

                console.log("Réservations récupérées:", reservationsData);
                // Assurez-vous d'accéder correctement aux données selon la structure de la réponse API
                setReservations(Array.isArray(reservationsData) ? reservationsData : reservationsData?.data || []);
                setUserProfile(profileData || null);
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCancelReservation = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
            try {
                setLoading(true);
                await reservationService.cancel(id);
                
                // Mettre à jour l'état local
                setReservations(reservations.map(res => 
                    res.id === id ? {...res, status: 'cancelled'} : res
                ));
            } catch (err) {
                setError('Erreur lors de l\'annulation de la réservation');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const viewReservationDetails = (reservation) => {
        setActiveReservation(reservation);
        setShowDetails(true);
    };

    const closeDetails = () => {
        setShowDetails(false);
        setActiveReservation(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return darkMode 
                    ? 'bg-green-800 text-green-100' 
                    : 'bg-green-100 text-green-800';
            case 'pending':
                return darkMode 
                    ? 'bg-yellow-800 text-yellow-100' 
                    : 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return darkMode 
                    ? 'bg-red-800 text-red-100' 
                    : 'bg-red-100 text-red-800';
            default:
                return darkMode 
                    ? 'bg-gray-700 text-gray-100' 
                    : 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmée';
            case 'pending':
                return 'En attente';
            case 'cancelled':
                return 'Annulée';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <header className={`${darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow'}`}>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Mon Tableau de Bord
                        </h1>
                        <button
                            onClick={handleLogout}
                            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* User Profile Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg mb-8`}
                >
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Informations Personnelles
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Nom Complet</p>
                                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{userProfile?.full_name || 'Non spécifié'}</p>
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Email</p>
                                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{userProfile?.user?.email || 'Non spécifié'}</p>
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Téléphone</p>
                                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{userProfile?.phone || 'Non spécifié'}</p>
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Adresse</p>
                                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{userProfile?.address || 'Non spécifié'}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link
                                to="/profile/edit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Modifier le Profil
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Reservations Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg`}
                >
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Mes Réservations
                            </h2>
                            <Link
                                to="/reservations/new"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Nouvelle Réservation
                            </Link>
                        </div>
                        {reservations.length === 0 ? (
                            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0h10a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <p className="text-lg">Vous n'avez pas encore de réservations</p>
                                <p className="mt-2">Commencez par réserver votre premier voyage</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reservations.map((reservation) => (
                                    <motion.div
                                        key={reservation.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className={`border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden`}
                                    >
                                        <div className={`px-4 py-4 sm:px-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex justify-between items-center`}>
                                            <div className="flex items-center space-x-3">
                                                <div>
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                                                        {getStatusText(reservation.status)}
                                                    </span>
                                                </div>
                                                <div className={`${darkMode ? 'text-white' : 'text-gray-900'} text-sm font-medium`}>
                                                    Réservation #{reservation.id}
                                                </div>
                                            </div>
                                            <div className="text-sm">
                                                <button
                                                    onClick={() => viewReservationDetails(reservation)}
                                                    className={`font-medium text-blue-600 hover:text-blue-500 mr-4`}
                                                >
                                                    Détails
                                                </button>
                                                {reservation.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleCancelReservation(reservation.id)}
                                                        className="font-medium text-red-600 hover:text-red-500"
                                                    >
                                                        Annuler
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`px-4 py-5 sm:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <div className="mb-4 sm:mb-0">
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {reservation.schedule?.departure_location?.city || 'N/A'}
                                                        </span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                        <span className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {reservation.schedule?.arrival_location?.city || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
                                                        Départ: {reservation.schedule?.departure_time ? new Date(reservation.schedule.departure_time).toLocaleString() : 'N/A'}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-blue-600">
                                                        {reservation.total_price} €
                                                    </div>
                                                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                                        {reservation.number_of_seats} {reservation.number_of_seats > 1 ? 'places' : 'place'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>

            {/* Modal de détails de réservation */}
            {showDetails && activeReservation && (
                <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={closeDetails}></div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`relative rounded-lg p-6 max-w-2xl w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
                    >
                        <div className="absolute top-0 right-0 pt-4 pr-4">
                            <button
                                onClick={closeDetails}
                                className={`rounded-md ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-500'} focus:outline-none`}
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                            Détails de la réservation #{activeReservation.id}
                        </h3>
                        
                        <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} mb-4`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Informations de voyage</h4>
                                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="font-medium">Itinéraire:</span> {activeReservation.schedule?.departure_location?.city || 'N/A'} → {activeReservation.schedule?.arrival_location?.city || 'N/A'}
                                    </p>
                                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
                                        <span className="font-medium">Départ:</span> {activeReservation.schedule?.departure_time ? new Date(activeReservation.schedule.departure_time).toLocaleString() : 'N/A'}
                                    </p>
                                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
                                        <span className="font-medium">Arrivée:</span> {activeReservation.schedule?.arrival_time ? new Date(activeReservation.schedule.arrival_time).toLocaleString() : 'N/A'}
                                    </p>
                                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
                                        <span className="font-medium">Bus:</span> {activeReservation.schedule?.bus?.model} - {activeReservation.schedule?.bus?.plate_number}
                                    </p>
                                </div>
                                <div>
                                    <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Informations de réservation</h4>
                                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="font-medium">Statut:</span> {getStatusText(activeReservation.status)}
                                    </p>
                                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
                                        <span className="font-medium">Date de réservation:</span> {new Date(activeReservation.created_at).toLocaleDateString()}
                                    </p>
                                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
                                        <span className="font-medium">Nombre de places:</span> {activeReservation.number_of_seats}
                                    </p>
                                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'} mt-1`}>
                                        <span className="font-medium">Prix total:</span> {activeReservation.total_price} €
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {activeReservation.special_requests && (
                            <div className={`mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Demandes spéciales</h4>
                                <p className="text-sm">{activeReservation.special_requests}</p>
                            </div>
                        )}
                        
                        <div className="flex justify-end mt-4 space-x-3">
                            <button
                                onClick={closeDetails}
                                className={`px-4 py-2 border rounded-md text-sm font-medium ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                            >
                                Fermer
                            </button>
                            
                            {activeReservation.status === 'confirmed' && (
                                <button
                                    onClick={() => {
                                        handleCancelReservation(activeReservation.id);
                                        closeDetails();
                                    }}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                >
                                    Annuler la réservation
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
} 
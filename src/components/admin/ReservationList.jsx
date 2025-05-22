import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { reservationService } from '../../services/api';

export function ReservationList() {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({
        status: '',
        searchTerm: '',
    });
    const [activeReservation, setActiveReservation] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const { darkMode } = useTheme();

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const data = await reservationService.getAll();
            setReservations(data);
            setFilteredReservations(data);
        } catch (err) {
            setError('Erreur lors du chargement des réservations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [filter, reservations]);

    const applyFilters = () => {
        let filtered = [...reservations];
        
        // Filtrer par statut
        if (filter.status) {
            filtered = filtered.filter(res => res.status === filter.status);
        }
        
        // Filtrer par terme de recherche (nom client, ville de départ/arrivée)
        if (filter.searchTerm) {
            const searchLower = filter.searchTerm.toLowerCase();
            filtered = filtered.filter(res => 
                (res.user?.full_name?.toLowerCase().includes(searchLower)) ||
                (res.schedule?.departure_location?.city?.toLowerCase().includes(searchLower)) ||
                (res.schedule?.arrival_location?.city?.toLowerCase().includes(searchLower))
            );
        }
        
        setFilteredReservations(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
            try {
                await reservationService.delete(id);
                setReservations(reservations.filter(reservation => reservation.id !== id));
                if (showDetails && activeReservation?.id === id) {
                    setShowDetails(false);
                    setActiveReservation(null);
                }
            } catch (err) {
                setError('Erreur lors de la suppression de la réservation');
                console.error(err);
            }
        }
    };

    const handleCancelReservation = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
            try {
                setLoading(true);
                await reservationService.cancel(id);
                
                // Mettre à jour l'état local
                const updatedReservations = reservations.map(res => 
                    res.id === id ? {...res, status: 'cancelled'} : res
                );
                setReservations(updatedReservations);
                
                if (activeReservation && activeReservation.id === id) {
                    setActiveReservation({...activeReservation, status: 'cancelled'});
                }
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

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const getStatusBadgeClass = (status) => {
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
                            Gestion des Réservations
                        </h1>
                        <Link
                            to="/admin/reservations/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Ajouter une Réservation
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Filtres */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg mb-6 p-4`}
                >
                    <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Filtrer les réservations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                Recherche
                            </label>
                            <input
                                type="text"
                                name="searchTerm"
                                value={filter.searchTerm}
                                onChange={handleFilterChange}
                                placeholder="Nom client, ville..."
                                className={`block w-full py-2 px-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300 text-gray-900'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                Statut
                            </label>
                            <select
                                name="status"
                                value={filter.status}
                                onChange={handleFilterChange}
                                className={`block w-full py-2 px-3 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'border-gray-300 text-gray-900'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                            >
                                <option value="">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="confirmed">Confirmée</option>
                                <option value="cancelled">Annulée</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {filteredReservations.length} réservation(s) trouvée(s)
                        </div>
                        <button
                            onClick={() => setFilter({ status: '', searchTerm: '' })}
                            className={`px-3 py-1 text-sm border rounded-md ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                </motion.div>

                {/* Liste des réservations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg`}
                >
                    <div className="px-4 py-5 sm:p-6">
                        {filteredReservations.length === 0 ? (
                            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0h10a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <p className="text-lg">Aucune réservation trouvée</p>
                                <p className="mt-2">Modifiez vos filtres ou créez une nouvelle réservation</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className={`min-w-full ${darkMode ? 'text-white' : ''}`}>
                                    <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <tr>
                                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                                ID
                                            </th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                                Client
                                            </th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                                Trajet
                                            </th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                                Date
                                            </th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                                Statut
                                            </th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className={`${darkMode ? 'divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
                                        {filteredReservations.map((reservation) => (
                                            <motion.tr
                                                key={reservation.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'hover:bg-gray-50'}
                                            >
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                    {reservation.id}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                    {reservation.user?.full_name || 'N/A'}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                    {reservation.schedule?.departure_location?.city || 'N/A'} → {reservation.schedule?.arrival_location?.city || 'N/A'}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                                    {reservation.schedule?.departure_time ? formatDate(reservation.schedule.departure_time) : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(reservation.status)}`}>
                                                        {getStatusText(reservation.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => viewReservationDetails(reservation)}
                                                        className="text-blue-600 hover:text-blue-500 mr-3"
                                                    >
                                                        Détails
                                                    </button>
                                                    <Link
                                                        to={`/admin/reservations/${reservation.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-500 mr-3"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    {reservation.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => handleCancelReservation(reservation.id)}
                                                            className="text-yellow-600 hover:text-yellow-500 mr-3"
                                                        >
                                                            Annuler
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(reservation.id)}
                                                        className="text-red-600 hover:text-red-500"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
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
                        className={`relative rounded-lg p-6 max-w-3xl w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
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
                        
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Détails de la réservation #{activeReservation.id}
                            </h3>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(activeReservation.status)}`}>
                                {getStatusText(activeReservation.status)}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                                <h4 className={`font-medium text-lg ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>Informations client</h4>
                                <div className="space-y-2">
                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="font-medium">Nom:</span> {activeReservation.user?.full_name || 'N/A'}
                                    </p>
                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="font-medium">Email:</span> {activeReservation.user?.email || 'N/A'}
                                    </p>
                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="font-medium">Téléphone:</span> {activeReservation.user?.phone || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                                <h4 className={`font-medium text-lg ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>Détails de la réservation</h4>
                                <div className="space-y-2">
                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="font-medium">Date de réservation:</span> {formatDate(activeReservation.created_at)}
                                    </p>
                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="font-medium">Nombre de places:</span> {activeReservation.number_of_seats}
                                    </p>
                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="font-medium">Prix total:</span> {activeReservation.total_price} €
                                    </p>
                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="font-medium">Méthode de paiement:</span> {activeReservation.special_requests?.includes('Méthode de paiement') ? activeReservation.special_requests.split(':')[1].trim() : 'Non spécifiée'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'} mt-4`}>
                            <h4 className={`font-medium text-lg ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>Informations de voyage</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="font-medium">Trajet:</span> {activeReservation.schedule?.departure_location?.city || 'N/A'} → {activeReservation.schedule?.arrival_location?.city || 'N/A'}
                                    </p>
                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                                        <span className="font-medium">Date et heure de départ:</span> {activeReservation.schedule?.departure_time ? formatDate(activeReservation.schedule.departure_time) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="font-medium">Bus:</span> {activeReservation.schedule?.bus?.model} - {activeReservation.schedule?.bus?.plate_number}
                                    </p>
                                    <p className={`${darkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
                                        <span className="font-medium">Date et heure d'arrivée:</span> {activeReservation.schedule?.arrival_time ? formatDate(activeReservation.schedule.arrival_time) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {activeReservation.special_requests && !activeReservation.special_requests.includes('Méthode de paiement') && (
                            <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mt-4`}>
                                <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Demandes spéciales</h4>
                                <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{activeReservation.special_requests}</p>
                            </div>
                        )}
                        
                        <div className="flex justify-end mt-6 space-x-3">
                            <button
                                onClick={closeDetails}
                                className={`px-4 py-2 border rounded-md text-sm font-medium ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                            >
                                Fermer
                            </button>
                            
                            <Link
                                to={`/admin/reservations/${activeReservation.id}/edit`}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Modifier
                            </Link>
                            
                            {activeReservation.status === 'confirmed' && (
                                <button
                                    onClick={() => {
                                        handleCancelReservation(activeReservation.id);
                                    }}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                                >
                                    Annuler
                                </button>
                            )}
                            
                            <button
                                onClick={() => {
                                    handleDelete(activeReservation.id);
                                    closeDetails();
                                }}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                            >
                                Supprimer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
} 
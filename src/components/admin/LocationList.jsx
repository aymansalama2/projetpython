import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { locationService } from '../../services/api';

export function LocationList() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { darkMode } = useTheme();

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const data = await locationService.getAll();
            setLocations(data);
        } catch (err) {
            setError('Erreur lors du chargement des locations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette location ?')) {
            try {
                await locationService.delete(id);
                setLocations(locations.filter(location => location.id !== id));
            } catch (err) {
                setError('Erreur lors de la suppression de la location');
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-dark-200' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-dark-200' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-dark-200' : 'bg-gray-50'} transition-colors duration-300`}>
            {/* Header */}
            <header className={`${darkMode ? 'bg-dark-100' : 'bg-white'} shadow transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Gestion des Locations
                        </h1>
                        <Link
                            to="/admin/locations/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Ajouter une Location
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${darkMode ? 'bg-dark-100 border-gray-700' : 'bg-white border-gray-200'} shadow rounded-lg border transition-colors duration-300`}
                >
                    <div className="px-4 py-5 sm:p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                            ID
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Ville
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Adresse
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Code Postal
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className={`${darkMode ? 'bg-dark-100 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                                    {locations.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className={`px-6 py-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                                Aucune location trouvée
                                            </td>
                                        </tr>
                                    ) : (
                                        locations.map((location) => (
                                            <motion.tr
                                                key={location.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className={`hover:${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-150`}
                                            >
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                    {location.id}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                    {location.city}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                    {location.address}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                    {location.postal_code}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex space-x-3`}>
                                                    <Link
                                                        to={`/admin/locations/${location.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(location.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
} 
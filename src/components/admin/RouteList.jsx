import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { searchService } from '../../services/api';

export const RouteList = () => {
  const { darkMode } = useTheme();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await searchService.getAllRoutes();
      setRoutes(data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des itinéraires', err);
      setError('Erreur lors du chargement des itinéraires');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet itinéraire ?')) {
      try {
        await searchService.deleteRoute(id);
        setRoutes(routes.filter(route => route.id !== id));
      } catch (err) {
        console.error('Erreur lors de la suppression', err);
        setError('Erreur lors de la suppression de l\'itinéraire');
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Itinéraires</h1>
          <Link
            to="/admin/routes/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Ajouter un itinéraire
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {routes.length === 0 && !loading && !error && (
          <div className={`text-center py-10 ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-500'} shadow rounded-lg`}>
            <p className="text-lg">Aucun itinéraire trouvé</p>
            <p className="mt-2">Commencez par en ajouter un nouveau</p>
          </div>
        )}

        {routes.length > 0 && (
          <div className={`bg-white shadow overflow-hidden rounded-md ${darkMode ? 'bg-gray-800' : ''}`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    Nom
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    Trajet
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    Distance
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    Durée
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    Prix
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {routes.map((route) => (
                  <tr key={route.id}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {route.name}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {route.departure_location_detail?.city} → {route.arrival_location_detail?.city}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {route.distance} km
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {Math.floor(route.duration / 60)}h{route.duration % 60 > 0 ? `${route.duration % 60}min` : ''}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {route.price}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <Link 
                          to={`/admin/routes/${route.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </Link>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(route.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}; 
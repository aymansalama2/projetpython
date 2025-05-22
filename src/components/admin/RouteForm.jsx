import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { searchService, locationService } from '../../services/api';

export const RouteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    departure_location: '',
    arrival_location: '',
    distance: '',
    duration: '',
    price: ''
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    fetchLocations();
    if (isEditMode) {
      fetchRouteData();
    }
  }, [id]);

  const fetchLocations = async () => {
    try {
      const data = await locationService.getAll();
      setLocations(data);
    } catch (err) {
      console.error('Erreur lors du chargement des emplacements', err);
    }
  };

  const fetchRouteData = async () => {
    try {
      setLoading(true);
      const routeData = await searchService.getRouteById(id);
      setFormData(routeData);
    } catch (err) {
      setError("Erreur lors du chargement des données de l'itinéraire");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Le nom de l'itinéraire est requis");
      return false;
    }

    if (!formData.departure_location) {
      setError("Le lieu de départ est requis");
      return false;
    }

    if (!formData.arrival_location) {
      setError("Le lieu d'arrivée est requis");
      return false;
    }

    if (formData.departure_location === formData.arrival_location) {
      setError("Le lieu de départ et d'arrivée doivent être différents");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      // Préparer les données à envoyer
      const routeData = {
        name: formData.name,
        departure_location: formData.departure_location,
        arrival_location: formData.arrival_location,
        distance: parseFloat(formData.distance),
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price)
      };

      if (isEditMode) {
        await searchService.updateRoute(id, routeData);
      } else {
        await searchService.createRoute(routeData);
      }
      navigate('/admin/routes');
    } catch (err) {
      setError("Erreur lors de l'enregistrement de l'itinéraire");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center`}>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold mb-6">{isEditMode ? "Modifier l'itinéraire" : "Ajouter un itinéraire"}</h1>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-6`}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Nom de l'itinéraire
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="Paris - Lyon"
                    value={formData.name}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="departure_location" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Lieu de départ
                </label>
                <div className="mt-1">
                  <select
                    name="departure_location"
                    id="departure_location"
                    required
                    value={formData.departure_location}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                    }`}
                  >
                    <option value="">Sélectionner un lieu</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>{location.city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="arrival_location" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Lieu d'arrivée
                </label>
                <div className="mt-1">
                  <select
                    name="arrival_location"
                    id="arrival_location"
                    required
                    value={formData.arrival_location}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                    }`}
                  >
                    <option value="">Sélectionner un lieu</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>{location.city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="distance" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Distance (km)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="distance"
                    id="distance"
                    min="1"
                    required
                    value={formData.distance}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="duration" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Durée (min)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="duration"
                    id="duration"
                    min="1"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="price" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Prix (€)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className={`sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      €
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/routes')}
                className={`py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Chargement...' : isEditMode ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { scheduleService, locationService, busService } from '../../services/api';

export const ScheduleForm = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    departure_location: '',
    arrival_location: '',
    bus: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    available_seats: ''
  });
  
  const [buses, setBuses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isEditMode = Boolean(id);

  useEffect(() => {
    fetchData();
    if (isEditMode) {
      fetchScheduleData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [busesData, locationsData] = await Promise.all([
        busService.getAll(),
        locationService.getAll()
      ]);
      setBuses(busesData);
      setLocations(locationsData);
    } catch (err) {
      console.error('Erreur lors du chargement des données', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getById(id);
      
      // Format dates for datetime-local input
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
      };
      
      setFormData({
        departure_location: data.departure_location.id,
        arrival_location: data.arrival_location.id,
        bus: data.bus.id,
        departure_time: formatDate(data.departure_time),
        arrival_time: formatDate(data.arrival_time),
        price: data.price,
        available_seats: data.available_seats
      });
    } catch (err) {
      console.error('Erreur lors du chargement des données de l\'horaire', err);
      setError('Erreur lors du chargement des données de l\'horaire');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation de base
    if (formData.departure_location === formData.arrival_location) {
      setError("Les lieux de départ et d'arrivée ne peuvent pas être identiques");
      return;
    }
    
    const departureTime = new Date(formData.departure_time);
    const arrivalTime = new Date(formData.arrival_time);
    
    if (arrivalTime <= departureTime) {
      setError("L'heure d'arrivée doit être après l'heure de départ");
      return;
    }
    
    if (parseFloat(formData.price) <= 0) {
      setError("Le prix doit être supérieur à 0");
      return;
    }
    
    if (parseInt(formData.available_seats, 10) <= 0) {
      setError("Le nombre de sièges disponibles doit être supérieur à 0");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const scheduleData = {
        departure_location_id: parseInt(formData.departure_location, 10),
        arrival_location_id: parseInt(formData.arrival_location, 10),
        bus_id: parseInt(formData.bus, 10),
        departure_time: new Date(formData.departure_time).toISOString(),
        arrival_time: new Date(formData.arrival_time).toISOString(),
        price: parseFloat(formData.price),
        available_seats: parseInt(formData.available_seats, 10)
      };
      
      // Essayons un format alternatif si le premier échoue
      const alternateData = {
        departure_location: parseInt(formData.departure_location, 10),
        arrival_location: parseInt(formData.arrival_location, 10),
        bus: parseInt(formData.bus, 10),
        departure_time: new Date(formData.departure_time).toISOString(),
        arrival_time: new Date(formData.arrival_time).toISOString(),
        price: parseFloat(formData.price),
        available_seats: parseInt(formData.available_seats, 10)
      };
      
      console.log("Tentative d'envoi des données:", alternateData);
      
      if (isEditMode) {
        await scheduleService.update(id, alternateData);
      } else {
        await scheduleService.create(alternateData);
      }
      
      navigate('/admin/schedules');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'horaire', err);
      if (err.response && err.response.data) {
        console.log("Détails de l'erreur:", err.response.data);
        
        // Afficher un message d'erreur plus détaillé si disponible
        if (typeof err.response.data === 'object') {
          const errorMessages = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
          setError(errorMessages || 'Une erreur est survenue lors de l\'enregistrement');
        } else {
          setError(err.response.data || 'Une erreur est survenue lors de l\'enregistrement');
        }
      } else {
        setError('Une erreur est survenue lors de l\'enregistrement');
      }
    } finally {
      setLoading(false);
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
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold mb-6">{isEditMode ? 'Modifier l\'horaire' : 'Créer un nouvel horaire'}</h1>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className={`bg-white shadow rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
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
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
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
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  >
                    <option value="">Sélectionner un lieu</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>{location.city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="bus" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Bus
                </label>
                <div className="mt-1">
                  <select
                    name="bus"
                    id="bus"
                    required
                    value={formData.bus}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  >
                    <option value="">Sélectionner un bus</option>
                    {buses.map(bus => (
                      <option key={bus.id} value={bus.id}>{bus.model} - {bus.plate_number}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="price" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Prix (€)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="departure_time" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Heure de départ
                </label>
                <div className="mt-1">
                  <input
                    type="datetime-local"
                    name="departure_time"
                    id="departure_time"
                    required
                    value={formData.departure_time}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="arrival_time" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Heure d'arrivée
                </label>
                <div className="mt-1">
                  <input
                    type="datetime-local"
                    name="arrival_time"
                    id="arrival_time"
                    required
                    value={formData.arrival_time}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="available_seats" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Sièges disponibles
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="available_seats"
                    id="available_seats"
                    required
                    min="1"
                    value={formData.available_seats}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/schedules')}
                className={`py-2 px-4 border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Chargement...' : isEditMode ? 'Mettre à jour' : 'Enregistrer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 
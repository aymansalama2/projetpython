import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { busService } from '../../services/api';

export const BusForm = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    plate_number: '',
    model: '',
    capacity: ''
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      fetchBusData();
    }
  }, [id]);

  const fetchBusData = async () => {
    try {
      setLoading(true);
      const data = await busService.getById(id);
      setFormData({
        plate_number: data.plate_number,
        model: data.model,
        capacity: data.capacity
      });
    } catch (err) {
      console.error('Erreur lors du chargement des données du bus', err);
      setError('Erreur lors du chargement des données du bus');
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
    
    try {
      setLoading(true);
      setError(null);
      
      const busData = {
        plate_number: formData.plate_number,
        model: formData.model,
        capacity: parseInt(formData.capacity, 10)
      };
      
      if (isEditMode) {
        await busService.update(id, busData);
      } else {
        await busService.create(busData);
      }
      
      navigate('/admin/buses');
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du bus', err);
      setError(err.response?.data?.detail || 'Une erreur est survenue lors de l\'enregistrement');
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
        <h1 className="text-2xl font-semibold mb-6">{isEditMode ? 'Modifier le bus' : 'Ajouter un nouveau bus'}</h1>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className={`bg-white shadow rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="plate_number" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Numéro d'immatriculation
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="plate_number"
                    id="plate_number"
                    required
                    value={formData.plate_number}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="model" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Modèle
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="model"
                    id="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="capacity" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Capacité
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="capacity"
                    id="capacity"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/buses')}
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
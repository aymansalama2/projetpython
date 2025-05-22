import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { locationService } from '../../services/api';

export function LocationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const location = useLocation();
  
  // Logs de débogage
  console.log('LocationForm - Rendering');
  console.log('LocationForm - URL path:', location.pathname);
  console.log('LocationForm - ID param:', id);
  console.log('LocationForm - isEditing:', !!id);
  
  const [formData, setFormData] = useState({
    city: '',
    address: '',
    postal_code: '',
    country: 'France',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchLocation();
    }
  }, [id]);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      const data = await locationService.getById(id);
      setFormData({
        city: data.city || '',
        address: data.address || '',
        postal_code: data.postal_code || '',
        country: data.country || 'France',
        is_active: data.is_active !== undefined ? data.is_active : true
      });
    } catch (err) {
      setError('Erreur lors du chargement des données de la location');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing) {
        await locationService.update(id, formData);
      } else {
        await locationService.create(formData);
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/locations');
      }, 1500);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de la location');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark-200' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-200' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-dark-100' : 'bg-white'} shadow transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link 
              to="/admin/locations"
              className={`mr-4 flex items-center text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </Link>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {isEditing ? 'Modifier la Location' : 'Ajouter une Location'}
            </h1>
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
            {error && (
              <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
                <p>Location {isEditing ? 'modifiée' : 'ajoutée'} avec succès!</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="city" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } shadow-sm transition-colors duration-300`}
                />
              </div>
              
              <div>
                <label htmlFor="address" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } shadow-sm transition-colors duration-300`}
                />
              </div>
              
              <div>
                <label htmlFor="postal_code" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Code Postal
                </label>
                <input
                  type="text"
                  name="postal_code"
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } shadow-sm transition-colors duration-300`}
                />
              </div>
              
              <div>
                <label htmlFor="country" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Pays
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full rounded-md ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  } shadow-sm transition-colors duration-300`}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className={`h-4 w-4 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500' 
                      : 'border-gray-300 text-blue-600 focus:ring-blue-500'
                  } rounded transition-colors duration-300`}
                />
                <label htmlFor="is_active" className={`ml-2 block text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Actif
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/locations')}
                  className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } transition-colors duration-300`}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enregistrement...
                    </span>
                    : (isEditing ? 'Mettre à jour' : 'Enregistrer')
                  }
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 
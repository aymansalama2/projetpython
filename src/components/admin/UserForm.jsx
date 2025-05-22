import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { userService } from '../../services/api';

export const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    is_admin: false,
    is_staff: false,
    is_active: true,
    password: '',
    confirm_password: ''
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      fetchUserData();
    }
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = await userService.getById(id);
      setFormData({
        ...userData,
        password: '',
        confirm_password: ''
      });
    } catch (err) {
      setError("Erreur lors du chargement des données de l'utilisateur");
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

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Le nom d'utilisateur est requis");
      return false;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email invalide");
      return false;
    }

    if (!isEditMode && formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    if (!isEditMode && formData.password !== formData.confirm_password) {
      setError("Les mots de passe ne correspondent pas");
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
      
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
        delete dataToSubmit.confirm_password;
      }

      if (isEditMode) {
        await userService.update(id, dataToSubmit);
      } else {
        await userService.create(dataToSubmit);
      }

      navigate('/admin/users');
    } catch (err) {
      setError("Erreur lors de l'enregistrement de l'utilisateur");
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
        <h1 className="text-2xl font-semibold mb-6">{isEditMode ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h1>
        
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-6`}>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="username" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Nom d'utilisateur
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="first_name" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Prénom
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="last_name" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Nom
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                    }`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Téléphone
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                    }`}
                  />
                </div>
              </div>

              {!isEditMode && (
                <>
                  <div>
                    <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Mot de passe
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required={!isEditMode}
                        value={formData.password}
                        onChange={handleChange}
                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm_password" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Confirmer le mot de passe
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="confirm_password"
                        id="confirm_password"
                        required={!isEditMode}
                        value={formData.confirm_password}
                        onChange={handleChange}
                        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                        }`}
                      />
                    </div>
                  </div>
                </>
              )}

              {isEditMode && (
                <div className="sm:col-span-2">
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>
                    Laissez les champs de mot de passe vides si vous ne souhaitez pas le modifier
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Nouveau mot de passe
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                            darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirm_password" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="confirm_password"
                          id="confirm_password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                            darkMode ? 'bg-gray-700 text-white border-gray-600' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="sm:col-span-2">
                <div className="flex items-center mt-4">
                  <input
                    id="is_admin"
                    name="is_admin"
                    type="checkbox"
                    checked={formData.is_admin}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_admin" className={`ml-2 block text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Admin
                  </label>
                </div>

                <div className="flex items-center mt-2">
                  <input
                    id="is_staff"
                    name="is_staff"
                    type="checkbox"
                    checked={formData.is_staff}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_staff" className={`ml-2 block text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Staff
                  </label>
                </div>

                <div className="flex items-center mt-2">
                  <input
                    id="is_active"
                    name="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className={`ml-2 block text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Actif
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
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
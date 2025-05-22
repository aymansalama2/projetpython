import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Settings = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    companyName: 'BusBooking',
    contactEmail: 'contact@busbooking.com',
    contactPhone: '+33 1 23 45 67 89',
    address: '123 Avenue des Champs-Élysées, Paris',
    reservationFee: '2.50',
    currencySymbol: '€',
    emailNotifications: true,
    smsNotifications: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Paramètres sauvegardés avec succès');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold mb-6">Paramètres</h1>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-6 mb-6`}>
          <h2 className="text-lg font-medium mb-4">Paramètres généraux</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Nom de l'entreprise
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactEmail" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Email de contact
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="contactEmail"
                    id="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contactPhone" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Téléphone de contact
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="contactPhone"
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Adresse
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reservationFee" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Frais de réservation
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    name="reservationFee"
                    id="reservationFee"
                    step="0.01"
                    min="0"
                    value={formData.reservationFee}
                    onChange={handleChange}
                    className={`focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className={`sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formData.currencySymbol}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="currencySymbol" className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Symbole monétaire
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="currencySymbol"
                    id="currencySymbol"
                    value={formData.currencySymbol}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  />
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center">
                  <input
                    id="emailNotifications"
                    name="emailNotifications"
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className={`ml-2 block text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Activer les notifications par email
                  </label>
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center">
                  <input
                    id="smsNotifications"
                    name="smsNotifications"
                    type="checkbox"
                    checked={formData.smsNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotifications" className={`ml-2 block text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Activer les notifications par SMS
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enregistrer les paramètres
              </button>
            </div>
          </form>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-6`}>
          <h2 className="text-lg font-medium mb-4">Préférences d'affichage</h2>
          
          <div className="flex items-center justify-between py-4">
            <div>
              <h3 className="text-sm font-medium">Mode sombre</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Basculer entre les thèmes clair et sombre
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              } relative inline-flex items-center h-6 rounded-full w-11`}
            >
              <span className="sr-only">Activer le mode sombre</span>
              <span
                className={`${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
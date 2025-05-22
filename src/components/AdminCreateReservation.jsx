import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSchedules, createReservation } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AdminCreateReservation = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    user: '',
    number_of_seats: 1,
    special_requests: ''
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await getSchedules();
        setSchedules(response);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des horaires');
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!selectedSchedule) {
      setError('Veuillez sélectionner un horaire');
      return;
    }

    if (!formData.user) {
      setError('Veuillez sélectionner un utilisateur');
      return;
    }

    try {
      setLoading(true);
      await createReservation({
        ...formData,
        schedule: selectedSchedule.id
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/reservations');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la réservation');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Créer une réservation</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Utilisateur
          </label>
          <input
            type="text"
            name="user"
            value={formData.user}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ID de l'utilisateur"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horaire
          </label>
          <select
            value={selectedSchedule?.id || ''}
            onChange={(e) => {
              const schedule = schedules.find(s => s.id === parseInt(e.target.value));
              setSelectedSchedule(schedule);
            }}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Sélectionner un horaire</option>
            {schedules.map(schedule => (
              <option key={schedule.id} value={schedule.id}>
                {new Date(schedule.date).toLocaleDateString()} - {schedule.time}
              </option>
            ))}
          </select>
        </div>

        {selectedSchedule && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">Détails de l'horaire</h3>
            <p className="text-gray-600">
              Date: {new Date(selectedSchedule.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              Heure: {selectedSchedule.time}
            </p>
            <p className="text-gray-600">
              Places disponibles: {selectedSchedule.available_seats}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de places
          </label>
          <input
            type="number"
            name="number_of_seats"
            value={formData.number_of_seats}
            onChange={handleChange}
            min="1"
            max={selectedSchedule?.available_seats || 1}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Demandes spéciales
          </label>
          <textarea
            name="special_requests"
            value={formData.special_requests}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Demandes spéciales (optionnel)"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-500 p-4 rounded-lg">
            Réservation créée avec succès !
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/reservations')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer la réservation'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminCreateReservation; 
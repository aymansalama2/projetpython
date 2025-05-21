import React, { useState } from 'react';
import { createReservation } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ReservationForm = ({ schedule }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        number_of_seats: 1,
        special_requests: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createReservation({
                schedule: schedule.id,
                ...formData
            });
            navigate('/reservations');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la réservation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Réserver votre trajet</h2>
            
            <div className="mb-4">
                <h3 className="font-semibold">Détails du trajet</h3>
                <p>De: {schedule.departure_location.city}</p>
                <p>À: {schedule.arrival_location.city}</p>
                <p>Départ: {new Date(schedule.departure_time).toLocaleString()}</p>
                <p>Prix par place: {schedule.price} €</p>
                <p>Places disponibles: {schedule.available_seats}</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        Nombre de places
                    </label>
                    <input
                        type="number"
                        name="number_of_seats"
                        min="1"
                        max={schedule.available_seats}
                        value={formData.number_of_seats}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        Demandes spéciales
                    </label>
                    <textarea
                        name="special_requests"
                        value={formData.special_requests}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        rows="3"
                        placeholder="Ex: Besoin d'un siège pour enfant, allergies..."
                    />
                </div>

                {error && (
                    <div className="text-red-500 mb-4">
                        {error}
                    </div>
                )}

                <div className="text-right">
                    <p className="mb-2">
                        Total: {(schedule.price * formData.number_of_seats).toFixed(2)} €
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Réservation en cours...' : 'Confirmer la réservation'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReservationForm; 
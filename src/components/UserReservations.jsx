import React, { useState, useEffect } from 'react';
import { getUserReservations, cancelReservation } from '../services/api';

const UserReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await getUserReservations();
            setReservations(response.data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des réservations');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
            try {
                await cancelReservation(id);
                setReservations(prev => prev.filter(res => res.id !== id));
            } catch (err) {
                setError('Erreur lors de l\'annulation de la réservation');
            }
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Mes réservations</h2>

            {reservations.length === 0 ? (
                <p className="text-gray-600">Vous n'avez aucune réservation.</p>
            ) : (
                <div className="grid gap-4">
                    {reservations.map(reservation => (
                        <div key={reservation.id} className="border rounded p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">
                                        {reservation.schedule.departure_location.city} → {reservation.schedule.arrival_location.city}
                                    </h3>
                                    <p className="text-gray-600">
                                        Départ: {new Date(reservation.schedule.departure_time).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600">
                                        Arrivée: {new Date(reservation.schedule.arrival_time).toLocaleString()}
                                    </p>
                                    <p className="mt-2">
                                        Nombre de places: {reservation.number_of_seats}
                                    </p>
                                    {reservation.special_requests && (
                                        <p className="text-gray-600 mt-1">
                                            Demandes spéciales: {reservation.special_requests}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">
                                        Total: {(reservation.schedule.price * reservation.number_of_seats).toFixed(2)} €
                                    </p>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Statut: {reservation.status}
                                    </p>
                                    {reservation.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleCancelReservation(reservation.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserReservations; 
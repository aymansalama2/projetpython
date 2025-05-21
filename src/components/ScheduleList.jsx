import React, { useState, useEffect } from 'react';
import { getSchedules } from '../services/api';

const ScheduleList = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        departure: '',
        arrival: '',
        date: ''
    });

    useEffect(() => {
        fetchSchedules();
    }, [filters]);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const response = await getSchedules(filters);
            setSchedules(response.data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des horaires');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Rechercher un trajet</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        name="departure"
                        placeholder="Ville de départ"
                        value={filters.departure}
                        onChange={handleFilterChange}
                        className="border rounded p-2"
                    />
                    <input
                        type="text"
                        name="arrival"
                        placeholder="Ville d'arrivée"
                        value={filters.arrival}
                        onChange={handleFilterChange}
                        className="border rounded p-2"
                    />
                    <input
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                        className="border rounded p-2"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {schedules.map(schedule => (
                    <div key={schedule.id} className="border rounded p-4 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">
                                    {schedule.departure_location.city} → {schedule.arrival_location.city}
                                </h3>
                                <p className="text-gray-600">
                                    Départ: {new Date(schedule.departure_time).toLocaleString()}
                                </p>
                                <p className="text-gray-600">
                                    Arrivée: {new Date(schedule.arrival_time).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg">{schedule.price} €</p>
                                <p className="text-sm text-gray-600">
                                    {schedule.available_seats} places disponibles
                                </p>
                                <button
                                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={() => {/* Gérer la réservation */}}
                                >
                                    Réserver
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleList; 
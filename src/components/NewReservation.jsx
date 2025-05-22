import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSchedules, createReservation, getLocations } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

export function NewReservation() {
    const { darkMode } = useTheme();
    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [filter, setFilter] = useState({
        departureCity: '',
        arrivalCity: '',
        date: ''
    });
    const [numberOfSeats, setNumberOfSeats] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [paymentStep, setPaymentStep] = useState('selection');
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [schedulesData, locationsData] = await Promise.all([
                getSchedules(),
                getLocations()
            ]);
            setSchedules(schedulesData || []);
            setFilteredSchedules(schedulesData || []);
            setLocations(locationsData || []);
        } catch (err) {
            setError('Erreur lors du chargement des données');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = () => {
        let filtered = [...schedules];

        if (filter.departureCity) {
            filtered = filtered.filter(schedule => 
                schedule.departure_location?.city.toLowerCase() === filter.departureCity.toLowerCase()
            );
        }

        if (filter.arrivalCity) {
            filtered = filtered.filter(schedule => 
                schedule.arrival_location?.city.toLowerCase() === filter.arrivalCity.toLowerCase()
            );
        }

        if (filter.date) {
            const selectedDate = new Date(filter.date);
            filtered = filtered.filter(schedule => {
                const scheduleDate = new Date(schedule.departure_time);
                return scheduleDate.toDateString() === selectedDate.toDateString();
            });
        }

        setFilteredSchedules(filtered);
    };

    useEffect(() => {
        applyFilters();
    }, [filter]);

    const handlePaymentDetailsChange = (e) => {
        const { name, value } = e.target;
        setPaymentDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const goToPaymentDetails = () => {
        if (!selectedSchedule) {
            setError('Veuillez sélectionner un horaire');
            return;
        }

        if (numberOfSeats <= 0 || numberOfSeats > selectedSchedule.available_seats) {
            setError(`Le nombre de places doit être entre 1 et ${selectedSchedule.available_seats}`);
            return;
        }

        setPaymentStep('details');
        setError(null);
    };

    const confirmPayment = () => {
        if (paymentMethod === 'card') {
            if (!paymentDetails.cardNumber || !paymentDetails.cardName || !paymentDetails.expiryDate || !paymentDetails.cvv) {
                setError('Veuillez remplir tous les champs de carte de crédit');
                return;
            }
            if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) {
                setError('Numéro de carte invalide');
                return;
            }
            if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
                setError('CVV invalide');
                return;
            }
        } else if (paymentMethod === 'paypal') {
            if (!paymentDetails.email || !paymentDetails.password) {
                setError('Veuillez remplir tous les champs PayPal');
                return;
            }
            if (!/\S+@\S+\.\S+/.test(paymentDetails.email)) {
                setError('Email PayPal invalide');
                return;
            }
        }

        setPaymentStep('confirmation');
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            await createReservation({
                schedule: selectedSchedule.id,
                number_of_seats: numberOfSeats,
                special_requests: `Méthode de paiement: ${paymentMethod}`
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            setError('Erreur lors de la création de la réservation');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !schedules.length) {
        return (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const uniqueDepartureCities = [...new Set(schedules.map(s => s.departure_location?.city))].filter(Boolean);
    const uniqueArrivalCities = [...new Set(schedules.map(s => s.arrival_location?.city))].filter(Boolean);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} py-12`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow rounded-lg p-6`}
                >
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
                        Nouvelle Réservation
                    </h1>

                    {error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            Réservation créée avec succès ! Redirection...
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {paymentStep === 'selection' && (
                            <div>
                                    <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                        Horaires disponibles
                                    </h2>
                                    {filteredSchedules.length === 0 ? (
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Aucun horaire ne correspond à vos critères.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {filteredSchedules.map((schedule) => (
                                                <div 
                                                    key={schedule.id} 
                                                    className={`border p-4 rounded-md cursor-pointer transition-all ${darkMode ? 'border-gray-600 hover:border-blue-500' : 'border-gray-200 hover:border-blue-500'} ${selectedSchedule?.id === schedule.id ? 'ring-2 ring-blue-500' : ''}`}
                                                    onClick={() => setSelectedSchedule(schedule)}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="flex items-center space-x-2 font-medium">
                                                                <span className="text-lg">{schedule.departure_location?.city}</span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                                </svg>
                                                                <span className="text-lg">{schedule.arrival_location?.city}</span>
                                                            </div>
                                                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                                                                Départ: {new Date(schedule.departure_time).toLocaleString()}
                                                            </div>
                                                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                Arrivée: {new Date(schedule.arrival_time).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold text-blue-600">
                                                                {schedule.price} €
                                                            </div>
                                                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {schedule.available_seats} places disponibles
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                            )}

                            {selectedSchedule && (
                                <div className={`p-6 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} border ${darkMode ? 'border-gray-600' : 'border-blue-200'}`}>
                                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                        Détails de la réservation
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Départ</p>
                                                    <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedSchedule.departure_location?.city}
                                            </p>
                                        </div>
                                        <div>
                                                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Arrivée</p>
                                                    <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedSchedule.arrival_location?.city}
                                            </p>
                                        </div>
                                        <div>
                                                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Date et heure de départ</p>
                                                    <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {new Date(selectedSchedule.departure_time).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Date et heure d'arrivée</p>
                                                    <p className={`mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {new Date(selectedSchedule.arrival_time).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {paymentStep === 'selection' && (
                                            <div>
                                                <div className="mb-4">
                                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                                        Nombre de places
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={selectedSchedule.available_seats}
                                                        value={numberOfSeats}
                                                        onChange={(e) => setNumberOfSeats(parseInt(e.target.value) || 1)}
                                                        className={`block w-full py-2 px-3 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'border-gray-300 text-gray-900'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                                                    />
                                                </div>
                                                
                                                <div className="mb-4">
                                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                                                        Méthode de paiement
                                                    </label>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center">
                                                            <input
                                                                id="card"
                                                                name="paymentMethod"
                                                                type="radio"
                                                                value="card"
                                                                checked={paymentMethod === 'card'}
                                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                            />
                                                            <label htmlFor="card" className={`ml-3 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                Carte de crédit
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <input
                                                                id="paypal"
                                                                name="paymentMethod"
                                                                type="radio"
                                                                value="paypal"
                                                                checked={paymentMethod === 'paypal'}
                                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                            />
                                                            <label htmlFor="paypal" className={`ml-3 block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                                PayPal
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {paymentStep === 'details' && (
                                            <div>
                                                {paymentMethod === 'card' ? (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                                                Numéro de carte
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="cardNumber"
                                                                value={paymentDetails.cardNumber}
                                                                onChange={handlePaymentDetailsChange}
                                                                placeholder="1234 5678 9012 3456"
                                                                className={`block w-full py-2 px-3 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'border-gray-300 text-gray-900'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                                                Nom sur la carte
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="cardName"
                                                                value={paymentDetails.cardName}
                                                                onChange={handlePaymentDetailsChange}
                                                                placeholder="John Doe"
                                                                className={`block w-full py-2 px-3 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'border-gray-300 text-gray-900'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                                                    Date d'expiration
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="expiryDate"
                                                                    value={paymentDetails.expiryDate}
                                                                    onChange={handlePaymentDetailsChange}
                                                                    placeholder="MM/AA"
                                                                    className={`block w-full py-2 px-3 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'border-gray-300 text-gray-900'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                                                    CVV
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="cvv"
                                                                    value={paymentDetails.cvv}
                                                                    onChange={handlePaymentDetailsChange}
                                                                    placeholder="123"
                                                                    className={`block w-full py-2 px-3 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'border-gray-300 text-gray-900'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                                                Email PayPal
                                                            </label>
                                                            <input
                                                                type="email"
                                                                name="email"
                                                                value={paymentDetails.email}
                                                                onChange={handlePaymentDetailsChange}
                                                                placeholder="email@example.com"
                                                                className={`block w-full py-2 px-3 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'border-gray-300 text-gray-900'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                                                Mot de passe PayPal
                                                            </label>
                                                            <input
                                                                type="password"
                                                                name="password"
                                                                value={paymentDetails.password}
                                                                onChange={handlePaymentDetailsChange}
                                                                placeholder="••••••••"
                                                                className={`block w-full py-2 px-3 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'border-gray-300 text-gray-900'} focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md`}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {paymentStep === 'confirmation' && (
                                            <div className="bg-green-50 p-4 rounded-md border border-green-200 text-green-800">
                                                <div className="flex items-center mb-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <p className="font-medium">Paiement vérifié avec succès</p>
                                                </div>
                                                <p className="text-sm">
                                                    {paymentMethod === 'card' ? 
                                                        `Carte de crédit : ****${paymentDetails.cardNumber.slice(-4)}` : 
                                                        `PayPal : ${paymentDetails.email}`}
                                                </p>
                                                <p className="mt-2 text-sm font-medium">
                                                    Cliquez sur "Réserver" pour confirmer votre réservation.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-4 border-t pt-4">
                                        <div className="flex justify-between items-center">
                                            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                Total
                                            </div>
                                            <div className="text-xl font-bold text-blue-600">
                                                {(selectedSchedule.price * numberOfSeats).toFixed(2)} €
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-4">
                                {paymentStep !== 'selection' && (
                                    <button
                                        type="button"
                                        onClick={() => setPaymentStep(paymentStep === 'details' ? 'selection' : 'details')}
                                        className={`px-4 py-2 border rounded-md text-sm font-medium ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        Retour
                                    </button>
                                )}
                                
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Annuler
                                </button>
                                
                                {paymentStep === 'selection' && (
                                    <button
                                        type="button"
                                        disabled={loading || !selectedSchedule}
                                        onClick={goToPaymentDetails}
                                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading || !selectedSchedule ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
                                    >
                                        Continuer vers le paiement
                                    </button>
                                )}
                                
                                {paymentStep === 'details' && (
                                    <button
                                        type="button"
                                        onClick={confirmPayment}
                                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                    >
                                        Vérifier le paiement
                                    </button>
                                )}
                                
                                {paymentStep === 'confirmation' && (
                                <button
                                    type="submit"
                                        disabled={loading}
                                        className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
                                >
                                        {loading ? 'Création en cours...' : 'Réserver'}
                                </button>
                                )}
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
} 
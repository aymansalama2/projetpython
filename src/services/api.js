import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Services pour les bus
export const getBuses = () => api.get('/buses/');
export const getBusById = (id) => api.get(`/buses/${id}/`);

// Services pour les locations
export const getLocations = () => api.get('/locations/');
export const getLocationById = (id) => api.get(`/locations/${id}/`);

// Services pour les horaires
export const getSchedules = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.departure) params.append('departure', filters.departure);
    if (filters.arrival) params.append('arrival', filters.arrival);
    if (filters.date) params.append('date', filters.date);
    
    return api.get(`/schedules/?${params.toString()}`);
};

export const getScheduleById = (id) => api.get(`/schedules/${id}/`);

// Services pour les utilisateurs
export const register = (userData) => api.post('/auth/register/', userData);
export const login = (credentials) => api.post('/auth/login/', credentials);
export const logout = () => {
    localStorage.removeItem('token');
};

export const getCurrentUser = () => api.get('/users/me/');

// Services pour les réservations
export const getReservations = () => api.get('/reservations/');
export const createReservation = (reservationData) => api.post('/reservations/', reservationData);
export const updateReservation = (id, reservationData) => api.patch(`/reservations/${id}/`, reservationData);
export const deleteReservation = (id) => api.delete(`/reservations/${id}/`);

export const getUserReservations = () => api.get('/reservations/user/');
export const cancelReservation = (id) => api.delete(`/reservations/${id}/`);

// Services pour les utilisateurs
export const getUserProfile = () => api.get('/users/profile/');
export const updateUserProfile = (userData) => api.patch('/users/profile/', userData);

export default api; 
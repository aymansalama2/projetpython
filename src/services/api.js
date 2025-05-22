import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Créer une instance axios avec la configuration de base
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Services d'authentification
export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login/', credentials);
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get('/auth/user/');
        return response.data;
    }
};

// Services pour les bus
export const busService = {
    getAll: async () => {
        const response = await api.get('/buses/');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/buses/${id}/`);
        return response.data;
    },
    create: async (busData) => {
        const response = await api.post('/buses/', busData);
        return response.data;
    },
    update: async (id, busData) => {
        const response = await api.put(`/buses/${id}/`, busData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/buses/${id}/`);
        return response.data;
    }
};

// Services pour les locations
export const locationService = {
    getAll: async () => {
        const response = await api.get('/locations/');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/locations/${id}/`);
        return response.data;
    },
    create: async (locationData) => {
        const response = await api.post('/locations/', locationData);
        return response.data;
    },
    update: async (id, locationData) => {
        const response = await api.put(`/locations/${id}/`, locationData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/locations/${id}/`);
        return response.data;
    },
    getAllCities: async () => {
        const response = await api.get('/locations/cities/');
        return response.data;
    }
};

// Services pour les horaires
export const scheduleService = {
    getAll: async () => {
        const response = await api.get('/schedules/');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/schedules/${id}/`);
        return response.data;
    },
    create: async (scheduleData) => {
        const response = await api.post('/schedules/', scheduleData);
        return response.data;
    },
    update: async (id, scheduleData) => {
        const response = await api.put(`/schedules/${id}/`, scheduleData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/schedules/${id}/`);
        return response.data;
    }
};

// Services pour les réservations
export const reservationService = {
    getAll: async () => {
        const response = await api.get('/reservations/');
        return response.data;
    },
    getUserReservations: async () => {
        const response = await api.get('/reservations/user/');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/reservations/${id}/`);
        return response.data;
    },
    create: async (reservationData) => {
        const response = await api.post('/reservations/', reservationData);
        return response.data;
    },
    update: async (id, reservationData) => {
        const response = await api.put(`/reservations/${id}/`, reservationData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/reservations/${id}/`);
        return response.data;
    },
    cancel: async (id) => {
        const response = await api.post(`/reservations/${id}/cancel/`);
        return response.data;
    }
};

// Services pour les utilisateurs
export const userService = {
    getAll: async () => {
        const response = await api.get('/users/');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/users/${id}/`);
        return response.data;
    },
    create: async (userData) => {
        const response = await api.post('/users/', userData);
        return response.data;
    },
    update: async (id, userData) => {
        const response = await api.put(`/users/${id}/`, userData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/users/${id}/`);
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await api.put('/users/profile/', data);
        return response.data;
    }
};

// Service de recherche
export const searchService = {
    searchRoutes: async (params) => {
        const response = await api.get('/search/routes/', { params });
        return response.data;
    },
    searchSchedules: async (params) => {
        const response = await api.get('/search/schedules/', { params });
        return response.data;
    },
    getAllRoutes: async () => {
        const response = await api.get('/routes/');
        return response.data;
    },
    getRouteById: async (id) => {
        const response = await api.get(`/routes/${id}/`);
        return response.data;
    },
    createRoute: async (routeData) => {
        const response = await api.post('/routes/', routeData);
        return response.data;
    },
    updateRoute: async (id, routeData) => {
        const response = await api.put(`/routes/${id}/`, routeData);
        return response.data;
    },
    deleteRoute: async (id) => {
        const response = await api.delete(`/routes/${id}/`);
        return response.data;
    }
};

// Direct exports for components
export const getReservations = async () => {
    try {
        const response = await api.get('/reservations/user/');
        return response.data;
    } catch (error) {
        console.error('Error fetching reservations:', error);
        throw error;
    }
};

export const getUserProfile = async () => {
    const response = await api.get('/users/profile/');
    return response.data;
};

export const getBuses = async () => {
    const response = await api.get('/buses/');
    return response.data;
};

export const getLocations = async () => {
    const response = await api.get('/locations/');
    return response.data;
};

export const getSchedules = async () => {
    try {
        const response = await api.get('/schedules/');
        return response.data;
    } catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await api.patch('/users/profile/', userData);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        throw error;
    }
};

export const createReservation = async (reservationData) => {
    try {
        const response = await api.post('/reservations/', reservationData);
        return response.data;
    } catch (error) {
        console.error('Error creating reservation:', error);
        throw error;
    }
};

export default api; 
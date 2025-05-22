import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            checkAuth();
        } else {
            setAuthLoading(false);
        }
    }, []);

    const checkAuth = async () => {
        try {
            const userData = await authService.getCurrentUser();
            userData.isAdmin = userData.is_staff || userData.is_superuser;
            setUser(userData);
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'authentification:', error);
            localStorage.removeItem('token');
        } finally {
            setAuthLoading(false);
        }
    };

    const login = async (token) => {
        try {
            const userData = await authService.getCurrentUser();
            userData.isAdmin = userData.is_staff || userData.is_superuser;
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            localStorage.setItem('token', response.token.access);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            return currentUser;
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        authLoading,
        login,
        logout,
        register
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext; 
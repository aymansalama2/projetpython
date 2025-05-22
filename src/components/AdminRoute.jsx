import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminRoute({ children }) {
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    console.log('AdminRoute - User:', user);
    console.log('AdminRoute - is_staff:', user?.is_staff);
    console.log('AdminRoute - is_superuser:', user?.is_superuser);

    if (!user || (!user.is_staff && !user.is_superuser)) {
        console.log('Redirection vers la page d\'accueil - Utilisateur non admin');
        return <Navigate to="/" />;
    }

    return children;
} 
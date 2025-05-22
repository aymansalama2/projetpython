import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/api';

export function EditProfile() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile();
                console.log('Profile response:', response); // Debug log
                
                // Vérifier si la réponse contient les données attendues
                if (response && typeof response === 'object') {
                    const profileData = response.data || response;
                    setFormData({
                        full_name: profileData.full_name || '',
                        email: profileData.email || user?.email || '',
                        phone: profileData.phone || '',
                        address: profileData.address || ''
                    });
                } else {
                    console.error('Réponse invalide:', response);
                    setError('Format de réponse invalide');
                }
            } catch (err) {
                console.error('Erreur détaillée:', err);
                setError('Erreur lors du chargement du profil');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            const response = await updateUserProfile(formData);
            console.log('Update response:', response); // Debug log
            
            if (response) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setError('Erreur lors de la mise à jour du profil');
            }
        } catch (err) {
            console.error('Erreur détaillée:', err);
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil');
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Modifier le Profil
                    </h2>

                    {error && (
                        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            Profil mis à jour avec succès !
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                                Nom Complet
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                id="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Adresse
                            </label>
                            <textarea
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                                    loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            >
                                {loading ? 'Mise à jour...' : 'Mettre à jour'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 
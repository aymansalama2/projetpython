import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LocationList } from './LocationList';
import { LocationForm } from './LocationForm';
import { LocationTest } from './LocationTest';
import { useTheme } from '../../contexts/ThemeContext';

export function LocationManagement() {
  const { darkMode } = useTheme();
  const location = useLocation();
  
  // Pour debugger
  console.log("LocationManagement - Path:", location.pathname);
  
  // Si l'URL est exactement /admin/locations/new, on rend directement le formulaire
  if (location.pathname === '/admin/locations/new') {
    console.log("LocationManagement - Rendering LocationForm directly for /new");
    return <LocationForm />;
  }
  
  // Teste si l'URL contient 'newil' (pour corriger l'erreur de frappe potentielle)
  if (location.pathname.includes('/newil')) {
    console.log("LocationManagement - Detected 'newil' in URL, should be 'new'");
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Erreur d'URL</h2>
        <p className="mb-4">L'URL correcte est "/admin/locations/new" (et non "newil").</p>
        <a href="/admin/locations/new" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Aller à la page d'ajout
        </a>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-200' : 'bg-gray-100'} transition-colors duration-300`}>
      <Routes>
        <Route index element={<LocationList />} />
        <Route path="new" element={<LocationForm />} />
        <Route path="test" element={<LocationTest />} />
        <Route path=":id/edit" element={<LocationForm />} />
      </Routes>
    </div>
  );
} 
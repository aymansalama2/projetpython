import React from 'react';
import { Link } from 'react-router-dom';

export function LocationTest() {
  console.log('LocationTest Component - Rendering');
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Page de Test Location</h1>
      <p className="mb-4">Cette page est pour tester le routage.</p>
      
      <div className="flex space-x-4 mt-4">
        <Link to="/admin/locations" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Retour à la liste
        </Link>
      </div>
    </div>
  );
} 
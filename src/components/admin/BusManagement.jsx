import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function BusManagement() {
  const [buses, setBuses] = useState([
    { id: 1, name: 'Mercedes Tourismo', type: 'Grand Confort', capacity: 48, status: 'Actif' },
    { id: 2, name: 'Volvo 9700', type: 'Standard', capacity: 52, status: 'Actif' },
    { id: 3, name: 'Scania Touring', type: 'Luxe', capacity: 36, status: 'En maintenance' },
    { id: 4, name: 'MAN Lion\'s Coach', type: 'Standard', capacity: 50, status: 'Actif' },
    { id: 5, name: 'Iveco Magelys', type: 'Standard', capacity: 55, status: 'Inactif' },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [newBus, setNewBus] = useState({
    name: '',
    type: '',
    capacity: '',
    status: 'Actif'
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Filtrage des bus
  const filteredBuses = buses.filter(bus => {
    const matchesSearch = bus.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === '' || bus.type === filterType;
    const matchesStatus = filterStatus === '' || bus.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Gestion des formulaires
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBus({
      ...newBus,
      [name]: name === 'capacity' ? parseInt(value) || '' : value
    });
  };
  
  const handleAddBus = () => {
    const id = buses.length > 0 ? Math.max(...buses.map(b => b.id)) + 1 : 1;
    setBuses([...buses, { ...newBus, id }]);
    setNewBus({ name: '', type: '', capacity: '', status: 'Actif' });
    setShowAddModal(false);
  };
  
  const handleDeleteBus = () => {
    setBuses(buses.filter(bus => bus.id !== selectedBus.id));
    setShowDeleteModal(false);
  };
  
  const openDeleteModal = (bus) => {
    setSelectedBus(bus);
    setShowDeleteModal(true);
  };
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Gestion des Bus</h2>
        <p className="text-slate-600">Ajoutez, modifiez ou supprimez des bus de votre flotte</p>
      </div>
      
      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un bus..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              <option value="Standard">Standard</option>
              <option value="Grand Confort">Grand Confort</option>
              <option value="Luxe">Luxe</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="En maintenance">En maintenance</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ajouter un bus
            </button>
          </div>
        </div>
      </div>
      
      {/* Liste des bus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Capacité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBuses.map(bus => (
                <tr key={bus.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">#{bus.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{bus.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{bus.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">{bus.capacity} places</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      bus.status === 'Actif' ? 'bg-green-100 text-green-800' : 
                      bus.status === 'Inactif' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => {}}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => openDeleteModal(bus)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredBuses.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    Aucun bus ne correspond à vos critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Modal d'ajout de bus */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Ajouter un nouveau bus</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du bus</label>
                <input
                  type="text"
                  name="name"
                  value={newBus.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Mercedes Tourismo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  name="type"
                  value={newBus.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Standard">Standard</option>
                  <option value="Grand Confort">Grand Confort</option>
                  <option value="Luxe">Luxe</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacité (nombre de places)</label>
                <input
                  type="number"
                  name="capacity"
                  value={newBus.capacity}
                  onChange={handleInputChange}
                  placeholder="Ex: 48"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  name="status"
                  value={newBus.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="En maintenance">En maintenance</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleAddBus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!newBus.name || !newBus.type || !newBus.capacity}
              >
                Ajouter
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Modal de suppression */}
      {showDeleteModal && selectedBus && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
          >
            <div className="mb-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Confirmer la suppression</h3>
              <p className="text-slate-500">
                Êtes-vous sûr de vouloir supprimer le bus <span className="font-semibold">{selectedBus.name}</span> ? Cette action est irréversible.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteBus}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 
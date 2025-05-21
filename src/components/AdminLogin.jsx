import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log(`Tentative de connexion admin avec: ${email}`);
      const user = await signIn(email, password);
      console.log("Réponse de connexion:", user);
      
      if (user && user.role === 'admin') {
        console.log("Redirection vers le tableau de bord admin");
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userRole', 'admin');
        navigate('/admin/dashboard');
      } else {
        console.log("Utilisateur non admin:", user?.role);
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        setError('Vous n\'avez pas les droits d\'administration');
      }
    } catch (error) {
      console.error("Erreur de connexion admin:", error);
      setError('Identifiants administrateur incorrects');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden"
        >
          {/* Effet de fond décoratif */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-200 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-200 rounded-full opacity-20 blur-2xl"></div>

          {/* Contenu */}
          <div className="relative">
            <motion.div
              variants={itemVariants}
              className="text-center mb-8"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Administration
              </h1>
              <p className="text-slate-600">Connectez-vous en tant qu'administrateur</p>
            </motion.div>

            {error && (
              <motion.div 
                variants={itemVariants}
                className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
              >
                {error}
              </motion.div>
            )}

            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email administrateur
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="••••••"
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                {loading ? 'Connexion...' : 'Connexion administration'}
              </motion.button>
            </motion.form>

            <motion.div
              variants={itemVariants}
              className="mt-8 text-center"
            >
              <Link
                to="/"
                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à l'accueil
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 
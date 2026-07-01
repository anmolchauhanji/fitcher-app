import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { contractorApi } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const arrivingRole = location.state?.role;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loggedInUser = await login(email, password);

      try {
        const pending = localStorage.getItem('pendingContractor');

        if (pending && loggedInUser?.role !== 'contractor') {
          const payload = JSON.parse(pending);
          await contractorApi.createContractorProfile(payload);
          localStorage.removeItem('pendingContractor');

          const updatedUser = { ...loggedInUser, role: 'contractor' };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (err) {
        if (err.response?.status === 409) {
          localStorage.removeItem('pendingContractor');
        }
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 rounded-3xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-400">Enter your credentials to access Fitcher</p>
        </div>

        {arrivingRole === 'contractor' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 px-4 py-3 rounded-xl mb-4 text-sm">
            Account verified. After signing in, please complete your contractor profile from the dashboard.
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                required
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 glow-btn disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

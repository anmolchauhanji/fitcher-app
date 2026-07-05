import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { contractorApi } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const arrivingRole = location.state?.role;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const sessionData = await login(email, password);
      let userObj = sessionData?.user;

      try {
        const pending = localStorage.getItem('pendingContractor');
        if (pending) {
          const payload = JSON.parse(pending);
          await contractorApi.createContractorProfile(payload);
          localStorage.removeItem('pendingContractor');
          userObj = { ...userObj, role: 'contractor' };
          localStorage.setItem('user', JSON.stringify(userObj));
          setUser(userObj);
        }
      } catch (err) {
        if (err.response?.status === 409) {
          localStorage.removeItem('pendingContractor');
        } else {
          throw err;
        }
      }

      const redirectPath = userObj?.role === 'customer' ? '/my-projects' : '/dashboard';
      navigate(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 page-enter">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-150px] right-[-100px] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-150px] left-[-100px] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        {/* Back link */}
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="glass-card p-8 md:p-10 rounded-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="text-primary" size={28} />
            </div>
            <h2 className="text-3xl font-extrabold mb-2" id="login-heading">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Enter your credentials to access Fitcher</p>
          </div>

          {/* Contractor redirect notice */}
          {arrivingRole === 'contractor' && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-4 py-3 rounded-xl mb-6 text-sm">
              Account verified! Login to complete your contractor profile.
            </div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  id="login-email"
                  type="email"
                  required
                  className="w-full bg-background border border-border rounded-xl py-3.5 pl-12 pr-4 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all text-white placeholder-gray-600"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1" htmlFor="login-password">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-background border border-border rounded-xl py-3.5 pl-12 pr-12 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all text-white placeholder-gray-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 glow-btn disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-transform mt-2"
              id="login-submit"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:underline" id="login-to-signup">
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

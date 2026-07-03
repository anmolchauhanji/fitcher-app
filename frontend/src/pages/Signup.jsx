import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/apiClient';
import { CATEGORIES } from '../constants/categories';
import { UserPlus, Mail, Lock, User, Briefcase, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const CATEGORY_OPTIONS = CATEGORIES;

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [contractorInfo, setContractorInfo] = useState({
    businessName: '',
    tradeCategories: [],
    servicePinCodes: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (form.role === 'contractor') {
        const contractorPayload = {
          businessName: contractorInfo.businessName || form.name,
          tradeCategories: contractorInfo.tradeCategories,
          servicePinCodes: contractorInfo.servicePinCodes
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        };
        localStorage.setItem('pendingContractor', JSON.stringify(contractorPayload));
      } else {
        localStorage.removeItem('pendingContractor');
      }

      await authApi.signup({ name: form.name, email: form.email, password: form.password });
      navigate('/verify-email', { state: { email: form.email, role: form.role } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4 page-enter">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-150px] left-[-50px] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-lg"
      >
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="glass-card p-8 md:p-10 rounded-3xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-primary" size={28} />
            </div>
            <h2 className="text-3xl font-extrabold mb-2" id="signup-heading">Create Account</h2>
            <p className="text-gray-400 text-sm">Join the Fitcher network today</p>
          </div>

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
            {/* Role Toggle */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'customer' })}
                className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${
                  form.role === 'customer'
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5'
                    : 'border-border bg-background hover:border-white/20'
                }`}
                id="signup-role-customer"
              >
                <User size={24} className={form.role === 'customer' ? 'text-primary' : 'text-gray-500'} />
                <span className={`text-sm font-bold ${form.role === 'customer' ? 'text-primary' : 'text-gray-500'}`}>Customer</span>
                <span className="text-[11px] text-gray-500">Post projects</span>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'contractor' })}
                className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all duration-200 ${
                  form.role === 'contractor'
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5'
                    : 'border-border bg-background hover:border-white/20'
                }`}
                id="signup-role-contractor"
              >
                <Briefcase size={24} className={form.role === 'contractor' ? 'text-primary' : 'text-gray-500'} />
                <span className={`text-sm font-bold ${form.role === 'contractor' ? 'text-primary' : 'text-gray-500'}`}>Contractor</span>
                <span className="text-[11px] text-gray-500">Bid on projects</span>
              </button>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1" htmlFor="signup-name">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  id="signup-name"
                  type="text"
                  required
                  className="w-full bg-background border border-border rounded-xl py-3.5 pl-12 pr-4 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder-gray-600"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1" htmlFor="signup-email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  id="signup-email"
                  type="email"
                  required
                  className="w-full bg-background border border-border rounded-xl py-3.5 pl-12 pr-4 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder-gray-600"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1" htmlFor="signup-password">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  className="w-full bg-background border border-border rounded-xl py-3.5 pl-12 pr-12 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder-gray-600"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-1 ml-1">Min 8 characters required</p>
            </div>

            {/* Contractor Fields */}
            <AnimatePresence>
              {form.role === 'contractor' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="h-px bg-white/5" />
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">Contractor Details</p>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1" htmlFor="signup-biz-name">Business Name</label>
                    <input
                      id="signup-biz-name"
                      type="text"
                      required
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder-gray-600"
                      placeholder="e.g. Raj Builders"
                      value={contractorInfo.businessName}
                      onChange={(e) => setContractorInfo({ ...contractorInfo, businessName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1" htmlFor="signup-trades">Trade Categories</label>
                    <select
                      id="signup-trades"
                      required
                      multiple
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all min-h-[160px]"
                      value={contractorInfo.tradeCategories}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map((option) => option.value);
                        setContractorInfo({ ...contractorInfo, tradeCategories: selected });
                      }}
                    >
                      {CATEGORY_OPTIONS.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <p className="text-[11px] text-gray-500 mt-1 ml-1">Select one or more categories</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 ml-1" htmlFor="signup-pincodes">Service Pin Codes</label>
                    <input
                      id="signup-pincodes"
                      type="text"
                      required
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder-gray-600"
                      placeholder="e.g. 560001, 560002"
                      value={contractorInfo.servicePinCodes}
                      onChange={(e) => setContractorInfo({ ...contractorInfo, servicePinCodes: e.target.value })}
                    />
                    <p className="text-[11px] text-gray-500 mt-1 ml-1">Comma separated</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 glow-btn disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-transform mt-2"
              id="signup-submit"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                <>
                  <UserPlus size={18} /> Get Started
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline" id="signup-to-login">Sign In</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

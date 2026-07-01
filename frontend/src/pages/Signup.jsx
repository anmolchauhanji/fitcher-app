import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/apiClient';
import { UserPlus, Mail, Lock, User, Briefcase, ChevronRight } from 'lucide-react';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [contractorInfo, setContractorInfo] = useState({
    businessName: '',
    tradeCategories: '', // comma separated
    servicePinCodes: '', // comma separated
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Save contractor info locally (frontend will call POST /contractors after login)
      if (form.role === 'contractor') {
        const contractorPayload = {
          businessName: contractorInfo.businessName || form.name,
          tradeCategories: contractorInfo.tradeCategories
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          servicePinCodes: contractorInfo.servicePinCodes
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        };

        localStorage.setItem('pendingContractor', JSON.stringify(contractorPayload));
      } else {
        localStorage.removeItem('pendingContractor');
      }

      // Signup should only send user fields (do not send role or contractor data)
      await authApi.signup({ name: form.name, email: form.email, password: form.password });
      navigate('/verify-email', { state: { email: form.email, role: form.role } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg glass-card p-8 rounded-3xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-400">Join the Fitcher network today</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => setForm({...form, role: 'customer'})}
              className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${form.role === 'customer' ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
            >
              <User size={24} className={form.role === 'customer' ? 'text-primary' : 'text-gray-500'} />
              <span className={`text-sm font-bold ${form.role === 'customer' ? 'text-primary' : 'text-gray-500'}`}>Customer</span>
            </button>
            <button 
              type="button"
              onClick={() => setForm({...form, role: 'contractor'})}
              className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${form.role === 'contractor' ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
            >
              <Briefcase size={24} className={form.role === 'contractor' ? 'text-primary' : 'text-gray-500'} />
              <span className={`text-sm font-bold ${form.role === 'contractor' ? 'text-primary' : 'text-gray-500'}`}>Contractor</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                required
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none transition-all"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                required
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none transition-all"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
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
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
              />
            </div>
          </div>

          {form.role === 'contractor' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Business / Company Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none transition-all"
                  placeholder="e.g. Raj Builders"
                  value={contractorInfo.businessName}
                  onChange={(e) => setContractorInfo({...contractorInfo, businessName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Trade Categories (comma separated)</label>
                <input
                  type="text"
                  required
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none transition-all"
                  placeholder="e.g. Carpenter, Plumbing"
                  value={contractorInfo.tradeCategories}
                  onChange={(e) => setContractorInfo({...contractorInfo, tradeCategories: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Service Pin Codes (comma separated)</label>
                <input
                  type="text"
                  required
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none transition-all"
                  placeholder="e.g. 560001,560002"
                  value={contractorInfo.servicePinCodes}
                  onChange={(e) => setContractorInfo({...contractorInfo, servicePinCodes: e.target.value})}
                />
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 glow-btn disabled:opacity-70"
          >
            {loading ? 'Creating Account...' : <><UserPlus size={18} /> Get Started</>}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

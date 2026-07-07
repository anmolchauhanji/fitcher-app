import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserCircle, Mail, ShieldCheck, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { authApi } from '../api/apiClient';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [otp, setOtp] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await authApi.updateProfile({ name, email });
      const payload = res.data?.data || {};
      if (payload.otpRequired) {
        setOtpRequired(true);
        setMessage('OTP sent to your new email. Enter it below to confirm.');
      } else {
        const updatedUser = payload.user || payload;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage('Profile updated successfully');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await authApi.updateProfile({ name, email, otp });
      const updatedUser = res.data?.data?.user || res.data?.data || {};
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setOtpRequired(false);
      setOtp('');
      setMessage('Email updated successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 max-w-5xl mx-auto page-enter">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <UserCircle size={28} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-black mb-2">Account profile</p>
            <h1 className="text-2xl font-black text-white">Edit your profile</h1>
            <p className="text-gray-400 mt-2">Update name and email. Email changes require OTP verification.</p>
          </div>
        </div>

        {message && <div className="mb-4 text-sm text-emerald-400">{message}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <label className="block text-sm text-gray-300 mb-2">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none" />
            <label className="block text-sm text-gray-300 mt-4 mb-2">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none" />
            <div className="flex gap-3 mt-4">
              <button type="submit" disabled={loading} className="px-4 py-2 bg-primary rounded-2xl font-bold text-black">Save</button>
              <Link to="/contractor-profile" className="px-4 py-2 border rounded-2xl text-sm text-gray-300">Edit Business Profile</Link>
            </div>
            {otpRequired && (
              <div className="mt-4">
                <label className="block text-sm text-gray-300 mb-2">Enter OTP</label>
                <input value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none" />
                <div className="flex gap-3 mt-3">
                  <button type="button" onClick={handleVerifyOtp} disabled={loading} className="px-4 py-2 bg-emerald-500 rounded-2xl font-bold text-black">Verify OTP</button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={18} className="text-primary" />
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Role</p>
            </div>
            <p className="text-lg font-semibold text-white capitalize">{user?.role || 'customer'}</p>

            <div className="mt-6">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase size={16} className="text-primary" />
                <p className="text-sm font-bold text-gray-300">Business / Account</p>
              </div>
              {user?.role === 'contractor' ? (
                <Link to="/contractor-profile" className="text-sm text-primary font-bold">Open Contractor Profile</Link>
              ) : (
                <p className="text-sm text-gray-400">No business profile available.</p>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;

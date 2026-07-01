import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/apiClient';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const role = location.state?.role;
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Redirect if no email is found (e.g., direct navigation)
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No verification pending.</p>
          <button onClick={() => navigate('/signup')} className="text-primary font-bold">Go to Signup</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setError('OTP must be 6 digits');
    
    setLoading(true);
    setError('');
    try {
      await authApi.verifyEmail({ email, otp });
      if (role === 'contractor') {
        alert('Verification successful! Please log in and complete your contractor profile from your dashboard.');
      } else {
        alert('Verification successful! You can now log in.');
      }
      navigate('/login', { state: { role } });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    try {
      await authApi.resendOtp({ email });
      alert('A new OTP has been sent to your email.');
      setCooldown(60);
    } catch (err) {
      alert('Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-10 rounded-3xl text-center"
      >
        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="text-primary" size={32} />
        </div>

        <h2 className="text-3xl font-bold mb-2">Verify Account</h2>
        <p className="text-gray-400 mb-8 px-4 text-sm">
          A 6-digit code has been sent to <br />
          <span className="text-white font-medium">{email}</span>
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <input 
              type="text" 
              maxLength={6}
              autoFocus
              className="w-full bg-background border-2 border-border rounded-2xl py-4 text-center text-4xl font-black tracking-[1em] focus:border-primary outline-none transition-all placeholder:text-gray-800"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </div>

          <button 
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 glow-btn disabled:opacity-50"
          >
            {loading ? 'Verifying...' : <><ShieldCheck size={18} /> Verify & Complete</>}
          </button>
        </form>

        <button 
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="mt-8 text-gray-500 hover:text-primary transition-colors text-sm flex items-center gap-2 mx-auto disabled:opacity-50 disabled:hover:text-gray-500"
        >
          {resending ? 'Sending...' : cooldown > 0 ? `Resend OTP in ${cooldown}s` : <><RefreshCw size={14} /> Resend OTP</>}
        </button>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

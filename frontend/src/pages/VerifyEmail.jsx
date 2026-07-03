import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/apiClient';
import { ShieldCheck, RefreshCw, CheckCircle } from 'lucide-react';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const role = location.state?.role;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto focus first input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center page-enter">
        <div className="text-center glass-card p-10 rounded-3xl max-w-sm mx-4">
          <p className="text-gray-400 mb-4">No verification pending.</p>
          <button
            onClick={() => navigate('/signup')}
            className="text-primary font-bold hover:underline"
          >
            Go to Signup
          </button>
        </div>
      </div>
    );
  }

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((ch, i) => {
      newOtp[i] = ch;
    });
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((v) => !v);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const otpString = otp.join('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpString.length !== 6) return setError('Please enter the complete 6-digit OTP');

    setLoading(true);
    setError('');
    try {
      await authApi.verifyEmail({ email, otp: otpString });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { state: { role } });
      }, 2000);
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
      setCooldown(60);
      setError('');
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 page-enter">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card p-10 rounded-3xl text-center"
      >
        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-6"
          >
            <div className="w-20 h-20 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-emerald-400" size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-emerald-400">Verified!</h2>
            <p className="text-gray-400 text-sm">Redirecting to login...</p>
          </motion.div>
        ) : (
          <>
            <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-primary" size={32} />
            </div>

            <h2 className="text-3xl font-extrabold mb-2" id="verify-heading">Verify Account</h2>
            <p className="text-gray-400 mb-8 text-sm">
              A 6-digit code has been sent to<br />
              <span className="text-white font-medium">{email}</span>
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input Grid */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`w-12 h-14 text-center text-2xl font-black bg-background border-2 rounded-xl outline-none transition-all ${
                      digit
                        ? 'border-primary text-white'
                        : 'border-border text-gray-600'
                    } focus:border-primary focus:ring-2 focus:ring-primary/20`}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    id={`otp-input-${i}`}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || otpString.length !== 6}
                className="w-full bg-primary text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 glow-btn disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-transform"
                id="verify-submit"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <>
                    <ShieldCheck size={18} /> Verify & Continue
                  </>
                )}
              </button>
            </form>

            <button
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="mt-8 text-gray-500 hover:text-primary transition-colors text-sm flex items-center gap-2 mx-auto disabled:opacity-50 disabled:hover:text-gray-500"
              id="verify-resend"
            >
              {resending ? (
                'Sending...'
              ) : cooldown > 0 ? (
                `Resend OTP in ${cooldown}s`
              ) : (
                <>
                  <RefreshCw size={14} /> Resend OTP
                </>
              )}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

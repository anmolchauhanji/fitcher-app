import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Star,
  Users,
  TrendingUp,
  Award,
  MapPin,
  Hammer,
  ArrowUpRight,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] },
  }),
};

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const features = [
    {
      icon: <CheckCircle className="text-primary" size={28} />,
      bg: 'bg-primary/10',
      title: 'Verified Experts',
      desc: 'Every contractor undergoes rigorous KYC verification — Aadhaar, PAN, and portfolio review.',
    },
    {
      icon: <Shield className="text-blue-400" size={28} />,
      bg: 'bg-blue-500/10',
      title: 'Secure Bidding',
      desc: 'Post projects publicly or invite contractors. Accept bids transparently with full cost breakdowns.',
    },
    {
      icon: <Zap className="text-amber-400" size={28} />,
      bg: 'bg-amber-500/10',
      title: 'Rapid Matching',
      desc: 'Pin-code and category-based search instantly finds the right professionals near your project site.',
    },
    {
      icon: <Star className="text-purple-400" size={28} />,
      bg: 'bg-purple-500/10',
      title: 'Honest Reviews',
      desc: 'Rate and review after project completion. Contractors earn reputation through real work quality.',
    },
    {
      icon: <MapPin className="text-rose-400" size={28} />,
      bg: 'bg-rose-500/10',
      title: 'Geo-Focused',
      desc: 'Location-aware search narrows your results to the exact area where the project is happening.',
    },
    {
      icon: <Hammer className="text-cyan-400" size={28} />,
      bg: 'bg-cyan-500/10',
      title: '50+ Trade Categories',
      desc: 'From plumbing to interior design, solar panels to swimming pools — every trade is covered.',
    },
  ];

  const steps = [
    { num: '01', title: 'Post Your Project', desc: 'Describe your work, set budget range, and choose a category.' },
    { num: '02', title: 'Receive Expert Bids', desc: 'Verified contractors submit detailed bids with cost & timeline.' },
    { num: '03', title: 'Compare & Accept', desc: 'Review bids side-by-side and accept the best one.' },
    { num: '04', title: 'Get It Done', desc: 'Track progress, mark complete, and leave a review.' },
  ];

  return (
    <div className="relative overflow-x-hidden page-enter">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] float-slow" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] float-medium" />
      </div>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="pt-36 pb-24 px-4 md:px-0 flex flex-col items-center" id="hero-section">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center max-w-4xl"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Zap size={14} /> India's Trusted Contractor Marketplace
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.08]"
          >
            Get Your Projects Done{' '}
            <span className="bg-gradient-to-r from-primary via-emerald-300 to-primary bg-clip-text text-transparent">
              With Expert Precision.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            The premium platform connecting project owners with verified professionals.
            Post a project, receive competitive bids, and get expert work done — all in one place.
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/signup"
              className="px-8 py-4 bg-primary text-black font-bold rounded-2xl text-lg glow-btn flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              id="hero-cta-signup"
            >
              Start Your Project <ArrowRight size={20} />
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl text-lg transition-all flex items-center justify-center gap-2"
              id="hero-cta-explore"
            >
              Browse Projects <ArrowUpRight size={20} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Floating Cards */}
        <div className="mt-20 relative w-full max-w-5xl h-[380px] hidden lg:block">
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [0, 1.5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 top-12 w-72 glass-card rounded-2xl p-6"
          >
            <div className="w-12 h-12 bg-primary/15 rounded-xl mb-4 flex items-center justify-center">
              <CheckCircle className="text-primary" size={24} />
            </div>
            <h3 className="font-bold text-lg mb-1">Verified Experts</h3>
            <p className="text-gray-400 text-sm leading-relaxed">All contractors verified through KYC process.</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 18, 0], rotate: [0, -1.5, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 0.5, ease: 'easeInOut' }}
            className="absolute right-0 top-20 w-72 glass-card rounded-2xl p-6"
          >
            <div className="w-12 h-12 bg-blue-500/15 rounded-xl mb-4 flex items-center justify-center">
              <Shield className="text-blue-400" size={24} />
            </div>
            <h3 className="font-bold text-lg mb-1">Transparent Bids</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Compare cost, timeline & materials before choosing.</p>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-80 glass-card rounded-2xl p-8 border-primary/15"
          >
            <div className="w-12 h-12 bg-amber-500/15 rounded-xl mb-4 flex items-center justify-center">
              <Zap className="text-amber-400" size={24} />
            </div>
            <h3 className="font-bold text-xl mb-1">Rapid Matching</h3>
            <p className="text-gray-400 leading-relaxed">Get quotes from top professionals for your exact location.</p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────── */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]" id="stats-section">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <TrendingUp size={24} className="text-primary" />, label: 'Completed Projects', value: '12k+' },
            { icon: <Users size={24} className="text-blue-400" />, label: 'Active Experts', value: '500+' },
            { icon: <Star size={24} className="text-amber-400" />, label: 'Avg. Rating', value: '4.9/5' },
            { icon: <Award size={24} className="text-purple-400" />, label: 'Success Rate', value: '99%' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-gray-500 text-xs uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section className="py-24 px-6" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-bold uppercase tracking-[0.25em]">Process</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3">How Fitcher Works</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              From posting a project to getting expert work done — it's simple, fast, and transparent.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="glass-card rounded-2xl p-8 text-center relative group"
              >
                <div className="text-5xl font-black text-white/5 absolute top-4 right-6 group-hover:text-primary/10 transition-colors">
                  {step.num}
                </div>
                <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center mx-auto mb-5 text-primary font-black text-lg">
                  {step.num}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-white/5 bg-white/[0.01]" id="features-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-bold uppercase tracking-[0.25em]">Features</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3">Built for Serious Projects</h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              Everything you need to manage construction and home improvement projects end-to-end.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="glass-card rounded-2xl p-8"
              >
                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-5`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-xl mb-2">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-24 px-6" id="cta-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/10 via-surface to-blue-500/5 rounded-3xl p-16 border border-primary/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10">
            Ready to Get Your Project Done?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto relative z-10">
            Join thousands of homeowners and professionals using Fitcher to complete projects with expert precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link
              to="/signup"
              className="px-8 py-4 bg-primary text-black font-bold rounded-2xl text-lg glow-btn flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              id="cta-signup"
            >
              Create Free Account <ArrowRight size={20} />
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl text-lg transition-all flex items-center justify-center gap-2"
              id="cta-explore"
            >
              Explore Marketplace
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-black font-black text-xs">
              F
            </div>
            <span className="font-bold">FITCHER</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Fitcher. All rights reserved.
          </p>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

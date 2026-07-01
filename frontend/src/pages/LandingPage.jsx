import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-0 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent">
            Get Your Projects Done <br />
            With Expert Precision.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The premium platform connecting high-intent project owners with vetted professionals. Efficient, secure, and built for professionals aged 25-45.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="px-8 py-4 bg-primary text-black font-bold rounded-full text-lg glow-btn flex items-center gap-2">
              Start Your Project <ArrowRight size={20} />
            </Link>
            <Link to="/dashboard" className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-full text-lg transition-all">
              Browse Experts
            </Link>
          </div>
        </motion.div>

        {/* Floating cards animation placeholder */}
        <div className="mt-20 relative w-full max-w-5xl h-[400px] hidden md:block">
           <motion.div 
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute left-0 top-10 w-72 h-48 glass-card rounded-2xl p-6"
           >
              <div className="w-12 h-12 bg-primary/20 rounded-lg mb-4 flex items-center justify-center">
                <CheckCircle className="text-primary" />
              </div>
              <h3 className="font-bold text-lg">Verified Experts</h3>
              <p className="text-gray-400 text-sm mt-2">All contractors go through a rigorous KYC process.</p>
           </motion.div>

           <motion.div 
              animate={{ 
                y: [0, 20, 0],
                rotate: [0, -2, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
              className="absolute right-0 top-20 w-72 h-48 glass-card rounded-2xl p-6"
           >
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg mb-4 flex items-center justify-center">
                <Shield className="text-blue-500" />
              </div>
              <h3 className="font-bold text-lg">Secure Payments</h3>
              <p className="text-gray-400 text-sm mt-2">Escrow-style protection for every single project.</p>
           </motion.div>

           <motion.div 
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute left-1/2 -translate-x-1/2 top-0 w-80 h-56 glass-card rounded-2xl p-8 border-primary/20"
           >
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg mb-4 flex items-center justify-center">
                <Zap className="text-yellow-500" />
              </div>
              <h3 className="font-bold text-xl">Rapid Bidding</h3>
              <p className="text-gray-400 mt-2">Receive quotes from top professionals in under 24 hours.</p>
           </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Completed Projects', value: '12k+' },
            { label: 'Active Experts', value: '500+' },
            { label: 'Avg. Rating', value: '4.9/5' },
            { label: 'Success Rate', value: '99%' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-500 text-sm uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserCircle, Mail, ShieldCheck, Briefcase } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 max-w-5xl mx-auto page-enter">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <UserCircle size={32} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-black mb-2">Account profile</p>
            <h1 className="text-3xl font-black text-white">{user?.name || 'Your profile'}</h1>
            <p className="text-gray-400 mt-2">Manage your Fitcher account details and activity.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail size={18} className="text-primary" />
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Email</p>
            </div>
            <p className="text-lg font-semibold text-white">{user?.email || 'Not available'}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={18} className="text-primary" />
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Role</p>
            </div>
            <p className="text-lg font-semibold text-white capitalize">{user?.role || 'customer'}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase size={18} className="text-primary" />
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Account status</p>
            </div>
            <p className="text-lg font-semibold text-white">Active and ready for project activity.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

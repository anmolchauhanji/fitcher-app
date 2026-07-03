import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { contractorApi } from '../api/apiClient';
import { Building2, User, Star, ShieldCheck, MapPin, Image as ImageIcon, BadgeCheck, Briefcase } from 'lucide-react';

const ContractorPublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await contractorApi.getContractorById(id);
        setProfile(response.data?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load contractor profile');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProfile();
  }, [id]);

  if (loading) {
    return <div className="pt-32 text-center text-primary">Loading profile...</div>;
  }

  if (error || !profile) {
    return <div className="pt-32 text-center text-red-400">{error || 'Profile not found'}</div>;
  }

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 max-w-6xl mx-auto page-enter">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Building2 size={30} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-black mb-2">Contractor profile</p>
              <h1 className="text-3xl font-black text-white">{profile.businessName}</h1>
              <p className="text-gray-400 mt-2">Verified contractor details and portfolio</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary font-semibold flex items-center gap-2">
              <ShieldCheck size={16} /> {profile.verificationStatus || 'pending'}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
              <Star size={16} className="text-amber-400" /> {profile.averageRating || 0}/5
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 mb-4">
              <User size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-white">Owner Name</h2>
            </div>
            <p className="text-gray-300">{profile.userId?.name || 'Owner name unavailable'}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-white">Completed Projects</h2>
            </div>
            <p className="text-gray-300">{profile.totalCompletedProjects || 0}</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-white">Service Pin Codes</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.servicePinCodes || []).map((pin) => (
                <span key={pin} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">{pin}</span>
              ))}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3 mb-4">
              <BadgeCheck size={18} className="text-primary" />
              <h2 className="text-lg font-bold text-white">Trade Categories</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.tradeCategories || []).map((category) => (
                <span key={category} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">{category}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon size={18} className="text-primary" />
            <h2 className="text-lg font-bold text-white">Portfolio Images</h2>
          </div>
          {profile.portfolioImages?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.portfolioImages.map((image, index) => (
                <img key={image.publicId || index} src={image.url} alt={`Portfolio ${index + 1}`} className="h-48 w-full object-cover rounded-2xl border border-white/10" />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No portfolio images added yet.</p>
          )}
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-lg font-bold text-white mb-3">About</h2>
          <p className="text-gray-400 leading-relaxed">{profile.about || 'No additional details shared yet.'}</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Aadhaar Status: {profile.kycDocuments?.aadhar?.url ? 'Uploaded' : 'Pending'}</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">PAN Status: {profile.kycDocuments?.pan?.url ? 'Uploaded' : 'Pending'}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContractorPublicProfile;

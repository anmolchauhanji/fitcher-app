import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contractorApi } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { UserCheck, MapPin, ClipboardList, ImagePlus, Save, ShieldCheck, BadgeCheck, Star, Camera, UploadCloud, FileText, Building2 } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

const categories = CATEGORIES;

const ContractorProfile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    businessName: '',
    tradeCategories: [],
    servicePinCodes: '',
    portfolioImages: [],
    kycDocuments: {
      aadhar: { url: '', publicId: '' },
      pan: { url: '', publicId: '' },
    },
  });

  const loadProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await contractorApi.getMyContractorProfile();
      const data = response.data.data;
      setProfile(data);
      setForm({
        businessName: data.businessName || '',
        tradeCategories: data.tradeCategories || [],
        servicePinCodes: (data.servicePinCodes || []).join(', '),
        portfolioImages: data.portfolioImages || [],
        kycDocuments: {
          aadhar: data.kycDocuments?.aadhar || { url: '', publicId: '' },
          pan: data.kycDocuments?.pan || { url: '', publicId: '' },
        },
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (form.businessName.trim().length < 2) newErrors.businessName = 'Business name is required';
    if (form.tradeCategories.length === 0) newErrors.tradeCategories = 'At least one trade category is required';
    if (!form.servicePinCodes.trim()) newErrors.servicePinCodes = 'At least one service pin code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        businessName: form.businessName,
        tradeCategories: form.tradeCategories,
        servicePinCodes: form.servicePinCodes.split(',').map((item) => item.trim()).filter(Boolean),
        portfolioImages: form.portfolioImages,
        kycDocuments: form.kycDocuments,
      };
      const response = await contractorApi.updateMyContractorProfile(payload);
      setProfile(response.data.data);
      setMessage('Profile updated successfully.');
      const updatedUser = { ...user, role: 'contractor' };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (file, field) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newImage = { url: reader.result, publicId: `local-${Date.now()}` };
      setForm((prev) => ({
        ...prev,
        [field]: [...prev[field], newImage],
      }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <div className="pt-32 text-center text-primary">Loading...</div>;
  }

  return (
    <div className="pt-32 pb-20 px-4 md:px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-10 rounded-[2rem]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center">
              <UserCheck className="text-primary" size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Contractor Profile</h1>
              <p className="text-gray-400">Complete and update your contractor details here.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary font-semibold flex items-center gap-2">
              <ShieldCheck size={16} /> Verification: {profile?.verificationStatus || 'pending'}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 flex items-center gap-2">
              <Star size={16} className="text-amber-400" /> Rating: {profile?.averageRating || 0}/5
            </div>
          </div>
        </div>

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 px-4 py-3 rounded-xl mb-6 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Building2 size={18} className="text-primary" />
              <h2 className="text-xl font-bold text-white">Business Details</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Business Name</label>
              <input
                type="text"
                className={`w-full bg-background border ${errors.businessName ? 'border-red-500' : 'border-border'} rounded-xl py-3 px-4 focus:border-primary outline-none transition-all`}
                value={form.businessName}
                onChange={(e) => setForm((prev) => ({ ...prev, businessName: e.target.value }))}
              />
              {errors.businessName && <span className="text-red-500 text-xs mt-1 ml-1">{errors.businessName}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Trade Categories</label>
              <select
                multiple
                className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none transition-all min-h-[160px]"
                value={form.tradeCategories}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map((item) => item.value);
                  setForm((prev) => ({ ...prev, tradeCategories: selected }));
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.tradeCategories && <span className="text-red-500 text-xs mt-1 ml-1">{errors.tradeCategories}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Service Areas</label>
              <input
                type="text"
                className={`w-full bg-background border ${errors.servicePinCodes ? 'border-red-500' : 'border-border'} rounded-xl py-3 px-4 focus:border-primary outline-none transition-all`}
                value={form.servicePinCodes}
                onChange={(e) => setForm((prev) => ({ ...prev, servicePinCodes: e.target.value }))}
              />
              {errors.servicePinCodes && <span className="text-red-500 text-xs mt-1 ml-1">{errors.servicePinCodes}</span>}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Portfolio Images</h2>
                <p className="text-gray-400 text-sm">Upload a few project images to showcase your workmanship.</p>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-2xl cursor-pointer text-sm text-gray-200 hover:bg-white/5 transition-all">
                <UploadCloud size={18} /> Upload Portfolio Images
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files?.[0], 'portfolioImages')}
                />
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.portfolioImages.length > 0 ? (
                form.portfolioImages.map((image, index) => (
                  <div key={index} className="rounded-3xl overflow-hidden border border-border bg-surface h-40">
                    <img src={image.url} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-border bg-background p-8 text-center text-gray-500">No portfolio images added.</div>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={18} className="text-primary" />
              <h2 className="text-xl font-bold text-white">KYC Documents</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Aadhaar Card</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none transition-all"
                  value={form.kycDocuments.aadhar.url}
                  onChange={(e) => setForm((prev) => ({
                    ...prev,
                    kycDocuments: { ...prev.kycDocuments, aadhar: { ...prev.kycDocuments.aadhar, url: e.target.value } },
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Aadhaar Public ID</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none transition-all"
                  value={form.kycDocuments.aadhar.publicId}
                  onChange={(e) => setForm((prev) => ({
                    ...prev,
                    kycDocuments: { ...prev.kycDocuments, aadhar: { ...prev.kycDocuments.aadhar, publicId: e.target.value } },
                  }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">PAN Card</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none transition-all"
                  value={form.kycDocuments.pan.url}
                  onChange={(e) => setForm((prev) => ({
                    ...prev,
                    kycDocuments: { ...prev.kycDocuments, pan: { ...prev.kycDocuments.pan, url: e.target.value } },
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">PAN Public ID</label>
                <input
                  type="text"
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none transition-all"
                  value={form.kycDocuments.pan.publicId}
                  onChange={(e) => setForm((prev) => ({
                    ...prev,
                    kycDocuments: { ...prev.kycDocuments, pan: { ...prev.kycDocuments.pan, publicId: e.target.value } },
                  }))}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-primary text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContractorProfile;

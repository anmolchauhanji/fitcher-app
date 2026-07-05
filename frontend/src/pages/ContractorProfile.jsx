import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contractorApi, uploadApi } from '../api/apiClient';
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

  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  const [uploadingPan, setUploadingPan] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  const handleAadharUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAadhar(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadApi.uploadAadhar(formData);
      const updatedProfile = res.data.data;
      setProfile(updatedProfile);
      setForm((prev) => ({
        ...prev,
        kycDocuments: {
          ...prev.kycDocuments,
          aadhar: updatedProfile.kycDocuments?.aadhar || { url: '', publicId: '' }
        }
      }));
      setMessage('Aadhaar document uploaded successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Aadhaar upload failed.');
    } finally {
      setUploadingAadhar(false);
    }
  };

  const handlePanUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPan(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadApi.uploadPan(formData);
      const updatedProfile = res.data.data;
      setProfile(updatedProfile);
      setForm((prev) => ({
        ...prev,
        kycDocuments: {
          ...prev.kycDocuments,
          pan: updatedProfile.kycDocuments?.pan || { url: '', publicId: '' }
        }
      }));
      setMessage('PAN document uploaded successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'PAN upload failed.');
    } finally {
      setUploadingPan(false);
    }
  };

  const handlePortfolioUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingPortfolio(true);
    setMessage('');
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      const res = await uploadApi.uploadPortfolio(formData);
      const updatedProfile = res.data.data;
      setProfile(updatedProfile);
      setForm((prev) => ({
        ...prev,
        portfolioImages: updatedProfile.portfolioImages || []
      }));
      setMessage('Portfolio image(s) uploaded successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Portfolio upload failed.');
    } finally {
      setUploadingPortfolio(false);
    }
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
                <p className="text-gray-400 text-sm">Upload project images to showcase your workmanship (JPG/PNG/WEBP).</p>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-2xl cursor-pointer text-sm text-gray-200 hover:bg-white/5 transition-all">
                <UploadCloud size={18} /> {uploadingPortfolio ? 'Uploading...' : 'Upload Portfolio'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePortfolioUpload}
                  disabled={uploadingPortfolio}
                />
              </label>
            </div>
            {uploadingPortfolio && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="skeleton h-40 w-full rounded-3xl" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.portfolioImages.length > 0 ? (
                form.portfolioImages.map((image, index) => (
                  <div key={index} className="rounded-3xl overflow-hidden border border-border bg-surface h-40 relative group">
                    <img src={image.url} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-border bg-background p-8 text-center text-gray-500 col-span-2">No portfolio images added.</div>
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText size={18} className="text-primary" />
              <h2 className="text-xl font-bold text-white">KYC Documents</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aadhaar Upload Box */}
              <div className="rounded-2xl border border-border bg-background p-5 flex flex-col items-center justify-center min-h-[220px]">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Aadhaar Card</h3>
                {uploadingAadhar ? (
                  <div className="skeleton w-full h-32 rounded-xl flex items-center justify-center text-xs text-primary font-bold">Uploading to Cloudinary...</div>
                ) : form.kycDocuments?.aadhar?.url ? (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-32 h-20 rounded-xl overflow-hidden border border-border mb-3">
                      <img src={form.kycDocuments.aadhar.url} alt="Aadhaar preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-emerald-400 text-xs font-semibold mb-3 flex items-center gap-1">
                      <BadgeCheck size={14} /> Aadhaar Verified
                    </span>
                    <label className="text-xs px-3 py-1.5 bg-surface border border-border rounded-xl text-gray-300 hover:text-white cursor-pointer hover:bg-white/5 transition-all">
                      Change File
                      <input type="file" accept="image/*" className="hidden" onChange={handleAadharUpload} />
                    </label>
                  </div>
                ) : (
                  <label className="w-full border-2 border-dashed border-border hover:border-primary/40 rounded-2xl p-6 flex flex-col items-center cursor-pointer transition-all bg-surface/10 hover:bg-surface/30">
                    <UploadCloud size={28} className="text-gray-500 mb-2" />
                    <span className="text-xs font-bold text-gray-300 text-center">Upload Aadhaar (JPG/PNG)</span>
                    <span className="text-[10px] text-gray-500 mt-1">Max file size 5MB</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAadharUpload} />
                  </label>
                )}
              </div>

              {/* PAN Upload Box */}
              <div className="rounded-2xl border border-border bg-background p-5 flex flex-col items-center justify-center min-h-[220px]">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">PAN Card</h3>
                {uploadingPan ? (
                  <div className="skeleton w-full h-32 rounded-xl flex items-center justify-center text-xs text-primary font-bold">Uploading to Cloudinary...</div>
                ) : form.kycDocuments?.pan?.url ? (
                  <div className="w-full flex flex-col items-center">
                    <div className="w-32 h-20 rounded-xl overflow-hidden border border-border mb-3">
                      <img src={form.kycDocuments.pan.url} alt="PAN preview" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-emerald-400 text-xs font-semibold mb-3 flex items-center gap-1">
                      <BadgeCheck size={14} /> PAN Verified
                    </span>
                    <label className="text-xs px-3 py-1.5 bg-surface border border-border rounded-xl text-gray-300 hover:text-white cursor-pointer hover:bg-white/5 transition-all">
                      Change File
                      <input type="file" accept="image/*" className="hidden" onChange={handlePanUpload} />
                    </label>
                  </div>
                ) : (
                  <label className="w-full border-2 border-dashed border-border hover:border-primary/40 rounded-2xl p-6 flex flex-col items-center cursor-pointer transition-all bg-surface/10 hover:bg-surface/30">
                    <UploadCloud size={28} className="text-gray-500 mb-2" />
                    <span className="text-xs font-bold text-gray-300 text-center">Upload PAN Card (JPG/PNG)</span>
                    <span className="text-[10px] text-gray-500 mt-1">Max file size 5MB</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePanUpload} />
                  </label>
                )}
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

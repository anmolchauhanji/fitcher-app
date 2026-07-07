import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contractorApi, uploadApi, authApi } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { UserCheck, MapPin, ClipboardList, ImagePlus, Save, ShieldCheck, BadgeCheck, Star, Camera, UploadCloud, FileText, Building2, Trash2, RefreshCw, CheckCircle2, UserCircle, Mail } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

const categories = CATEGORIES;

const ContractorProfile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [categoryQuery, setCategoryQuery] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const [personalForm, setPersonalForm] = useState({
    name: '',
    email: '',
  });
  const [otp, setOtp] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [personalSaving, setPersonalSaving] = useState(false);
  const [personalMessage, setPersonalMessage] = useState('');
  const [personalErrors, setPersonalErrors] = useState({});

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
      setPersonalForm({
        name: data.userId?.name || user?.name || '',
        email: data.userId?.email || user?.email || '',
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
  const [portfolioActionIndex, setPortfolioActionIndex] = useState(null);

  const getVerificationBadge = (status = 'pending') => {
    const normalized = (status || 'pending').toLowerCase();
    const styles = {
      verified: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      pending: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
      rejected: 'border-red-500/30 bg-red-500/10 text-red-300',
      suspended: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    };

    return styles[normalized] || styles.pending;
  };

  const getKycStatus = (docType) => {
    const status = (profile?.verificationStatus || 'pending').toLowerCase();
    switch (status) {
      case 'verified':
        return {
          textColor: 'text-emerald-400',
          label: 'Verified',
          description: `Your ${docType} has been verified.`
        };
      case 'rejected':
        return {
          textColor: 'text-red-400',
          label: 'Rejected',
          description: `Verification failed — please replace and re-submit your ${docType}.`
        };
      case 'suspended':
        return {
          textColor: 'text-gray-400',
          label: 'Suspended',
          description: 'Verification suspended. Please contact support.'
        };
      case 'pending':
      default:
        return {
          textColor: 'text-amber-300',
          label: 'Pending Verification',
          description: `Your ${docType} has been submitted and will be reviewed by our team.`
        };
    }
  };

  const toggleCategory = (category) => {
    setForm((prev) => ({
      ...prev,
      tradeCategories: prev.tradeCategories.includes(category)
        ? prev.tradeCategories.filter((item) => item !== category)
        : [...prev.tradeCategories, category],
    }));
  };

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
      setShowVerificationModal(true);
      setMessage('Your profile has been submitted for verification. Our team will review it shortly.');
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
      setShowVerificationModal(true);
      setMessage('Your profile has been submitted for verification. Our team will review it shortly.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'PAN upload failed.');
    } finally {
      setUploadingPan(false);
    }
  };

  const handleAadharRemove = async () => {
    if (!window.confirm('Remove Aadhaar from your profile?')) return;
    setMessage('');
    try {
      const res = await contractorApi.deleteKyc('aadhar');
      const updatedProfile = res.data.data;
      setProfile(updatedProfile);
      const kyc = updatedProfile?.kycDocuments || {};
      setForm((prev) => ({
        ...prev,
        kycDocuments: {
          aadhar: kyc.aadhar || { url: '', publicId: '' },
          pan: kyc.pan || { url: '', publicId: '' }
        }
      }));
      setMessage('Aadhaar removed.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to remove Aadhaar.');
    }
  };

  const handlePanRemove = async () => {
    if (!window.confirm('Remove PAN from your profile?')) return;
    setMessage('');
    try {
      const res = await contractorApi.deleteKyc('pan');
      const updatedProfile = res.data.data;
      setProfile(updatedProfile);
      const kyc = updatedProfile?.kycDocuments || {};
      setForm((prev) => ({
        ...prev,
        kycDocuments: {
          aadhar: kyc.aadhar || { url: '', publicId: '' },
          pan: kyc.pan || { url: '', publicId: '' }
        }
      }));
      setMessage('PAN removed.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to remove PAN.');
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

  const handlePortfolioDelete = async (index) => {
    const nextImages = form.portfolioImages.filter((_, itemIndex) => itemIndex !== index);
    setPortfolioActionIndex(index);
    try {
      const payload = {
        businessName: form.businessName,
        tradeCategories: form.tradeCategories,
        servicePinCodes: form.servicePinCodes.split(',').map((item) => item.trim()).filter(Boolean),
        portfolioImages: nextImages,
        kycDocuments: form.kycDocuments,
      };
      const response = await contractorApi.updateMyContractorProfile(payload);
      setProfile(response.data.data);
      setForm((prev) => ({ ...prev, portfolioImages: response.data.data?.portfolioImages || [] }));
      setMessage('Portfolio image removed successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to remove image.');
    } finally {
      setPortfolioActionIndex(null);
    }
  };

  const handlePortfolioReplace = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPortfolioActionIndex(index);
    try {
      const formData = new FormData();
      formData.append('images', file);
      const res = await uploadApi.uploadPortfolio(formData);
      const updatedProfile = res.data.data || {};
      const uploadedImages = updatedProfile.portfolioImages || [];
      const nextImages = [...(form.portfolioImages || [])];
      nextImages[index] = uploadedImages[uploadedImages.length - 1] || nextImages[index];
      const payload = {
        businessName: form.businessName,
        tradeCategories: form.tradeCategories,
        servicePinCodes: form.servicePinCodes.split(',').map((item) => item.trim()).filter(Boolean),
        portfolioImages: nextImages,
        kycDocuments: form.kycDocuments,
      };
      const response = await contractorApi.updateMyContractorProfile(payload);
      setProfile(response.data.data);
      setForm((prev) => ({ ...prev, portfolioImages: response.data.data?.portfolioImages || [] }));
      setMessage('Portfolio image replaced successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to replace image.');
    } finally {
      setPortfolioActionIndex(null);
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
            <div className={`rounded-2xl border px-4 py-2 text-sm font-semibold flex items-center gap-2 ${getVerificationBadge(profile?.verificationStatus)}`}>
              <ShieldCheck size={16} /> Verification: {String(profile?.verificationStatus || 'pending').replace(/_/g, ' ')}
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
              <input
                type="text"
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
                placeholder="Search categories"
                className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-primary outline-none transition-all mb-3"
              />
              <div className="rounded-2xl border border-border bg-background p-3 max-h-60 overflow-y-auto space-y-2">
                {categories.filter((category) => category.toLowerCase().includes(categoryQuery.toLowerCase())).map((category) => {
                  const selected = form.tradeCategories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`w-full flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-all ${selected ? 'border-primary/40 bg-primary/10 text-primary' : 'border-white/10 bg-white/[0.02] text-gray-300 hover:bg-white/5'}`}
                    >
                      <span>{category}</span>
                      {selected && <CheckCircle2 size={16} />}
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {form.tradeCategories.map((category) => (
                  <span key={category} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary">{category}</span>
                ))}
              </div>
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
                  <div key={image.publicId || index} className="rounded-3xl overflow-hidden border border-border bg-surface h-40 relative group">
                    <img src={image.url} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-between p-3">
                      <label className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white cursor-pointer backdrop-blur">
                        <RefreshCw size={13} /> Replace
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePortfolioReplace(index, e)} />
                      </label>
                      <button type="button" onClick={() => handlePortfolioDelete(index)} className="inline-flex items-center gap-1 rounded-full bg-red-500/80 px-3 py-1 text-xs text-white">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                    {portfolioActionIndex === index && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm text-white">Updating...</div>
                    )}
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
                    <span className={`${getKycStatus('Aadhaar').textColor} text-xs font-semibold mb-3 flex items-center gap-1`}>
                      <BadgeCheck size={14} /> {getKycStatus('Aadhaar').label}
                    </span>
                    <span className="text-[10px] text-gray-500 text-center">{getKycStatus('Aadhaar').description}</span>
                    <div className="flex gap-3 mt-4">
                      <label className="inline-flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-2xl cursor-pointer text-sm text-gray-200 hover:bg-white/5 transition-all">
                        Replace
                        <input type="file" accept="image/*" className="hidden" onChange={handleAadharUpload} />
                      </label>
                      <button type="button" onClick={handleAadharRemove} className="px-3 py-2 bg-red-600/80 text-white rounded-2xl text-sm">Remove</button>
                    </div>
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
                    <span className={`${getKycStatus('PAN').textColor} text-xs font-semibold mb-3 flex items-center gap-1`}>
                      <BadgeCheck size={14} /> {getKycStatus('PAN').label}
                    </span>
                    <span className="text-[10px] text-gray-500 text-center">{getKycStatus('PAN').description}</span>
                    <div className="flex gap-3 mt-4">
                      <label className="inline-flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-2xl cursor-pointer text-sm text-gray-200 hover:bg-white/5 transition-all">
                        Replace
                        <input type="file" accept="image/*" className="hidden" onChange={handlePanUpload} />
                      </label>
                      <button type="button" onClick={handlePanRemove} className="px-3 py-2 bg-red-600/80 text-white rounded-2xl text-sm">Remove</button>
                    </div>
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

      <AnimatePresence>
        {showVerificationModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md rounded-[2rem] border border-primary/20 bg-surface p-8 text-center shadow-2xl">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-black text-white">Verification submitted</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">Your profile has been submitted for verification. Our team will review it shortly.</p>
              <button type="button" onClick={() => setShowVerificationModal(false)} className="mt-6 rounded-2xl bg-primary px-5 py-3 font-bold text-black">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContractorProfile;

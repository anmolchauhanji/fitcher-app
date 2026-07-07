import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { projectApi, uploadApi } from '../api/apiClient';
import { 
  PlusCircle, 
  FileText, 
  MapPin, 
  IndianRupee, 
  Tag, 
  AlignLeft, 
  Calendar,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  HelpCircle,
  Clock,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  "Plumber", "Electrician", "Painter", "Carpenter", "Mason",
  "Tile Installer", "Marble & Granite Contractor", "Flooring Contractor",
  "POP Contractor", "False Ceiling Contractor", "Waterproofing Contractor",
  "Roofing Contractor", "Welder", "Fabricator", "Steel Contractor",
  "Aluminium Fabricator", "Glass Installer", "Door & Window Installer",
  "Interior Designer", "Architect", "Civil Contractor", "General Contractor",
  "Building Contractor", "Demolition Contractor", "Excavation Contractor",
  "Paver Block Contractor", "Road Contractor", "Borewell Contractor",
  "Solar Panel Installer", "CCTV Installer", "Security System Installer",
  "AC Technician", "HVAC Contractor", "Lift Installer", "Generator Technician",
  "Home Automation Installer", "Modular Kitchen Installer", "Furniture Maker",
  "Wood Polish Contractor", "Wallpaper Installer", "Curtain & Blinds Installer",
  "Garden & Landscaping Contractor", "Swimming Pool Contractor",
  "Water Tank Cleaning", "House Cleaning", "Pest Control",
  "Septic Tank Service", "Construction Consultant", "Project Management Consultant",
];

const CreateProject = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    minBudget: '',
    maxBudget: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    scope: '',
    expiresAt: '',
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categoryQuery, setCategoryQuery] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateStep = (s) => {
    const newErrors = {};
    if (s === 1) {
      if (form.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
      if (!form.category) newErrors.category = 'Please select a trade category';
    }
    if (s === 2) {
      if (form.description.length < 20) newErrors.description = 'Provide a more detailed description (min 20 chars)';
      if (!form.minBudget || !form.maxBudget) newErrors.budget = 'Complete budget range is required';
      if (Number(form.minBudget) >= Number(form.maxBudget)) newErrors.budget = 'Max budget must be higher than Min';
      if (!form.expiresAt) newErrors.expiresAt = 'Expiry date is required';
    }
    if (s === 3) {
      if (!form.address) newErrors.address = 'Detailed address is required';
      if (!form.city) newErrors.city = 'City is required';
      if (!form.state) newErrors.state = 'State is required';
      if (!form.pinCode || form.pinCode.length !== 6) newErrors.pinCode = 'Valid 6-digit pin code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter only image files (client-side safeguard)
    const validFiles = [];
    let hadInvalid = false;
    for (const file of files) {
      if (file.type && file.type.startsWith('image/')) {
        validFiles.push(file);
      } else {
        hadInvalid = true;
      }
    }

    if (hadInvalid) {
      setErrors((prev) => ({ ...prev, photos: 'Only image files are allowed' }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.photos;
        return copy;
      });
    }

    if (validFiles.length === 0) return;

    // Limit total images to 10
    setSelectedImages((prev) => {
      const combined = [...prev, ...validFiles].slice(0, 10);
      return combined;
    });

    validFiles.slice(0, 10 - selectedImages.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (user?.role !== 'customer') {
      setErrors({ server: 'Switch to a Customer account to post projects.' });
      return;
    }

    const v1 = validateStep(1);
    const v2 = validateStep(2);
    const v3 = validateStep(3);

    if (!v1 || !v2 || !v3) {
      if (!v1) setStep(1);
      else if (!v2) setStep(2);
      else if (!v3) setStep(3);
      return;
    }

    // Require at least one image to publish
    if (selectedImages.length === 0) {
      setErrors({ photos: 'Please upload at least one project photo' });
      setStep(4);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let newProject = null;

      // Images are required and selected, send multipart FormData in a single request
      if (selectedImages.length > 0) {
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('category', form.category);
        formData.append('description', form.description);
        formData.append('budget', JSON.stringify({ min: Number(form.minBudget), max: Number(form.maxBudget) }));
        formData.append('location', JSON.stringify({
          address: form.address,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode,
          coordinates: { type: 'Point', coordinates: [77.5946, 12.9716] }
        }));
        formData.append('scope', form.scope);
        formData.append('expiresAt', new Date(form.expiresAt).toISOString());

        selectedImages.forEach((img) => formData.append('images', img));

        const createResponse = await projectApi.createProject(formData);
        newProject = createResponse.data.data;
      }

      navigate('/my-projects', { state: { message: 'Project published successfully!' } });
    } catch (err) {
      setErrors({ server: err.response?.data?.message || 'Failed to create project' });
    } finally {
      setLoading(false);
    }
  };

  const InputError = ({ name }) => (
    <AnimatePresence>
      {errors[name] && (
        <motion.span 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-red-500 text-[11px] mt-1.5 ml-1 block font-medium"
        >
          {errors[name]}
        </motion.span>
      )}
    </AnimatePresence>
  );

  if (user?.role === 'contractor') {
    return (
      <div className="pt-48 pb-24 px-4 text-center max-w-2xl mx-auto page-enter">
        <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
           <HelpCircle size={40} className="text-amber-500" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Unauthorized Access</h1>
        <p className="text-gray-400 text-lg mb-10">
          Only Customer accounts can post new projects. As a Contractor, you can browse the marketplace and submit bids on existing projects.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-10 py-4 bg-primary text-black font-black rounded-2xl hover:scale-[1.05] transition-all glow-btn"
        >
          Go to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 max-w-4xl mx-auto page-enter">
      <div className="flex flex-col items-center mb-16">
         <div className="w-16 h-16 bg-primary/15 rounded-[1.5rem] flex items-center justify-center mb-6">
            <PlusCircle className="text-primary" size={32} />
         </div>
         <h1 className="text-4xl md:text-5xl font-black text-center mb-4">Post a New Project</h1>
         <p className="text-gray-400 text-center max-w-lg">
           Complete the details below to receive competitive bids from verified professionals.
         </p>
         
         {/* Stepper Progress */}
         <div className="flex items-center gap-4 mt-12 w-full max-w-md">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all duration-300 border ${
                  step === i ? 'bg-primary text-black border-primary ring-4 ring-primary/10' :
                  step > i ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  'bg-surface border-border text-gray-600'
                }`}>
                  {step > i ? <CheckCircle size={20} /> : i}
                </div>
                {i < 4 && <div className={`flex-1 h-1 rounded-full ${step > i ? 'bg-emerald-500/30' : 'bg-surface border border-border'}`} />}
              </div>
            ))}
         </div>
      </div>

      <div className="glass-card p-10 md:p-14 rounded-[3rem] relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

        {errors.server && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl mb-10 flex items-center gap-3">
            <HelpCircle size={20} /> {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3 ml-1 uppercase tracking-widest">Project Title</label>
                  <div className="relative group">
                    <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="text" 
                      className={`w-full bg-surface border-2 ${errors.title ? 'border-red-500' : 'border-border'} rounded-2xl py-5 pl-14 pr-6 focus:border-primary outline-none transition-all text-white placeholder-gray-600`}
                      placeholder="e.g. Modern Minimalist Kitchen Renovation"
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                    />
                  </div>
                  <InputError name="title" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3 ml-1 uppercase tracking-widest">Trade Category</label>
                  <div className="relative group">
                    <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      type="text"
                      value={categoryQuery}
                      onChange={(e) => setCategoryQuery(e.target.value)}
                      placeholder="Search category"
                      className={`w-full bg-surface border-2 ${errors.category ? 'border-red-500' : 'border-border'} rounded-2xl py-5 pl-14 pr-6 focus:border-primary outline-none transition-all text-white placeholder-gray-600`}
                    />
                  </div>
                  <div className="mt-3 max-h-48 overflow-y-auto rounded-2xl border border-border bg-background p-2">
                    {CATEGORIES.filter((cat) => cat.toLowerCase().includes(categoryQuery.toLowerCase())).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, category: cat });
                          setCategoryQuery(cat);
                        }}
                        className={`mb-2 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-all ${form.category === cat ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-white/5'}`}
                      >
                        <span>{cat}</span>
                        {form.category === cat && <CheckCircle size={16} />}
                      </button>
                    ))}
                  </div>
                  {form.category && (
                    <div className="mt-3 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary inline-flex">
                      Selected: {form.category}
                    </div>
                  )}
                  <InputError name="category" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3 ml-1 uppercase tracking-widest">Detailed Description</label>
                  <div className="relative group">
                    <textarea 
                      rows={5}
                      className={`w-full bg-surface border-2 ${errors.description ? 'border-red-500' : 'border-border'} rounded-2xl py-6 px-8 focus:border-primary outline-none transition-all text-white placeholder-gray-600 leading-relaxed`}
                      placeholder="Explain exactly what you need done. Mention any specific requirements..."
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                    />
                  </div>
                  <InputError name="description" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 ml-1 uppercase tracking-widest">Budget Range (₹)</label>
                    <div className="flex gap-4 items-center">
                      <div className="relative flex-1">
                        <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input 
                          type="number" placeholder="Min"
                          className="w-full bg-surface border-2 border-border rounded-xl py-4 pl-10 pr-4 focus:border-primary outline-none transition-all"
                          value={form.minBudget}
                          onChange={(e) => setForm({...form, minBudget: e.target.value})}
                        />
                      </div>
                      <span className="text-gray-500 font-bold">—</span>
                      <div className="relative flex-1">
                        <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input 
                          type="number" placeholder="Max"
                          className="w-full bg-surface border-2 border-border rounded-xl py-4 pl-10 pr-4 focus:border-primary outline-none transition-all"
                          value={form.maxBudget}
                          onChange={(e) => setForm({...form, maxBudget: e.target.value})}
                        />
                      </div>
                    </div>
                    <InputError name="budget" />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 ml-1 uppercase tracking-widest">Bidding Deadline (dd/mm/yyyy)</label>
                    <div className="relative group">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                      <input 
                        type="date"
                        className={`w-full bg-surface border-2 ${errors.expiresAt ? 'border-red-500' : 'border-border'} rounded-2xl py-4 pl-14 pr-6 focus:border-primary outline-none transition-all text-white`}
                        value={form.expiresAt}
                        onChange={(e) => setForm({...form, expiresAt: e.target.value})}
                      />
                    </div>
                      <InputError name="expiresAt" />
                      {form.expiresAt && (
                        <p className="text-gray-400 text-xs mt-2">Selected date: {new Date(form.expiresAt).toLocaleDateString('en-GB')}</p>
                      )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-3 ml-1 uppercase tracking-widest">Project Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="text"
                      className={`w-full bg-surface border-2 ${errors.address ? 'border-red-500' : 'border-border'} rounded-2xl py-5 pl-14 pr-6 focus:border-primary outline-none transition-all text-white placeholder-gray-600`}
                      placeholder="Street, Landmark, City..."
                      value={form.address}
                      onChange={(e) => setForm({...form, address: e.target.value})}
                    />
                  </div>
                  <InputError name="address" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 ml-1 uppercase tracking-widest">City</label>
                    <input 
                      type="text"
                      className={`w-full bg-surface border-2 ${errors.city ? 'border-red-500' : 'border-border'} rounded-2xl py-5 px-8 focus:border-primary outline-none transition-all text-white placeholder-gray-600`}
                      placeholder="e.g. Bengaluru"
                      value={form.city}
                      onChange={(e) => setForm({...form, city: e.target.value})}
                    />
                    <InputError name="city" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 ml-1 uppercase tracking-widest">State</label>
                    <input 
                      type="text"
                      className={`w-full bg-surface border-2 ${errors.state ? 'border-red-500' : 'border-border'} rounded-2xl py-5 px-8 focus:border-primary outline-none transition-all text-white placeholder-gray-600`}
                      placeholder="e.g. Karnataka"
                      value={form.state}
                      onChange={(e) => setForm({...form, state: e.target.value})}
                    />
                    <InputError name="state" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 ml-1 uppercase tracking-widest">Pin Code</label>
                    <input 
                      type="text"
                      maxLength={6}
                      className={`w-full bg-surface border-2 ${errors.pinCode ? 'border-red-500' : 'border-border'} rounded-2xl py-5 px-8 focus:border-primary outline-none transition-all text-white placeholder-gray-600`}
                      placeholder="400001"
                      value={form.pinCode}
                      onChange={(e) => setForm({...form, pinCode: e.target.value.replace(/\D/g, '')})}
                    />
                    <InputError name="pinCode" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 ml-1 uppercase tracking-widest">Project Scope (Optional)</label>
                    <div className="relative group">
                      <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                      <input 
                        type="text"
                        className="w-full bg-surface border-2 border-border rounded-2xl py-5 pl-14 pr-6 focus:border-primary outline-none transition-all text-white placeholder-gray-600"
                        placeholder="Expected completion days?"
                        value={form.scope}
                        onChange={(e) => setForm({...form, scope: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Upload Project Photos</h3>
                  <p className="text-gray-400 text-sm mb-6">Select up to 10 photos of the area that needs work. Real photos help contractors provide highly accurate bids.</p>
                  
                  <label className="w-full border-2 border-dashed border-border hover:border-primary/40 rounded-[2rem] p-10 flex flex-col items-center justify-center cursor-pointer transition-all bg-surface/10 hover:bg-surface/20">
                    <UploadCloud size={40} className="text-gray-500 mb-4" />
                    <span className="text-sm font-black text-gray-300">Choose Images or Drag here</span>
                    <span className="text-xs text-gray-500 mt-2">Supports JPG, PNG, WEBP (Max 5MB each)</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handlePhotoSelect} 
                    />
                  </label>
                  <InputError name="photos" />
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-border group bg-surface">
                        <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-10 flex items-center justify-between border-t border-white/5">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={prevStep}
                className="px-8 py-4 text-gray-400 font-bold flex items-center gap-2 hover:text-white transition-colors"
              >
                <ChevronLeft size={20} /> Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="px-10 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-2 hover:bg-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                type="submit"
                disabled={loading}
                className="px-12 py-5 bg-primary text-black font-black rounded-2xl flex items-center gap-3 glow-btn text-lg"
              >
                {loading ? 'Publishing...' : 'Publish Project'} <CheckCircle size={24} />
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
         <div className="text-center">
            <h4 className="font-bold text-white mb-2">Verified Bidders</h4>
            <p className="text-gray-500 text-sm">Only KYC-verified contractors can bid on your project.</p>
         </div>
         <div className="text-center">
            <h4 className="font-bold text-white mb-2">Compare Quotes</h4>
            <p className="text-gray-500 text-sm">Review full material breakdowns and timelines side-by-side.</p>
         </div>
         <div className="text-center">
            <h4 className="font-bold text-white mb-2">Safe & Secure</h4>
            <p className="text-gray-500 text-sm">Platform protection for payments and project milestones.</p>
         </div>
      </div>
    </div>
  );
};

export default CreateProject;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { projectApi } from '../api/apiClient';
import { PlusCircle, FileText, MapPin, IndianRupee, Tag, AlignLeft, Calendar } from 'lucide-react';

const CreateProject = () => {
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    minBudget: '',
    maxBudget: '',
    address: '',
    pinCode: '',
    scope: '',
    expiresAt: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (form.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!form.category) newErrors.category = 'Category is required';
    if (form.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    if (!form.minBudget || !form.maxBudget) newErrors.budget = 'Budget range is required';
    if (Number(form.minBudget) >= Number(form.maxBudget)) newErrors.budget = 'Max budget must be greater than Min';
    if (!form.address) newErrors.address = 'Address is required';
    if (!form.pinCode) newErrors.pinCode = 'Pin Code is required';
    if (!form.expiresAt) newErrors.expiresAt = 'Expiry date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await projectApi.createProject({
        title: form.title,
        category: form.category,
        description: form.description,
        budget: {
          min: Number(form.minBudget),
          max: Number(form.maxBudget),
        },
        location: {
          coordinates: [77.5946, 12.9716], // Default Bangalore for demo
          address: form.address,
          pinCode: form.pinCode,
        },
        scope: form.scope,
        expiresAt: form.expiresAt,
        // Mocking photos as per sample requirements
        photos: [
          {
            url: "https://example.com/placeholder.jpg",
            publicId: "placeholder_1"
          }
        ]
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.message || 'Failed to create project';
      setErrors({ server: serverMsg });
    } finally {
      setLoading(false);
    }
  };

  const InputError = ({ name }) => (
    errors[name] ? <span className="text-red-500 text-xs mt-1 ml-1">{errors[name]}</span> : null
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 rounded-3xl"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
            <PlusCircle className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Describe your project</h1>
            {/* <p className="text-gray-400 text-sm">Targeting professionals 25-45. Provide clear project details.</p> */}
          </div>
        </div>

        {errors.server && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">
            {errors.server}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Project Title*</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  className={`w-full bg-background border ${errors.title ? 'border-red-500' : 'border-border'} rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none transition-all`}
                  placeholder="e.g. Modern Kitchen Renovation"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                />
              </div>
              <InputError name="title" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Category*</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <select 
                  className={`w-full bg-background border ${errors.category ? 'border-red-500' : 'border-border'} rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none transition-all appearance-none`}
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {[
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
                  ].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <InputError name="category" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Detailed Description*</label>
            <textarea 
              rows={4}
              className={`w-full bg-background border ${errors.description ? 'border-red-500' : 'border-border'} rounded-xl py-4 px-6 focus:border-primary outline-none transition-all`}
              placeholder="Describe the project requirement in detail..."
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
            <InputError name="description" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Project Scope</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 text-gray-500" size={18} />
              <textarea 
                rows={3}
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none transition-all"
                placeholder="Specific tasks or deliverables..."
                value={form.scope}
                onChange={(e) => setForm({...form, scope: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Budget Range (₹)*</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="number" placeholder="Min"
                  className={`w-full bg-background border ${errors.budget ? 'border-red-500' : 'border-border'} rounded-xl py-3 px-4 focus:border-primary outline-none transition-all`}
                  value={form.minBudget}
                  onChange={(e) => setForm({...form, minBudget: e.target.value})}
                />
                <span className="text-gray-500">—</span>
                <input 
                  type="number" placeholder="Max"
                  className={`w-full bg-background border ${errors.budget ? 'border-red-500' : 'border-border'} rounded-xl py-3 px-4 focus:border-primary outline-none transition-all`}
                  value={form.maxBudget}
                  onChange={(e) => setForm({...form, maxBudget: e.target.value})}
                />
              </div>
              <InputError name="budget" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Expires At*</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="date"
                  className={`w-full bg-background border ${errors.expiresAt ? 'border-red-500' : 'border-border'} rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none transition-all`}
                  value={form.expiresAt}
                  onChange={(e) => setForm({...form, expiresAt: e.target.value})}
                />
              </div>
              <InputError name="expiresAt" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Full Address*</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text"
                  className={`w-full bg-background border ${errors.address ? 'border-red-500' : 'border-border'} rounded-xl py-3 pl-12 pr-4 focus:border-primary outline-none transition-all`}
                  placeholder="Street, City, State"
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
                />
              </div>
              <InputError name="address" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Pin Code*</label>
              <input 
                type="text"
                className={`w-full bg-background border ${errors.pinCode ? 'border-red-500' : 'border-border'} rounded-xl py-3 px-4 focus:border-primary outline-none transition-all`}
                placeholder="560001"
                value={form.pinCode}
                onChange={(e) => setForm({...form, pinCode: e.target.value})}
              />
              <InputError name="pinCode" />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-extrabold py-5 rounded-2xl glow-btn flex items-center justify-center gap-2 text-xl"
            >
              {loading ? 'Publishing...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProject;

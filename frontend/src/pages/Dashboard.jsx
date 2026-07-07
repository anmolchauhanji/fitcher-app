import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDateDMY } from '../utils/formatDate';
import { projectApi, contractorApi } from '../api/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  Clock, 
  IndianRupee, 
  ArrowUpRight, 
  Search, 
  Filter, 
  Briefcase,
  AlertCircle,
  ChevronRight,
  Zap,
  Hand
} from 'lucide-react';

const CATEGORIES = [
  'Plumber', 'Electrician', 'Painter', 'Carpenter', 'Mason',
  'Tile Installer', 'Marble & Granite Contractor', 'Flooring Contractor',
  'POP Contractor', 'False Ceiling Contractor', 'Waterproofing Contractor',
  'Roofing Contractor', 'Welder', 'Fabricator', 'Steel Contractor',
  'Aluminium Fabricator', 'Glass Installer', 'Door & Window Installer',
  'Interior Designer', 'Architect', 'Civil Contractor', 'General Contractor',
  'Building Contractor', 'Demolition Contractor', 'Excavation Contractor',
  'Paver Block Contractor', 'Road Contractor', 'Borewell Contractor',
  'Solar Panel Installer', 'CCTV Installer', 'Security System Installer',
  'AC Technician', 'HVAC Contractor', 'Lift Installer', 'Generator Technician',
  'Home Automation Installer', 'Modular Kitchen Installer', 'Furniture Maker',
  'Wood Polish Contractor', 'Wallpaper Installer', 'Curtain & Blinds Installer',
  'Garden & Landscaping Contractor', 'Swimming Pool Contractor',
  'Water Tank Cleaning', 'House Cleaning', 'Pest Control',
  'Septic Tank Service', 'Construction Consultant', 'Project Management Consultant',
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ category: '', pinCode: '', keyword: '' });
  const [contractorProfile, setContractorProfile] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    const category = filters.category || (user?.role === 'contractor' ? contractorProfile?.tradeCategories : undefined);
    const pincode = filters.pinCode || (user?.role === 'contractor' ? contractorProfile?.servicePinCodes : undefined);

    try {
      const response = await projectApi.searchProjects({
        category: category || undefined,
        pincode: pincode || undefined,
        keyword: filters.keyword || undefined,
      });
      const projectList = response.data.data || [];
      setProjects(projectList);
      setRecentProjects([...projectList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadContractorProfile = async () => {
    try {
      const response = await contractorApi.getMyContractorProfile();
      setContractorProfile(response.data.data);
    } catch (err) {
      setContractorProfile(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  useEffect(() => {
    if (user?.role === 'customer') {
      navigate('/my-projects');
      return;
    }

    if (user?.role === 'contractor') {
      loadContractorProfile();
    } else {
      fetchProjects();
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.role === 'contractor' && contractorProfile) {
      fetchProjects();
    }
  }, [contractorProfile, filters]);

  useEffect(() => {
    if (user?.role === 'customer') {
      fetchProjects();
    }
  }, [filters]);

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto page-enter">
      {/* ── GREETING & ROLE INDICATOR ────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col md:flex-row md:items-center justify-between bg-surface/30 border border-white/5 p-6 rounded-[2rem]"
      >
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border-2 ${
             user?.role === 'customer' ? 'border-blue-500/20 bg-blue-500/10 text-blue-400' : 'border-primary/20 bg-primary/10 text-primary'
          }`}>
             {user?.role === 'customer' ? <Zap size={32} /> : <Briefcase size={32} />}
          </div>
          <div>
            <div className="flex items-center gap-2 text-gray-500 font-bold text-sm uppercase tracking-widest mb-1">
               <Hand size={14} /> Namaste,
            </div>
            <h2 className="text-3xl font-black text-white">{user?.name}</h2>
          </div>
        </div>

        <div className="mt-6 md:mt-0 flex flex-col items-end gap-2">
          {user?.role === 'customer' ? (
            <div className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest border-2 border-blue-500/20 bg-blue-500/5 text-blue-400">
              Premium Client
            </div>
          ) : (
            <div className="flex flex-col items-end gap-1.5">
              <div className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest border-2 ${
                contractorProfile?.verificationStatus === 'verified'
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                  : contractorProfile?.verificationStatus === 'rejected'
                  ? 'border-red-500/20 bg-red-500/5 text-red-400'
                  : contractorProfile?.verificationStatus === 'suspended'
                  ? 'border-gray-500/20 bg-gray-500/5 text-gray-400'
                  : 'border-amber-500/20 bg-amber-500/5 text-amber-400'
              }`}>
                {contractorProfile?.verificationStatus === 'verified'
                  ? 'Verified Partner'
                  : contractorProfile?.verificationStatus === 'rejected'
                  ? 'Verification Rejected'
                  : contractorProfile?.verificationStatus === 'suspended'
                  ? 'Verification Suspended'
                  : 'Verification Pending'}
              </div>
              <Link
                to="/contractor/profile"
                className="text-xs text-primary hover:underline font-bold flex items-center gap-0.5 transition-all opacity-80 hover:opacity-100"
              >
                Update Profile & KYC <ChevronRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── HEADER & SEARCH ───────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Briefcase size={14} /> Open Bids
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Project Marketplace</h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Discover active projects matching your expertise and location. Browse, filter, and start bidding.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSearch} 
          className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-3xl"
        >
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              className="w-full bg-surface/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-600"
              placeholder="Keyword..."
              value={filters.keyword}
              onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
            />
          </div>

          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              className="w-full bg-surface/50 border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-600"
              placeholder="Pin code..."
              value={filters.pinCode}
              onChange={(e) => setFilters((prev) => ({ ...prev, pinCode: e.target.value }))}
            />
          </div>

          <div className="relative min-w-[200px]">
            <select
              className="w-full bg-surface/50 border border-border rounded-2xl py-4 pl-4 pr-10 outline-none focus:border-primary transition-all appearance-none text-white font-medium"
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button
            type="submit"
            className="px-8 py-4 bg-primary text-black rounded-2xl font-black hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 glow-btn"
          >
            Search
          </button>
        </motion.form>
      </div>

      {user?.role === 'contractor' && recentProjects.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-black mb-2">Recently added</p>
              <h3 className="text-2xl font-black text-white">Fresh projects near you</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {recentProjects.map((project) => {
              const created = new Date(project.createdAt);
              const now = new Date();
              const hours = Math.max(1, Math.round((now - created) / (1000 * 60 * 60)));
              const timeLabel = hours < 24 ? `${hours} hours ago` : created.toDateString() === now.toDateString() ? 'Today' : created.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString() ? 'Yesterday' : created.toLocaleDateString();
              return (
                <div key={project._id} className="glass-card rounded-[1.5rem] p-5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">New</span>
                    <span className="text-xs text-gray-500">{timeLabel}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 line-clamp-2">{project.title}</h4>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                  <Link to={`/project/${project._id}`} className="text-sm font-semibold text-primary">View details</Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CONTENT ───────────────────────────────────── */}
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl mb-12 flex items-center gap-3"
        >
          <AlertCircle size={20} /> {error}
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-[280px] skeleton border border-white/5"></div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-[2rem] p-24 text-center border-dashed border-2 border-white/5"
        >
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No projects found</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            Try adjusting your search filters or pin code to find more opportunities.
          </p>
          <button 
            onClick={() => { setFilters({category: '', pinCode: ''}); fetchProjects(); }}
            className="text-primary font-bold hover:underline underline-offset-4"
          >
            Clear all filters
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card rounded-[2rem] p-8 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg border border-primary/20 uppercase tracking-[0.15em]">
                      {project.category}
                    </span>
                    <span className="text-gray-500 text-xs flex items-center gap-1.5 font-medium">
                      <Clock size={14} /> {formatDateDMY(project.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">{project.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-8 leading-relaxed">{project.description}</p>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3 text-gray-300 text-sm bg-white/5 p-3 rounded-xl border border-white/5 transition-colors group-hover:border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-gray-500/10 flex items-center justify-center text-gray-500">
                        <MapPin size={16} />
                      </div>
                      <span className="line-clamp-1">{project.location.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300 text-sm bg-white/5 p-3 rounded-xl border border-white/5 transition-colors group-hover:border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <IndianRupee size={16} />
                      </div>
                      <span className="font-black text-white">₹{project.budget.min.toLocaleString()} — ₹{project.budget.max.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/project/${project._id}`}
                  className="w-full py-4 bg-white/5 border border-white/10 group-hover:bg-primary group-hover:text-black group-hover:border-primary rounded-xl flex items-center justify-center gap-2 font-black transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20"
                >
                  View Details <ChevronRight size={18} />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

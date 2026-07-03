import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectApi } from '../api/apiClient';
import { CATEGORIES } from '../constants/categories';
import {
  Clock,
  IndianRupee,
  MapPin,
  CheckCircle,
  XCircle,
  ChevronRight,
  Plus,
  AlertCircle,
  Activity,
  History,
  Search as SearchIcon,
  Filter
} from 'lucide-react';

const MyProjects = () => {
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(location.state?.message || '');
  const [filters, setFilters] = useState({ category: '', pinCode: '', keyword: '' });

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await projectApi.getMyProjects();
      const data = response.data.data || [];
      setProjects(data);
      setFilteredProjects(applyFilters(data, filters));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your projects');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data, currentFilters) => {
    const keyword = currentFilters.keyword?.trim().toLowerCase() || '';
    const pinCode = currentFilters.pinCode?.trim() || '';
    const category = currentFilters.category || '';

    return data.filter((project) => {
      const matchesCategory = !category || project.category === category;
      const matchesPinCode = !pinCode || project.location?.pinCode?.includes(pinCode);
      const haystack = `${project.title} ${project.description} ${project.category} ${project.location?.address || ''}`.toLowerCase();
      const matchesKeyword = !keyword || haystack.includes(keyword);
      return matchesCategory && matchesPinCode && matchesKeyword;
    });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    setFilteredProjects(applyFilters(projects, filters));
  }, [filters, projects]);

  const updateStatus = async (projectId, status) => {
    setActionLoading(projectId);
    setMessage('');
    try {
      await projectApi.updateProject(projectId, { status });
      setProjects((prev) => prev.map((project) => project._id === projectId ? { ...project, status } : project));
      setMessage('Project status updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to update project');
    } finally {
      setActionLoading(null);
    }
  };

  const closeProject = async (projectId) => {
    setActionLoading(projectId);
    setMessage('');
    try {
      await projectApi.closeProject(projectId);
      setProjects((prev) => prev.map((project) => project._id === projectId ? { ...project, status: 'cancelled' } : project));
      setMessage('Project closed successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to close project');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'badge-open';
      case 'in_progress': return 'badge-in_progress';
      case 'completed': return 'badge-completed';
      case 'cancelled': return 'badge-cancelled';
      default: return 'bg-white/5 text-gray-400 border border-white/10';
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto page-enter">
      {/* ── HEADER ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
             <Activity size={14} /> Manage Projects
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">My Projects</h1>
          <p className="text-gray-400 mt-2 text-lg">Track and manage the progress of projects you've posted.</p>
        </motion.div>

        <Link
          to="/create-project"
          className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-black font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all glow-btn"
        >
          <Plus size={20} /> Post New Project
        </Link>
      </div>

      {/* ── NOTIFICATIONS ─────────────────────────────── */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 px-6 py-4 rounded-2xl mb-12 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={20} /> <span>{message}</span>
            </div>
            <button onClick={() => setMessage('')} className="text-emerald-400/50 hover:text-emerald-400 transition-colors">
              <XCircle size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl mb-12 flex items-center gap-3">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="mb-10 glass-card rounded-[2rem] p-6 border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-black mb-2">Search your projects</p>
            <h2 className="text-2xl font-black text-white">Find projects by category, pincode, or keyword</h2>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full lg:max-w-3xl">
            <div className="relative">
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={filters.keyword}
                onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                className="w-full bg-background border border-border rounded-2xl py-3 pl-9 pr-3 text-sm outline-none"
                placeholder="Keyword"
              />
            </div>
            <div className="relative">
              <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={filters.pinCode}
                onChange={(e) => setFilters((prev) => ({ ...prev, pinCode: e.target.value }))}
                className="w-full bg-background border border-border rounded-2xl py-3 pl-9 pr-3 text-sm outline-none"
                placeholder="Pin code"
              />
            </div>
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <select
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full bg-background border border-border rounded-2xl py-3 pl-9 pr-3 text-sm outline-none"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </form>
        </div>
      </div>

      {/* ── PROJECT LIST ──────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="h-72 skeleton rounded-[2rem] border border-white/5" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-[3rem] p-24 text-center border-dashed border-2 border-white/5"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
             <History size={40} className="text-gray-600" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">No projects yet</h2>
          <p className="text-gray-500 max-w-sm mx-auto mb-10 text-lg leading-relaxed">
            You haven't posted any projects. Start reaching out to thousands of top-tier contractors today.
          </p>
          <Link
            to="/create-project"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-[1.05] transition-all"
          >
            <Plus size={20} /> Post Your First Project
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-[2.5rem] p-10 flex flex-col justify-between group overflow-hidden relative"
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div>
                <div className="flex items-center justify-between gap-4 mb-8">
                  <span className="px-3 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg border border-primary/20 uppercase tracking-[0.15em]">
                    {project.category}
                  </span>
                  <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${getStatusClass(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-4 text-white group-hover:text-primary transition-colors">{project.title}</h2>
                <p className="text-gray-400 text-sm line-clamp-2 mb-8 leading-relaxed max-w-lg">{project.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                      <MapPin size={16} />
                    </div>
                    <span className="line-clamp-1">{project.location.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <IndianRupee size={16} />
                    </div>
                    <span className="font-bold">₹{project.budget.min.toLocaleString()} — ₹{project.budget.max.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 text-sm">
                     <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-500">
                        <Clock size={16} />
                     </div>
                     <span>Posted on {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-10 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                <Link
                  to={`/project/${project._id}`}
                  className="flex-1 text-center py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all text-sm flex items-center justify-center gap-2"
                >
                  Project Details <ChevronRight size={18} />
                </Link>
                <Link
                  to={`/project/${project._id}/bids`}
                  className="flex-1 text-center py-4 bg-primary text-black rounded-2xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all text-sm"
                >
                  View Bids
                </Link>
                
                <div className="flex-[1.5] flex gap-3">
                  {project.status === 'open' && (
                    <button
                      type="button"
                      disabled={actionLoading === project._id}
                      onClick={() => updateStatus(project._id, 'in_progress')}
                      className="flex-1 bg-primary text-black py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {actionLoading === project._id ? 'Updating...' : 'Start Project'}
                    </button>
                  )}
                  {project.status === 'in_progress' && (
                    <button
                      type="button"
                      disabled={actionLoading === project._id}
                      onClick={() => updateStatus(project._id, 'completed')}
                      className="flex-1 bg-emerald-500 text-black py-4 rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {actionLoading === project._id ? 'Updating...' : 'Complete Project'}
                    </button>
                  )}
                  {project.status === 'open' && (
                    <button
                      type="button"
                      disabled={actionLoading === project._id}
                      onClick={() => closeProject(project._id)}
                      className="px-6 bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-2xl font-black text-sm hover:bg-red-500 hover:text-black transition-all disabled:opacity-50"
                    >
                      {actionLoading === project._id ? '...' : 'Close'}
                    </button>
                  )}
                  {(project.status === 'completed' || project.status === 'cancelled') && (
                    <div className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-gray-500 text-sm font-bold text-center">
                      Project {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;

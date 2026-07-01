import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectApi } from '../api/apiClient';
import { Link } from 'react-router-dom';
import { MapPin, Clock, IndianRupee, ArrowUpRight, Search, Filter } from 'lucide-react';

const categories = [
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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ category: '', pinCode: '' });

  const fetchProjects = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await projectApi.searchProjects(params);
      setProjects(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchProjects({ category: filters.category, pincode: filters.pinCode });
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2 text-white">Project Marketplace</h1>
          <p className="text-gray-400">Discover open projects matching your trade and location.</p>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          <div className="relative">
            <select
              className="w-full bg-surface border border-border rounded-xl py-3 pl-4 pr-10 outline-none focus:border-primary transition-all appearance-none"
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-primary transition-all"
              placeholder="Pin code"
              value={filters.pinCode}
              onChange={(e) => setFilters((prev) => ({ ...prev, pinCode: e.target.value }))}
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-black rounded-xl font-bold hover:opacity-90 transition-all"
          >
            <Filter size={18} /> Search
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-8 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-surface/50 animate-pulse rounded-3xl border border-border"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="glass-card rounded-3xl p-6 relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20 uppercase tracking-wider">
                  {project.category}
                </span>
                <span className="text-gray-400 text-sm flex items-center gap-1">
                  <Clock size={14} /> {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-2 mb-6">{project.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <MapPin size={16} className="text-gray-500" />
                  {project.location.address}
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <IndianRupee size={16} className="text-gray-500" />
                  <span className="font-bold">₹{project.budget.min} - ₹{project.budget.max}</span>
                </div>
              </div>

              <Link
                to={`/project/${project._id}`}
                className="w-full py-3 bg-white/5 border border-white/10 group-hover:bg-primary group-hover:text-black hover:border-primary rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
              >
                View Details <ArrowUpRight size={18} />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

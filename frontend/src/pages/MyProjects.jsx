import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectApi } from '../api/apiClient';
import { ArrowUpRight, Clock, IndianRupee, MapPin, CheckCircle, XCircle } from 'lucide-react';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await projectApi.getMyProjects();
      setProjects(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-white">My Projects</h1>
          <p className="text-gray-400">Manage the projects you created and update their status quickly.</p>
        </div>
        <Link
          to="/create-project"
          className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-black font-bold rounded-2xl hover:opacity-90 transition-all"
        >
          <ArrowUpRight size={16} /> New Project
        </Link>
      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 px-4 py-3 rounded-xl mb-8 text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-8 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="h-72 bg-surface/50 animate-pulse rounded-3xl border border-border" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-surface border border-border rounded-3xl p-12 text-center text-gray-400">
          No projects found yet. Start by creating a new project.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20 uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">{project.title}</h2>
                <p className="text-gray-400 text-sm line-clamp-3 mb-6">{project.description}</p>
                <div className="grid grid-cols-1 gap-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    {project.location.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee size={16} className="text-gray-500" />
                    ₹{project.budget.min} - ₹{project.budget.max}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  to={`/project/${project._id}`}
                  className="block w-full text-center py-3 border border-white/10 rounded-2xl hover:bg-white/5 transition-all"
                >
                  View Details
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.status === 'open' && (
                    <button
                      type="button"
                      disabled={actionLoading === project._id}
                      onClick={() => updateStatus(project._id, 'in_progress')}
                      className="w-full bg-primary text-black py-3 rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-60"
                    >
                      {actionLoading === project._id ? 'Updating...' : 'Start Work'}
                    </button>
                  )}
                  {project.status === 'in_progress' && (
                    <button
                      type="button"
                      disabled={actionLoading === project._id}
                      onClick={() => updateStatus(project._id, 'completed')}
                      className="w-full bg-emerald-500 text-black py-3 rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-60"
                    >
                      {actionLoading === project._id ? 'Updating...' : 'Mark Complete'}
                    </button>
                  )}
                  {project.status === 'open' && (
                    <button
                      type="button"
                      disabled={actionLoading === project._id}
                      onClick={() => closeProject(project._id)}
                      className="w-full bg-red-500 text-black py-3 rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-60"
                    >
                      {actionLoading === project._id ? 'Closing...' : 'Close Project'}
                    </button>
                  )}
                  {project.status !== 'open' && project.status !== 'in_progress' && (
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 text-gray-300">
                      <CheckCircle size={16} /> {project.status.replace('_', ' ')}
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

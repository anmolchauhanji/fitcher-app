import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectApi } from '../api/apiClient';
import { MapPin, Calendar, IndianRupee, Tag, Send, ArrowLeft, ShieldCheck, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const userId = user?.id || user?._id;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await projectApi.getProjectDetails(id);
        setProject(response.data.data);
      } catch (err) {
        setMessage('Could not load project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const closeProject = async () => {
    if (!project) return;
    setActionLoading(true);
    setMessage('');
    try {
      await projectApi.closeProject(project._id);
      setProject((prev) => prev ? { ...prev, status: 'cancelled' } : prev);
      setMessage('Project closed successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to close project.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="pt-32 text-center text-primary">Loading...</div>;
  if (!project) return <div className="pt-32 text-center">Project not found</div>;

  const isOwner = Boolean(
    project.customerId === userId || project.customerId?._id === userId
  );
  const isOpen = project.status === 'open';

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Back to dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20 uppercase tracking-widest">
                {project.category}
              </span>
              <span className="text-sm text-gray-500">Posted on {new Date(project.createdAt).toLocaleDateString()}</span>
              <span className="text-sm px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">
                {project.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{project.title}</h1>

            <div className="flex flex-wrap gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="text-primary" size={20} />
                <span>{project.location.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="text-primary" size={20} />
                <span>ID: {project._id.slice(-6).toUpperCase()}</span>
              </div>
            </div>
          </motion.div>

          <div className="h-px bg-white/5" />

          <section>
            <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
            <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </section>

          {project.scope && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Detailed Scope</h2>
              <div className="bg-surface p-6 rounded-2xl border border-border">
                <p className="text-gray-300 leading-relaxed">{project.scope}</p>
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl sticky top-32">
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-1">Budget Range</p>
              <div className="flex items-center gap-2 text-3xl font-black text-white">
                <IndianRupee className="text-primary" />
                <span>₹{project.budget.min} — ₹{project.budget.max}</span>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-400 text-sm mb-1">Bidding Deadline</p>
              <div className="flex items-center gap-2 text-lg font-bold text-gray-200">
                <Calendar className="text-primary" size={20} />
                <span>{new Date(project.expiresAt).toLocaleDateString()}</span>
              </div>
            </div>

            {isOwner && isOpen && (
              <button
                onClick={closeProject}
                disabled={actionLoading}
                className="w-full bg-red-500 text-black font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                <XCircle size={18} /> {actionLoading ? 'Closing...' : 'Close Project'}
              </button>
            )}

            {user?.role === 'contractor' && (
              <div className="space-y-4">
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="number"
                    className="w-full bg-background border border-border rounded-xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all font-bold text-lg"
                    placeholder="Enter your quote"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                  />
                </div>
                <button className="w-full bg-primary text-black font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 glow-btn">
                  <Send size={18} /> Submit Bid
                </button>
                <p className="text-center text-xs text-gray-500">10% service fee applies on successful completion.</p>
              </div>
            )}

            {message && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;

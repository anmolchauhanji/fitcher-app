import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { bidApi, projectApi } from '../api/apiClient';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  AlertCircle,
  Star,
  BadgeCheck,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getStatusClass = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20';
    case 'accepted':
      return 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20';
    case 'rejected':
      return 'bg-red-500/10 text-red-300 border border-red-500/20';
    case 'withdrawn':
      return 'bg-slate-500/10 text-slate-300 border border-slate-500/20';
    default:
      return 'bg-white/5 text-gray-300 border border-white/10';
  }
};

const ProjectBids = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchProjectBids = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const [bidsResponse, projectResponse] = await Promise.all([
        bidApi.getProjectBids(id),
        projectApi.getProjectDetails(id),
      ]);

      setBids(bidsResponse.data?.data || []);
      setProject(projectResponse.data?.data || null);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Unable to load bids for this project.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProjectBids();
    }
  }, [id]);

  const handleAction = async (bidId, action) => {
    setActionLoading(bidId);
    setMessage({ type: '', text: '' });

    try {
      if (action === 'accept') {
        await bidApi.acceptBid(bidId);
        setMessage({ type: 'success', text: 'Bid accepted successfully.' });
      } else if (action === 'reject') {
        await bidApi.rejectBid(bidId);
        setMessage({ type: 'success', text: 'Bid rejected successfully.' });
      }
      await fetchProjectBids();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Unable to update bid status.',
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 max-w-6xl mx-auto page-enter">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-black mb-3">Customer bid board</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">Project Bids</h1>
          <p className="text-gray-400 mt-3 max-w-2xl">
            Review contractor proposals, accept the best match, or reject bids that don't fit your project.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <Link
            to="/my-projects"
            className="px-6 py-4 bg-primary text-black rounded-2xl text-sm font-black hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            My Projects
          </Link>
        </div>
      </div>

      {message.text && (
        <div className={`mb-8 p-5 rounded-2xl border ${message.type === 'error' ? 'border-red-500/20 bg-red-500/10 text-red-300' : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-64 rounded-[2rem] border border-white/10 bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : !project ? (
        <div className="glass-card rounded-[2rem] p-16 text-center border border-white/10">
          <AlertCircle size={36} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-3xl font-black text-white mb-3">Project not found</h2>
          <p className="text-gray-400">We could not find the selected project. Try returning to My Projects.</p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="glass-card rounded-[2rem] p-8 border border-white/10 bg-white/5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-gray-500 font-bold mb-2">{project.category}</div>
                <h2 className="text-3xl font-black text-white mb-2">{project.title}</h2>
                <p className="text-gray-400 max-w-2xl">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-sm text-gray-300">
                  <div className="font-bold text-white">{project.budget?.min?.toLocaleString()} —</div>
                  <div className="text-gray-400 text-xs">Budget</div>
                </div>
                <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-sm text-gray-300">
                  <div className="font-bold text-white">{project.status.replace('_', ' ')}</div>
                  <div className="text-gray-400 text-xs">Status</div>
                </div>
                <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-sm text-gray-300">
                  <div className="font-bold text-white">{project.location?.pinCode}</div>
                  <div className="text-gray-400 text-xs">Pin code</div>
                </div>
              </div>
            </div>
          </div>

          {bids.length === 0 ? (
            <div className="glass-card rounded-[2rem] p-16 text-center border border-dashed border-white/10">
              <Briefcase size={48} className="mx-auto mb-4 text-gray-500" />
              <h3 className="text-2xl font-bold text-white mb-2">No bids yet</h3>
              <p className="text-gray-400 max-w-lg mx-auto">Once contractors submit proposals, they will appear here for review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {bids.map((bid) => (
                  <motion.div
                    key={bid._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-[2rem] p-8 border border-white/10"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-400 text-sm min-w-0">
                          <div className="w-11 h-11 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-black flex-shrink-0">
                            {bid.contractorId?.userId?.name?.charAt(0) || 'C'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-white truncate max-w-[220px]">{bid.contractorId?.userId?.name || 'Unknown Contractor'}</div>
                            <div className="text-sm text-gray-400 truncate max-w-[220px]">{bid.contractorId?.businessName || 'Business name unavailable'}</div>
                          </div>
                        </div>
                        <div className="text-white text-2xl font-black">₹{bid.totalCost?.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">{bid.coverNote}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 min-w-[260px]">
                        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-sm text-gray-300">
                          <div className="font-bold text-white">{bid.completionDays} days</div>
                          <div className="text-gray-400 text-xs">Timeline</div>
                        </div>
                        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-sm text-gray-300">
                          <div className="font-bold text-white">{bid.materialDetails?.slice(0, 40) || '-'}</div>
                          <div className="text-gray-400 text-xs">Material info</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs uppercase tracking-[0.2em] font-black ${getStatusClass(bid.status)}`}>
                          <ShieldCheck size={14} /> {bid.status.replace('_', ' ')}
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-gray-300">
                          <Star size={14} className="text-amber-400" /> {bid.contractorId?.averageRating || 0}/5
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-gray-300">
                          <BadgeCheck size={14} className="text-primary" /> {bid.contractorId?.verificationStatus || 'pending'}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Link to={`/contractors/${bid.contractorId?._id}`} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-white/10">
                          <ExternalLink size={16} /> View Profile
                        </Link>
                      </div>

                      {bid.status === 'pending' && user?.role === 'customer' && (
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleAction(bid._id, 'reject')}
                            disabled={actionLoading === bid._id}
                            className="px-5 py-3 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            {actionLoading === bid._id ? 'Rejecting...' : 'Reject Bid'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(bid._id, 'accept')}
                            disabled={actionLoading === bid._id}
                            className="px-5 py-3 rounded-2xl bg-emerald-500 text-black font-black hover:scale-[1.02] transition-all"
                          >
                            {actionLoading === bid._id ? 'Accepting...' : 'Accept Bid'}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectBids;

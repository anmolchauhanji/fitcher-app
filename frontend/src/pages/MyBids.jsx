import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { bidApi } from '../api/apiClient';
import {
  Briefcase,
  AlertCircle,
  MapPin,
} from 'lucide-react';

const MyBids = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchMyBids = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await bidApi.getMyBids();
      setBids(response.data?.data || []);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Unable to load your bids.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBids();
  }, []);

  const handleEditBid = async (bid) => {
    try {
      await bidApi.withdrawBid(bid._id);
      await fetchMyBids();
      navigate(`/project/${bid.projectId?._id}`, { state: { editBid: true } });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Unable to edit bid.' });
    }
  };

  const handleWithdrawBid = async (bidId) => {
    try {
      await bidApi.withdrawBid(bidId);
      await fetchMyBids();
      setMessage({ type: 'success', text: 'Bid withdrawn successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Unable to withdraw bid.' });
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 max-w-6xl mx-auto page-enter">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-black mb-3">Contractor bids</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">My Bids</h1>
          <p className="text-gray-400 mt-3 max-w-2xl">
            Track your proposals, view project details, and manage your bid status.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black hover:bg-white/10 transition-all"
        >
          Browse Projects
        </Link>
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
      ) : bids.length === 0 ? (
        <div className="glass-card rounded-[2rem] p-16 text-center border border-dashed border-white/10">
          <Briefcase size={48} className="mx-auto mb-4 text-gray-500" />
          <h3 className="text-2xl font-bold text-white mb-2">No active bids yet</h3>
          <p className="text-gray-400 max-w-lg mx-auto">Submit new proposals from the marketplace to see them listed here.</p>
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
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                      <div className="w-11 h-11 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 text-gray-400">
                        <MapPin size={18} />
                      </div>
                      <span>{bid.projectId?.title || 'Project title unavailable'}</span>
                    </div>
                    <div className="text-white text-2xl font-black">₹{bid.totalCost?.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm leading-relaxed line-clamp-3">{bid.coverNote}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 min-w-[220px]">
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-sm text-gray-300">
                      <div className="font-bold text-white">{bid.completionDays} days</div>
                      <div className="text-gray-400 text-xs">Timeline</div>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-sm text-gray-300">
                      <div className="font-bold text-white">{bid.status.replace('_', ' ')}</div>
                      <div className="text-gray-400 text-xs">Status</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/project/${bid.projectId?._id}`}
                    className="flex-1 text-center py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all"
                  >
                    View Bid
                  </Link>
                  {bid.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEditBid(bid)}
                        className="flex-1 text-center py-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-2xl font-bold hover:bg-amber-500/20 transition-all"
                      >
                        Edit Bid
                      </button>
                      <button
                        type="button"
                        onClick={() => handleWithdrawBid(bid._id)}
                        className="flex-1 text-center py-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl font-bold hover:bg-red-500/20 transition-all"
                      >
                        Withdraw Bid
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MyBids;

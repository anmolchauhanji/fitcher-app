import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workOrderApi, reviewApi } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  Star, 
  MessageSquare, 
  X, 
  Calendar,
  ShieldCheck,
  User,
  Building2,
  AlertCircle
} from 'lucide-react';

const WorkOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Review modal state
  const [reviewOrder, setReviewOrder] = useState(null); // The order currently being reviewed
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');

  const fetchWorkOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = user.role === 'customer' 
        ? await workOrderApi.getCustomerWorkOrders() 
        : await workOrderApi.getContractorWorkOrders();
      setOrders(response.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load work orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorkOrders();
    }
  }, [user]);

  const handleMarkComplete = async (orderId) => {
    setError('');
    try {
      const res = await workOrderApi.completeWorkOrder(orderId);
      const updatedOrder = res.data.data;
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'completed', completedAt: updatedOrder.completedAt } : o));
      
      // Find the order that was completed to open the review modal
      const completed = orders.find(o => o._id === orderId);
      if (completed) {
        setReviewOrder(completed);
        setRating(5);
        setComment('');
        setReviewError('');
        setReviewMessage('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete work order.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewOrder) return;
    if (comment.trim().length < 10) {
      setReviewError('Review comment must be at least 10 characters.');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    setReviewMessage('');
    try {
      await reviewApi.createReview({
        projectId: reviewOrder.projectId?._id || reviewOrder.projectId,
        contractorId: reviewOrder.contractorId?._id || reviewOrder.contractorId,
        rating,
        comment,
        reviewType: 'customer_to_contractor'
      });
      setReviewMessage('Thank you! Your review has been submitted.');
      setTimeout(() => {
        setReviewOrder(null);
      }, 2000);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review. You may have already reviewed this contractor.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="pt-36 pb-20 px-4 md:px-6 max-w-6xl mx-auto space-y-6 page-enter">
        <h1 className="text-3xl font-black text-white mb-2">Work Orders</h1>
        {[1, 2].map((i) => (
          <div key={i} className="skeleton h-48 w-full rounded-[2rem]" />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-36 pb-20 px-4 md:px-6 max-w-6xl mx-auto page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Work Orders</h1>
          <p className="text-gray-400 text-sm mt-1">
            {user.role === 'customer' 
              ? 'Manage active service milestones and mark them complete.' 
              : 'Track active contracts and project completions.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <motion.div
              layout
              key={order._id}
              className="glass-card p-6 md:p-8 rounded-[2rem] border border-white/5 relative overflow-hidden"
            >
              {/* Top Row Status & Date */}
              <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'active' ? 'badge-open' :
                  order.status === 'completed' ? 'badge-completed' : 'badge-cancelled'
                }`}>
                  {order.status}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Calendar size={14} /> Started: {formatDate(order.startedAt)}
                </span>
              </div>

              {/* Title & Contractor info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2">
                  <h2 className="text-2xl font-black text-white mb-2">
                    {order.projectId?.title || 'Project Details'}
                  </h2>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {order.projectId?.description}
                  </p>

                  <div className="flex flex-wrap gap-6 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      {user.role === 'customer' ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <Building2 size={14} />
                          </div>
                          <span>
                            Contractor: <strong className="text-white">{order.contractorId?.businessName || 'Verified Expert'}</strong>
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <User size={14} />
                          </div>
                          <span>
                            Client: <strong className="text-white">{order.customerId?.name || 'Customer'}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount, Days & Call to Actions */}
                <div className="flex flex-col md:items-end justify-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 md:bg-transparent md:border-none md:p-0">
                  <div className="flex md:flex-col items-baseline justify-between md:justify-end gap-2 w-full md:w-auto">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Agreed Value</span>
                    <span className="text-xl font-black text-primary flex items-center gap-0.5">
                      <IndianRupee size={18} /> {order.agreedAmount}
                    </span>
                  </div>

                  <div className="flex md:flex-col items-baseline justify-between md:justify-end gap-2 w-full md:w-auto">
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Timeline</span>
                    <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">
                      <Clock size={15} /> {order.estimatedDays || order.bidId?.completionDays || 30} Days
                    </span>
                  </div>

                  {user.role === 'customer' && order.status === 'active' && (
                    <button
                      onClick={() => handleMarkComplete(order._id)}
                      className="w-full md:w-auto mt-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                    >
                      <CheckCircle2 size={16} /> Mark Completed
                    </button>
                  )}

                  {order.status === 'completed' && (
                    <div className="w-full md:w-auto text-center md:text-right text-emerald-400 text-xs font-bold flex items-center justify-center md:justify-end gap-1">
                      <CheckCircle2 size={14} /> Job Finished on {formatDate(order.completedAt)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-12 text-center text-gray-500">
            <Briefcase size={40} className="mx-auto text-gray-600 mb-4" />
            <p className="font-semibold text-gray-400">No active work orders yet.</p>
            <p className="text-sm mt-1 text-gray-600">Work orders are created automatically when bids are accepted.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-lg rounded-3xl p-6 md:p-8 border border-white/10 relative overflow-hidden"
            >
              <button 
                onClick={() => setReviewOrder(null)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-primary">
                  <Star size={24} />
                </div>
                <h3 className="text-2xl font-black text-white">Rate the Contractor</h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                  {reviewOrder.contractorId?.businessName || 'Verified Expert'}
                </p>
              </div>

              {reviewError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl mb-4 text-xs">
                  {reviewError}
                </div>
              )}

              {reviewMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-2.5 rounded-xl mb-4 text-xs">
                  {reviewMessage}
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-5">
                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest text-center mb-2">Rating</label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star 
                          size={32} 
                          className={star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Write your review</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell other customers about your experience. How was the quality of work, pricing, and communication? (min 10 characters)"
                    className="w-full bg-background border border-border rounded-xl p-4 focus:border-primary outline-none text-white text-sm placeholder-gray-600 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-3.5 bg-primary text-black font-black rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <MessageSquare size={16} /> {submittingReview ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkOrders;

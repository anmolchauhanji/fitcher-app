import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectApi, bidApi } from '../api/apiClient';
import { 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Tag, 
  Send, 
  ArrowLeft, 
  ShieldCheck, 
  XCircle,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [bidForm, setBidForm] = useState({
    totalCost: '',
    completionDays: '',
    materialDetails: '',
    warrantyTerms: '',
    coverNote: ''
  });

  const userId = user?.id || user?._id;

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await projectApi.getProjectDetails(id);
      if (response.data?.data) {
        setProject(response.data.data);
        const bidsResponse = await bidApi.getProjectBids(id);
        setProject((prev) => prev ? { ...prev, totalBids: bidsResponse.data?.data?.length || 0 } : prev);
      } else {
        setMessage({ text: 'Project not found.', type: 'error' });
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      setMessage({ text: 'Something went wrong while loading project details.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (user?.role !== 'contractor') {
      setMessage({ text: 'Only verified contractors can submit bids.', type: 'error' });
      return;
    }

    setActionLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      await bidApi.createBid({
        projectId: id,
        totalCost: Number(bidForm.totalCost),
        completionDays: Number(bidForm.completionDays),
        materialDetails: bidForm.materialDetails,
        warrantyTerms: bidForm.warrantyTerms,
        coverNote: bidForm.coverNote
      });
      setMessage({ text: 'Bid submitted successfully! Check your bids section.', type: 'success' });
      setBidForm({ totalCost: '', completionDays: '', materialDetails: '', warrantyTerms: '', coverNote: '' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to submit bid.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const closeProject = async () => {
    if (!project) return;
    setActionLoading(true);
    try {
      await projectApi.closeProject(project._id);
      setProject({ ...project, status: 'cancelled' });
      setMessage({ text: 'Project closed successfully.', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Unable to close project.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="pt-48 flex flex-col items-center justify-center page-enter">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-400 font-bold">Safely loading project details...</p>
    </div>
  );

  if (!project) return (
    <div className="pt-48 text-center px-4 max-w-lg mx-auto">
      <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
         <AlertCircle size={40} />
      </div>
      <h2 className="text-3xl font-black mb-4">Project Unavailable</h2>
      <p className="text-gray-400 mb-8">{message.text || "Deatils are not available at the moment."}</p>
      <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-white text-black font-bold rounded-xl">Back to Dashboard</button>
    </div>
  );

  const isOwner = user && (project.customerId === userId || project.customerId?._id === userId);
  const isOpen = project.status === 'open';

  return (
    <div className="pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto page-enter">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white mb-10 transition-colors px-3 py-2 rounded-xl hover:bg-white/5 w-fit">
        <ArrowLeft size={18} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded border border-primary/20 uppercase tracking-widest">{project.category}</span>
              <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-white/5 ${isOpen ? 'badge-open' : 'bg-white/5 text-gray-400'}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight break-words">{project.title}</h1>
            {location.state?.editBid && (
              <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
                Your previous proposal was withdrawn. You can submit a fresh proposal below.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 glass-card rounded-2xl flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0"><MapPin size={20} /></div>
                <div className="min-w-0 flex-1"><p className="text-[10px] text-gray-500 font-bold uppercase">Location</p><p className="font-bold text-sm break-words">{project.location?.address}</p></div>
              </div>
              <div className="p-5 glass-card rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500"><Calendar size={20} /></div>
                <div><p className="text-[10px] text-gray-500 font-bold uppercase">Posted On</p><p className="font-bold text-sm">{new Date(project.createdAt).toLocaleDateString()}</p></div>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><FileText className="text-gray-500" size={24} /> Project Details</h2>
            <div className="glass-card p-8 md:p-10 rounded-[2rem] bg-white/[0.01]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Category</p>
                  <p className="text-white font-semibold">{project.category}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Budget</p>
                  <p className="text-white font-semibold">₹{project.budget?.min?.toLocaleString()} — ₹{project.budget?.max?.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Created Date</p>
                  <p className="text-white font-semibold">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Expiry Date</p>
                  <p className="text-white font-semibold">{new Date(project.expiresAt).toLocaleDateString()}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Pin Code</p>
                  <p className="text-white font-semibold">{project.location?.pinCode}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Bids Received</p>
                  <p className="text-white font-semibold">{project.totalBids || 0}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 mb-6 break-words">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Address</p>
                <p className="text-white font-semibold break-words">{project.location?.address}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Customer Name</p>
                  <p className="text-white font-semibold break-words">{project.customerId?.name || project.customerId || 'Customer info unavailable'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Project Creation Date</p>
                  <p className="text-white font-semibold">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              {project.photos?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/5">
                  <p className="text-white font-bold text-sm uppercase tracking-widest mb-4">Project Photos</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.photos.map((photo, index) => (
                      <img key={photo.publicId || index} src={photo.url} alt={`Project ${index + 1}`} className="h-48 w-full object-cover rounded-2xl border border-white/10" />
                    ))}
                  </div>
                </div>
              )}
              {project.scope && (
                 <div className="mt-8 pt-8 border-t border-white/5">
                   <p className="text-white font-bold text-sm uppercase tracking-widest mb-4">Project Scope</p>
                   <p className="text-gray-500 italic text-sm">{project.scope}</p>
                 </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="glass-card p-8 rounded-[2rem] sticky top-32">
            <div className="mb-8 p-6 bg-primary/5 rounded-2xl border border-primary/10 text-center">
              <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-2">Budget Estimate</p>
              <div className="text-3xl font-black text-white">₹{project.budget?.min?.toLocaleString()} — {project.budget?.max?.toLocaleString()}</div>
            </div>

            <AnimatePresence>
              {message.text && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl mb-6 text-xs font-bold flex gap-2 ${message.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <AlertCircle size={16} /> {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {isOwner && isOpen && (
              <button onClick={closeProject} disabled={actionLoading} className="w-full bg-red-500/10 text-red-500 border border-red-500/20 py-4 rounded-xl font-black hover:bg-red-500 hover:text-black transition-all">
                {actionLoading ? 'Closing...' : 'Close Project'}
              </button>
            )}

            {user?.role === 'contractor' && isOpen && (
              <form onSubmit={handleBidSubmit} className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="font-bold text-white mb-4">Send Your Proposal</h3>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="number" required className="w-full bg-surface border border-border rounded-xl py-4 pl-10 pr-4 outline-none focus:border-primary transition-all font-bold text-lg" placeholder="Price Quote" value={bidForm.totalCost} onChange={(e) => setBidForm({...bidForm, totalCost: e.target.value})} />
                </div>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="number" required className="w-full bg-surface border border-border rounded-xl py-4 pl-10 pr-4 outline-none focus:border-primary transition-all font-bold" placeholder="Days To Complete" value={bidForm.completionDays} onChange={(e) => setBidForm({...bidForm, completionDays: e.target.value})} />
                </div>
                <textarea required className="w-full bg-surface border border-border rounded-xl py-4 px-4 outline-none focus:border-primary transition-all text-sm h-24" placeholder="Material Details (min 10 chars)..." value={bidForm.materialDetails} onChange={(e) => setBidForm({...bidForm, materialDetails: e.target.value})} />
                <textarea required className="w-full bg-surface border border-border rounded-xl py-4 px-4 outline-none focus:border-primary transition-all text-sm h-24" placeholder="Warranty Terms (min 5 chars)..." value={bidForm.warrantyTerms} onChange={(e) => setBidForm({...bidForm, warrantyTerms: e.target.value})} />
                <textarea required className="w-full bg-surface border border-border rounded-xl py-4 px-4 outline-none focus:border-primary transition-all text-sm h-32" placeholder="Message to owner (min 20 chars)..." value={bidForm.coverNote} onChange={(e) => setBidForm({...bidForm, coverNote: e.target.value})} />
                <button type="submit" disabled={actionLoading} className="w-full bg-primary text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 glow-btn">
                  {actionLoading ? 'Sending...' : <><Send size={18} /> Submit Bid</>}
                </button>
              </form>
            )}

            {!isOpen && (
              <div className="bg-white/5 p-6 rounded-2xl text-center border border-white/5">
                 <ShieldCheck size={32} className="text-gray-600 mx-auto mb-2" />
                 <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Bidding process closed</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;

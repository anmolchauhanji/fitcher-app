import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationApi } from '../api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  LogOut,
  PlusCircle,
  FolderOpen,
  UserCircle,
  Menu,
  X,
  Gavel,
  Search,
  Zap,
  Briefcase,
  MessageSquare,
  Bell,
  Trash2
} from 'lucide-react';

const getNavItems = (role) => {
  if (role === 'customer') {
    return [
      { to: '/my-projects', label: 'My Projects', icon: FolderOpen, id: 'nav-my-projects' },
      { to: '/create-project', label: 'Create Project', icon: PlusCircle, id: 'nav-create-project' },
      { to: '/work-orders', label: 'Work Orders', icon: Briefcase, id: 'nav-work-orders' },
      { to: '/messages', label: 'Messages', icon: MessageSquare, id: 'nav-messages' },
      { to: '/profile', label: 'Profile', icon: UserCircle, id: 'nav-profile' },
    ];
  }

  return [
    { to: '/dashboard', label: 'Marketplace', icon: LayoutDashboard, id: 'nav-dashboard' },
    { to: '/my-bids', label: 'My Bids', icon: Gavel, id: 'nav-my-bids' },
    { to: '/work-orders', label: 'Work Orders', icon: Briefcase, id: 'nav-work-orders' },
    { to: '/messages', label: 'Messages', icon: MessageSquare, id: 'nav-messages' },
    { to: '/contractor/profile', label: 'Profile', icon: UserCircle, id: 'nav-profile' },
  ];
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await notificationApi.getNotifications();
      const list = res.data?.data || [];
      setNotifications(list);
      setUnreadCount(list.filter((n) => n.status === 'unread').length);
    } catch (err) {
      console.error('Error fetching notifications', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user?._id]);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
    } catch (err) {
      console.error('Error marking all as read', err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, status: 'read' } : n));
    } catch (err) {
      console.error('Error marking notification read', err);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      const unreadRes = await notificationApi.getUnreadCount();
      setUnreadCount(unreadRes.data?.data || 0);
    } catch (err) {
      console.error('Error deleting notification', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `text-sm font-medium transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-xl ${
      isActive(path)
        ? 'text-primary bg-primary/10'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-4'
        } px-4 md:px-6`}
      >
        <div
          className={`max-w-7xl mx-auto glass rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'shadow-lg shadow-black/20' : ''
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 group" id="navbar-logo">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-black font-black text-sm group-hover:scale-110 transition-transform">
              F
            </div>
            <span className="text-xl font-black tracking-tight ml-1">
              FITCHER<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                {getNavItems(user.role).map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.to} to={item.to} className={navLinkClass(item.to)} id={item.id}>
                      <Icon size={16} /> {item.label}
                    </Link>
                  );
                })}

                <div className="h-6 w-px bg-white/10 mx-2" />

                {user.role === 'customer' && (
                  <Link
                    to="/create-project"
                    className="px-4 py-2 bg-primary text-black text-sm font-bold rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    id="nav-create-project"
                  >
                    <PlusCircle size={16} /> New Project
                  </Link>
                )}

                {/* Notifications Bell */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all relative"
                    id="nav-notifications-toggle"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-black font-black text-[9px] rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 glass rounded-2xl p-4 shadow-2xl border border-white/10 z-50 text-white max-h-[400px] overflow-y-auto"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                          <h4 className="font-bold text-sm">Notifications</h4>
                          {unreadCount > 0 && (
                            <button 
                              onClick={handleMarkAllRead} 
                              className="text-[10px] text-primary hover:underline font-bold"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>

                        <div className="space-y-3">
                          {notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div 
                                key={n._id} 
                                className={`p-3 rounded-xl border flex gap-2 items-start transition-all ${
                                  n.status === 'unread' ? 'bg-primary/5 border-primary/10' : 'bg-transparent border-transparent'
                                }`}
                              >
                                <div className="flex-1 min-w-0 text-left">
                                  <h5 className="font-bold text-xs">{n.title}</h5>
                                  <p className="text-[11px] text-gray-400 mt-1 leading-normal">{n.message}</p>
                                </div>
                                <div className="flex flex-col gap-1.5 justify-start items-center">
                                  {n.status === 'unread' && (
                                    <button 
                                      onClick={() => handleMarkRead(n._id)}
                                      className="w-2 h-2 bg-primary rounded-full"
                                      title="Mark read"
                                    />
                                  )}
                                  <button 
                                    onClick={() => handleDeleteNotification(n._id)}
                                    className="text-gray-500 hover:text-red-400 p-0.5 rounded"
                                    title="Delete"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-xs text-gray-500 py-6">
                              No notifications.
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Identity Indicator (No text, just icon/color) */}
                <div className={`ml-4 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  user.role === 'customer' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-primary/30 bg-primary/10 text-primary'
                }`} title={user.name}>
                   {user.role === 'customer' ? <Zap size={18} /> : <Briefcase size={18} />}
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  id="nav-logout"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClass('/login')} id="nav-login">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="ml-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:bg-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
                  id="nav-signup"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="nav-mobile-toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[76px] z-40 px-4 md:hidden"
          >
            <div className="glass rounded-2xl p-4 space-y-1 shadow-2xl shadow-black/30">
              {user ? (
                <>
                  {getNavItems(user.role).map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.to} to={item.to} className={navLinkClass(item.to)}>
                        <Icon size={16} /> {item.label}
                      </Link>
                    );
                  })}
                  <div className="h-px bg-white/10 my-2" />
                  {user.role === 'customer' && (
                    <Link
                      to="/create-project"
                      className="w-full px-4 py-3 bg-primary text-black text-sm font-bold rounded-xl flex items-center justify-center gap-2 mb-2"
                    >
                      <PlusCircle size={16} /> New Project
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-red-400 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/10"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={navLinkClass('/login')}>Sign In</Link>
                  <Link
                    to="/signup"
                    className="w-full px-4 py-3 bg-white text-black text-sm font-bold rounded-xl text-center block"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

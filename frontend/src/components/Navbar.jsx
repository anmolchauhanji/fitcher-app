import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut, User, PlusCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between border-white/5">
        <Link to="/" className="text-2xl font-black tracking-tighter text-primary">
          FITCHER<span className="text-white">.</span>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/my-projects" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                My Projects
              </Link>
              {user.role === 'contractor' && (
                <Link to="/contractor/profile" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  My Profile
                </Link>
              )}
              <Link to="/create-project" className="px-4 py-2 bg-primary text-black text-sm font-bold rounded-lg flex items-center gap-2 hover:opacity-90 transition-all">
                <PlusCircle size={16} /> New Project
              </Link>
              <div className="h-6 w-px bg-white/10 mx-2" />
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-5 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-primary transition-all">
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

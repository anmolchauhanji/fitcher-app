import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import ProjectBids from './pages/ProjectBids';
import MyProjects from './pages/MyProjects';
import MyBids from './pages/MyBids';
import ContractorProfile from './pages/ContractorProfile';
import ContractorPublicProfile from './pages/ContractorPublicProfile';
import Profile from './pages/Profile';
import WorkOrders from './pages/WorkOrders';
import Messages from './pages/Messages';
import Navbar from './components/Navbar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background text-primary">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-background text-primary">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background text-white font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-project"
            element={
              <RoleProtectedRoute allowedRoles={['customer']}>
                <CreateProject />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/my-projects"
            element={
              <RoleProtectedRoute allowedRoles={['customer']}>
                <MyProjects />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/project/:id/bids"
            element={
              <RoleProtectedRoute allowedRoles={['customer']}>
                <ProjectBids />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractors/:id"
            element={
              <ProtectedRoute>
                <ContractorPublicProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contractor/profile"
            element={
              <RoleProtectedRoute allowedRoles={['contractor']}>
                <ContractorProfile />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/my-bids"
            element={
              <RoleProtectedRoute allowedRoles={['contractor']}>
                <MyBids />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/work-orders"
            element={
              <ProtectedRoute>
                <WorkOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

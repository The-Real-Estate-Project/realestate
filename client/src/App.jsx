import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertyListing from './pages/PropertyListing';
import PropertyDetail from './pages/PropertyDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddProperty from './pages/AdminAddProperty';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { admin } = useAuth();
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// Layout with Navbar + Footer
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

const App = () => {
  return (
    <Routes>
      {/* Redirect root to /home */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Public routes */}
      <Route
        path="/home"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />
      <Route
        path="/properties"
        element={
          <PublicLayout>
            <PropertyListing />
          </PublicLayout>
        }
      />
      <Route
        path="/properties/:id"
        element={
          <PublicLayout>
            <PropertyDetail />
          </PublicLayout>
        }
      />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/add-property"
        element={
          <ProtectedRoute>
            <AdminAddProperty />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/edit-property/:id"
        element={
          <ProtectedRoute>
            <AdminAddProperty />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default App;

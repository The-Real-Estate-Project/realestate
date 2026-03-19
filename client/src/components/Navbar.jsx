import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-10 sm:h-11 lg:h-12 flex items-center justify-between">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-4 h-4 text-gray-700" />
            ) : (
              <Menu className="w-4 h-4 text-gray-700" />
            )}
          </button>

          <Link to="/home" className="flex items-center">
            <img
              src="/rrplots-logo.png"
              alt="RR Plots"
              className="h-8 sm:h-9 lg:h-10 w-auto object-contain rounded-lg"
            />
          </Link>
        </div>

        {/* Center: Nav links (desktop) */}
        <div className="hidden lg:flex items-center gap-1">
          <Link to="/home" className="text-sm font-semibold text-gray-900 px-3 py-2 rounded-lg hover:bg-white/40 hover:backdrop-blur-sm hover:shadow-sm transition-all duration-200">
            Home
          </Link>
          <Link to="/properties" className="text-sm font-semibold text-gray-900 px-3 py-2 rounded-lg hover:bg-white/40 hover:backdrop-blur-sm hover:shadow-sm transition-all duration-200">
            Properties
          </Link>
          <Link to="/about" className="text-sm font-semibold text-gray-900 px-3 py-2 rounded-lg hover:bg-white/40 hover:backdrop-blur-sm hover:shadow-sm transition-all duration-200">
            About Us
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {admin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="hidden sm:block text-sm font-semibold text-primary-700 hover:text-primary-800 px-3 py-2"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="btn-outline text-sm px-4 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="bg-primary-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-primary-800 transition-colors"
            >
              Admin Login
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/60 backdrop-blur-md border-t border-white/20 px-4 py-4 space-y-3 animate-slide-down">
          <Link
            to="/home"
            className="block text-sm font-semibold text-gray-900 py-2 px-2 rounded-lg hover:bg-white/50 transition-all duration-200"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/properties"
            className="block text-sm font-semibold text-gray-900 py-2 px-2 rounded-lg hover:bg-white/50 transition-all duration-200"
            onClick={() => setMobileOpen(false)}
          >
            Properties
          </Link>
          <Link
            to="/about"
            className="block text-sm font-semibold text-gray-900 py-2 px-2 rounded-lg hover:bg-white/50 transition-all duration-200"
            onClick={() => setMobileOpen(false)}
          >
            About Us
          </Link>
          {admin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="block text-sm font-semibold text-primary-700 py-2"
                onClick={() => setMobileOpen(false)}
              >
                Admin Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="block text-sm font-medium text-red-600 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="block text-sm font-semibold text-primary-700 py-2"
              onClick={() => setMobileOpen(false)}
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

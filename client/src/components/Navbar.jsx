import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Heart, X } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>

          <Link to="/home" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DH</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Demo<span className="text-primary-700">Homes V1</span>
            </span>
          </Link>
        </div>

        {/* Center: Location */}
        <span className="hidden md:block text-sm font-medium text-gray-700 select-none">Bengaluru</span>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist */}
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Wishlist">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>

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
            <>
              <Link
                to="/admin/login"
                className="hidden sm:block border border-gray-800 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Post Property
              </Link>
              <Link
                to="/admin/login"
                className="btn-primary text-sm px-4 py-2"
              >
                Admin Login
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 animate-slide-down">
          <Link
            to="/home"
            className="block text-sm font-medium text-gray-700 hover:text-primary-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/properties?category=buy"
            className="block text-sm font-medium text-gray-700 hover:text-primary-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Buy
          </Link>
          <Link
            to="/properties?category=rent"
            className="block text-sm font-medium text-gray-700 hover:text-primary-700 py-2"
            onClick={() => setMobileOpen(false)}
          >
            Rent
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

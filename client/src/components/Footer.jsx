import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/home" className="inline-flex">
              <div className="bg-white rounded-xl p-1.5">
                <img
                  src="/rrnest-logo.png"
                  alt="RR Nest"
                  className="h-16 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted real estate partner in Bengaluru. Find the best residential,
              commercial, and plot properties across the city.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="w-9 h-9 bg-white/10 hover:bg-primary-700 rounded-full flex items-center justify-center transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Browse */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Browse Properties
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/properties?category=buy', label: 'Buy Property' },
                { to: '/properties?propertyType=residential', label: 'Residential' },
                { to: '/properties?unitType=site', label: 'Sites' },
                { to: '/properties?unitType=flat', label: 'Flats' },
                { to: '/properties?unitType=land', label: 'Land' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Rajarajeshwari Nagar, Bengaluru, Karnataka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:+919945450585" className="text-gray-400 hover:text-white text-sm transition-colors">
                  +91 99454 50585
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@rrnest.in" className="text-gray-400 hover:text-white text-sm transition-colors">
                  info@rrnest.in
                </a>
              </li>
            </ul>

            {/* Admin link */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                to="/admin/login"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            © {currentYear} RR Nest. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Serving Bengaluru real estate since 2024
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

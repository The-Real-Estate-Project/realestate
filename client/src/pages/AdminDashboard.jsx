import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, Eye, Search, Building2,
  MessageSquare, TrendingUp, Home, LogOut, ToggleLeft, ToggleRight,
  Star, StarOff
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatPriceRange, getPropertyTypeDisplay, CATEGORY_LABELS } from '../utils/helpers';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [loadingEnqs, setLoadingEnqs] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, newLaunch: 0, enquiries: 0 });
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchProperties();
    fetchEnquiries();
  }, []);

  const fetchProperties = async (q = '') => {
    setLoadingProps(true);
    try {
      const res = await api.get(`/properties/admin/all${q ? `?search=${q}` : ''}`);
      const data = res.data.data || [];
      setProperties(data);
      setStats((prev) => ({
        ...prev,
        total: res.data.pagination?.total || data.length,
        active: data.filter((p) => p.isActive).length,
        newLaunch: data.filter((p) => p.isNewLaunch).length,
      }));
    } catch (err) {
      toast.error('Failed to load properties');
    } finally {
      setLoadingProps(false);
    }
  };

  const fetchEnquiries = async () => {
    setLoadingEnqs(true);
    try {
      const res = await api.get('/enquiry');
      const data = res.data.data || [];
      setEnquiries(data);
      setStats((prev) => ({ ...prev, enquiries: data.length }));
    } catch (err) {
      console.error('Enquiries error:', err);
    } finally {
      setLoadingEnqs(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/properties/${id}`);
      toast.success('Property deleted');
      setDeleteConfirm(null);
      fetchProperties();
    } catch (err) {
      toast.error('Failed to delete property');
    }
  };

  const toggleActive = async (property) => {
    try {
      await api.put(`/properties/${property._id}`, { isActive: !property.isActive });
      toast.success(`Property ${property.isActive ? 'deactivated' : 'activated'}`);
      fetchProperties();
    } catch (err) {
      toast.error('Failed to update property');
    }
  };

  const toggleFeatured = async (property) => {
    try {
      await api.put(`/properties/${property._id}`, { isFeatured: !property.isFeatured });
      toast.success(`Property ${property.isFeatured ? 'removed from' : 'added to'} featured`);
      fetchProperties();
    } catch (err) {
      toast.error('Failed to update property');
    }
  };

  const updateEnquiryStatus = async (id, status) => {
    try {
      await api.put(`/enquiry/${id}`, { status });
      toast.success('Status updated');
      fetchEnquiries();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteEnquiry = async (id) => {
    try {
      await api.delete(`/enquiry/${id}`);
      toast.success('Enquiry deleted');
      fetchEnquiries();
    } catch (err) {
      toast.error('Failed to delete enquiry');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties(search);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const STAT_CARDS = [
    { label: 'Total Properties', value: stats.total, icon: Building2, color: 'bg-blue-50 text-blue-700' },
    { label: 'Active Listings', value: stats.active, icon: Home, color: 'bg-green-50 text-green-700' },
    { label: 'New Launches', value: stats.newLaunch, icon: TrendingUp, color: 'bg-purple-50 text-purple-700' },
    { label: 'Enquiries', value: stats.enquiries, icon: MessageSquare, color: 'bg-orange-50 text-orange-700' },
  ];

  const STATUS_COLORS = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    closed: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top bar */}
      <div className="bg-indigo-950 text-white px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-sm">BH</span>
          </div>
          <div>
            <p className="font-bold text-sm">Admin Dashboard</p>
            <p className="text-white/60 text-xs">Welcome, {admin?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white/70 hover:text-white text-xs transition-colors">
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {STAT_CARDS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${color} mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-xl p-1 w-fit mb-6">
          {[
            { key: 'properties', label: 'Properties' },
            { key: 'enquiries', label: `Enquiries (${enquiries.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div>
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search properties..."
                    className="input-field pl-9 py-2 text-sm"
                  />
                </div>
                <button type="submit" className="btn-primary text-sm py-2 px-4">
                  Search
                </button>
              </form>
              <div className="flex-1" />
              <Link
                to="/admin/add-property"
                className="flex items-center gap-2 btn-primary text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Property
              </Link>
            </div>

            {/* Properties table */}
            {loadingProps ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl h-16 animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-700 mb-1">No properties yet</h3>
                <p className="text-gray-500 text-sm mb-4">Add your first property to get started.</p>
                <Link to="/admin/add-property" className="btn-primary text-sm">
                  Add Property
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Property</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Type</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Price</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {properties.map((prop) => (
                        <tr key={prop._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-semibold text-gray-900 line-clamp-1 max-w-xs">{prop.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{prop.location}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full font-medium">
                              {getPropertyTypeDisplay(prop.propertyType, prop.unitType)}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <p className="font-semibold text-gray-800 text-xs">
                              {formatPriceRange(prop.priceMin, prop.priceMax, prop.priceUnit)}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className={`inline-block w-2 h-2 rounded-full ${prop.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                              <span className="text-xs text-gray-600">{prop.isActive ? 'Active' : 'Inactive'}</span>
                              {prop.isNewLaunch && (
                                <span className="bg-olive-100 text-olive-700 text-xs px-1.5 py-0.5 rounded-full">New</span>
                              )}
                              {prop.isFeatured && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs px-1.5 py-0.5 rounded-full">⭐</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Link
                                to={`/properties/${prop.slug || prop._id}`}
                                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link
                                to={`/admin/edit-property/${prop._id}`}
                                className="p-1.5 hover:bg-yellow-50 rounded-lg transition-colors text-yellow-600"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => toggleActive(prop)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                                title={prop.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {prop.isActive
                                  ? <ToggleRight className="w-4 h-4 text-green-600" />
                                  : <ToggleLeft className="w-4 h-4 text-gray-400" />
                                }
                              </button>
                              <button
                                onClick={() => toggleFeatured(prop)}
                                className="p-1.5 hover:bg-yellow-50 rounded-lg transition-colors"
                                title={prop.isFeatured ? 'Unfeature' : 'Feature'}
                              >
                                {prop.isFeatured
                                  ? <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  : <StarOff className="w-4 h-4 text-gray-400" />
                                }
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(prop._id)}
                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enquiries Tab */}
        {activeTab === 'enquiries' && (
          <div>
            {loadingEnqs ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl h-20 animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : enquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-gray-700 mb-1">No enquiries yet</h3>
                <p className="text-gray-500 text-sm">Enquiries from your website will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div key={enq._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900">{enq.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[enq.status] || STATUS_COLORS.new}`}>
                            {enq.status}
                          </span>
                          <span className="text-xs text-gray-500">{enq.enquiryType}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 flex-wrap">
                          <a href={`tel:${enq.phone}`} className="text-sm text-primary-700 font-semibold hover:underline">
                            {enq.phone}
                          </a>
                          {enq.email && (
                            <a href={`mailto:${enq.email}`} className="text-sm text-gray-500 hover:text-primary-700">
                              {enq.email}
                            </a>
                          )}
                        </div>
                        {enq.propertyTitle && (
                          <p className="text-xs text-gray-500 mt-1">
                            Property: <span className="font-medium text-gray-700">{enq.propertyTitle}</span>
                            {enq.propertyLocation && ` • ${enq.propertyLocation}`}
                          </p>
                        )}
                        {enq.message && (
                          <p className="text-xs text-gray-600 mt-2 italic">"{enq.message}"</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(enq.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <select
                          value={enq.status}
                          onChange={(e) => updateEnquiryStatus(enq._id, e.target.value)}
                          className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={() => deleteEnquiry(enq._id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Delete Property?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. All associated images will also be deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

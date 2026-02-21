import { useState } from 'react';
import { X, Phone, Mail, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { getWhatsAppUrl } from '../utils/helpers';

const EnquiryModal = ({ isOpen, onClose, property }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    enquiryType: 'general',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and phone number are required');
      return;
    }
    setLoading(true);
    try {
      await api.post('/enquiry', {
        ...form,
        propertyId: property?._id,
        propertyTitle: property?.title,
        propertyLocation: property?.location,
      });
      toast.success('Enquiry submitted! We will contact you soon.');
      onClose();
      setForm({ name: '', phone: '', email: '', message: '', enquiryType: 'general' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit enquiry');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!property?.whatsappNumber) {
      toast.error('WhatsApp number not available for this property');
      return;
    }
    const message = `Hi, I'm interested in "${property.title}" at ${property.location}. Please share more details.`;
    window.open(getWhatsAppUrl(property.whatsappNumber, message), '_blank');
  };

  const handleCall = () => {
    if (!property?.contactPhone && !property?.whatsappNumber) {
      toast.error('Contact number not available');
      return;
    }
    const phone = property.contactPhone || property.whatsappNumber;
    window.open(`tel:${phone}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-t-2xl px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">Enquire Now</h2>
              {property && (
                <p className="text-primary-200 text-xs mt-0.5 line-clamp-1">
                  {property.title} • {property.location}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3 px-6 py-4 border-b border-gray-100">
          <button
            onClick={handleCall}
            className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-100 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Enquiry Type
            </label>
            <select
              name="enquiryType"
              value={form.enquiryType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="general">General Enquiry</option>
              <option value="callback">Request Callback</option>
              <option value="site-visit">Schedule Site Visit</option>
              <option value="whatsapp">WhatsApp Enquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Message (Optional)
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us more about what you're looking for..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Enquiry
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            By submitting, you agree to be contacted by our team.
          </p>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;

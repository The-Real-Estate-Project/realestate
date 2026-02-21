import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, IndianRupee, Calendar, Maximize2, Home, Phone,
  MessageSquare, Share2, ChevronLeft, ChevronRight, CheckCircle2,
  Building2, Layers, BarChart3,
} from 'lucide-react';
import api from '../api/axios';
import EnquiryModal from '../components/EnquiryModal';
import {
  formatPriceRange, getPropertyTypeDisplay, getImageUrl,
  CATEGORY_LABELS, getWhatsAppUrl
} from '../utils/helpers';
import toast from 'react-hot-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [activeFloorPlan, setActiveFloorPlan] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/properties/${id}`);
        setProperty(res.data.data);
      } catch (err) {
        console.error('Property fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: property?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleWhatsApp = () => {
    if (!property?.whatsappNumber) {
      toast.error('WhatsApp not available for this property');
      return;
    }
    const msg = `Hi, I'm interested in "${property.title}" at ${property.location}. Please share more details.`;
    window.open(getWhatsAppUrl(property.whatsappNumber, msg), '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl h-96 animate-pulse mb-6" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl h-32 animate-pulse" />
              <div className="bg-white rounded-2xl h-64 animate-pulse" />
            </div>
            <div className="bg-white rounded-2xl h-64 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏠</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Property not found</h2>
          <Link to="/properties" className="btn-primary mt-4 inline-block">
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  const photos = property.photos || [];
  const floorPlans = property.floorPlans || [];
  const videos = property.videos || [];

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'amenities', label: 'Amenities' },
    { key: 'floor-plans', label: 'Floor Plans' },
    ...(videos.length > 0 ? [{ key: 'videos', label: `Videos (${videos.length})` }] : []),
    { key: 'location', label: 'Location & Map' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-primary-700">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-primary-700">Properties</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium line-clamp-1">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Photo Gallery */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6">
          <div className="relative">
            {photos.length > 0 ? (
              <>
                <img
                  src={getImageUrl(photos[activePhoto])}
                  alt={`${property.title} - Photo ${activePhoto + 1}`}
                  className="w-full h-72 sm:h-96 lg:h-[480px] object-cover"
                />
                {/* Navigation arrows */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhoto((i) => (i > 0 ? i - 1 : photos.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActivePhoto((i) => (i < photos.length - 1 ? i + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    {/* Photo counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                      {activePhoto + 1} / {photos.length}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.isNewLaunch && (
                    <span className="badge-new-launch">New Launch</span>
                  )}
                  {property.category && (
                    <span className="bg-primary-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      {CATEGORY_LABELS[property.category]}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full h-72 sm:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl">🏢</span>
                  <p className="text-gray-400 text-sm mt-2">No photos available</p>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activePhoto ? 'border-primary-700' : 'border-transparent'
                  }`}
                >
                  <img
                    src={getImageUrl(photo)}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property header */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-1">
                    {getPropertyTypeDisplay(property.propertyType, property.unitType)}
                  </p>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 text-sm">{property.location}</span>
                    {property.area && <span className="text-gray-500 text-sm">, {property.area}</span>}
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Price */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPriceRange(property.priceMin, property.priceMax, property.priceUnit)}
                  </span>
                </div>
                {property.estimatedEMI && (
                  <p className="text-sm text-gray-500 mt-1">
                    Estimated EMI: <span className="font-semibold text-gray-700">{property.estimatedEMI}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quick stats */}
            {(property.projectSize || property.totalUnits || property.possessionDate || property.configurations?.length > 0) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {property.projectSize && (
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl text-center">
                      <Maximize2 className="w-5 h-5 text-primary-700 mb-1" />
                      <p className="text-xs text-gray-500">Project Size</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{property.projectSize}</p>
                    </div>
                  )}
                  {property.totalUnits && (
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl text-center">
                      <Building2 className="w-5 h-5 text-primary-700 mb-1" />
                      <p className="text-xs text-gray-500">Total Units</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{property.totalUnits}</p>
                    </div>
                  )}
                  {property.possessionDate && (
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl text-center">
                      <Calendar className="w-5 h-5 text-primary-700 mb-1" />
                      <p className="text-xs text-gray-500">Possession</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{property.possessionDate}</p>
                    </div>
                  )}
                  {property.configurations?.length > 0 && (
                    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl text-center">
                      <Layers className="w-5 h-5 text-primary-700 mb-1" />
                      <p className="text-xs text-gray-500">Configurations</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">
                        {property.configurations.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Tab navigation */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {TABS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-shrink-0 px-5 py-3.5 text-sm font-semibold transition-colors border-b-2 ${
                      activeTab === key
                        ? 'border-primary-700 text-primary-700'
                        : 'border-transparent text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-6">
                {/* Overview */}
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-3">About This Property</h2>
                    {property.overview ? (
                      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                        {property.overview}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm">No overview available.</p>
                    )}

                    {/* Landmarks */}
                    {property.landmarks?.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary-700" />
                          Nearby Landmarks
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {property.landmarks.map((landmark, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                              {landmark}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Amenities */}
                {activeTab === 'amenities' && (
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-4">Amenities</h2>
                    {property.amenities?.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {property.amenities.map((amenity, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Amenities information not available.</p>
                    )}
                  </div>
                )}

                {/* Floor Plans */}
                {activeTab === 'floor-plans' && (
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-4">Floor Plans</h2>
                    {floorPlans.length > 0 ? (
                      <>
                        {/* Tabs for multiple floor plans */}
                        {floorPlans.length > 1 && (
                          <div className="flex gap-2 mb-4 flex-wrap">
                            {floorPlans.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveFloorPlan(i)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                  activeFloorPlan === i
                                    ? 'bg-primary-700 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                Floor Plan {i + 1}
                              </button>
                            ))}
                          </div>
                        )}
                        <img
                          src={getImageUrl(floorPlans[activeFloorPlan])}
                          alt={`Floor Plan ${activeFloorPlan + 1}`}
                          className="w-full max-h-96 object-contain rounded-xl border border-gray-200"
                        />
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm">Floor plans not available.</p>
                    )}
                  </div>
                )}

                {/* Videos */}
                {activeTab === 'videos' && (
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-4">Property Videos</h2>
                    <div className="space-y-4">
                      {videos.map((url, i) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-gray-200 bg-black">
                          <video
                            src={url}
                            controls
                            controlsList="nodownload"
                            className="w-full max-h-96 object-contain"
                            poster=""
                          >
                            Your browser does not support video playback.
                          </video>
                          <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500 font-medium">Video {i + 1} of {videos.length}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location & Map */}
                {activeTab === 'location' && (
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-4">Location & Map</h2>
                    <div className="flex items-start gap-2 mb-4">
                      <MapPin className="w-4 h-4 text-primary-700 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600 text-sm">{property.address || property.location}</p>
                    </div>
                    {property.mapEmbed ? (
                      <div className="rounded-xl overflow-hidden border border-gray-200">
                        <iframe
                          src={property.mapEmbed}
                          width="100%"
                          height="350"
                          style={{ border: 0 }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Property Location"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center text-gray-400 text-sm">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          Map not available
                        </div>
                      </div>
                    )}
                    {property.mapLink && (
                      <a
                        href={property.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-primary-700 text-sm font-semibold hover:underline"
                      >
                        Open in Google Maps →
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Contact */}
          <div className="space-y-4">
            {/* Enquiry card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-1">Interested in this property?</h3>
              <p className="text-gray-500 text-sm mb-5">
                Get in touch with us for more details, site visit, or pricing.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Send Enquiry
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat on WhatsApp
                </button>

                {(property.contactPhone || property.whatsappNumber) && (
                  <a
                    href={`tel:${property.contactPhone || property.whatsappNumber}`}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                )}
              </div>

              {property.contactEmail && (
                <p className="text-xs text-gray-400 text-center mt-4">
                  Or email us:{' '}
                  <a href={`mailto:${property.contactEmail}`} className="text-primary-700 hover:underline">
                    {property.contactEmail}
                  </a>
                </p>
              )}
            </div>

            {/* Property details card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Property Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Type', value: getPropertyTypeDisplay(property.propertyType, property.unitType) },
                  { label: 'Category', value: CATEGORY_LABELS[property.category] },
                  { label: 'Location', value: property.location },
                  ...(property.area ? [{ label: 'Area', value: property.area }] : []),
                  ...(property.projectSize ? [{ label: 'Size', value: property.projectSize }] : []),
                  ...(property.totalUnits ? [{ label: 'Units', value: property.totalUnits }] : []),
                  ...(property.possessionDate ? [{ label: 'Possession', value: property.possessionDate }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-2">
                    <span className="text-xs text-gray-500 font-medium">{label}</span>
                    <span className="text-xs text-gray-800 font-semibold text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry modal */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        property={property}
      />
    </div>
  );
};

export default PropertyDetail;

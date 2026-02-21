import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Upload, X, Plus, ArrowLeft, Save } from 'lucide-react';
import api from '../api/axios';
import { UNIT_TYPES } from '../utils/helpers';
import toast from 'react-hot-toast';

const COMMON_AMENITIES = [
  'Swimming Pool', 'Gym / Fitness Center', 'Clubhouse', 'Children Play Area',
  'Security 24/7', 'Power Backup', 'Lift', 'Car Parking', 'Jogging Track',
  'Garden / Park', 'Tennis Court', 'Basketball Court', 'Indoor Games',
  'Conference Room', 'Cafeteria', 'CCTV Surveillance', 'Rainwater Harvesting',
  'Solar Panels', 'EV Charging', 'Intercom',
];

const BENGALURU_AREAS = [
  // ── Central Bengaluru ──────────────────────────────────────────
  'MG Road', 'Brigade Road', 'Commercial Street', 'Shivajinagar', 'Cubbon Park',
  'Richmond Town', 'Lavelle Road', 'Residency Road', 'Infantry Road', 'Cunningham Road',
  'Millers Road', 'Langford Town', 'Ulsoor', 'Halasuru', 'Cox Town',
  'Frazer Town', 'Benson Town', 'Cooke Town', 'Cleveland Town', 'Murphy Town',
  'Kammanahalli', 'Kalyan Nagar', 'HBR Layout', 'Horamavu', 'Banaswadi',
  'Ramamurthy Nagar', 'CV Raman Nagar', 'Old Airport Road',

  // ── East Bengaluru ─────────────────────────────────────────────
  'Indiranagar', 'Domlur', 'Ejipura', 'Viveknagar', 'Koramangala',
  'HSR Layout', 'Bellandur', 'Sarjapur Road', 'Sarjapur', 'Marathahalli',
  'Whitefield', 'ITPL', 'Brookefield', 'Varthur', 'Kadugodi',
  'Panathur', 'Hoodi', 'Mahadevapura', 'Doddanekundi', 'Hagadur',
  'Munnekolala', 'Kadubeesanahalli', 'Nallurhalli', 'Thubarahalli', 'Ramagondanahalli',
  'Channasandra', 'Seetharampalya', 'Ambedkar Nagar', 'KR Puram', 'Tin Factory',
  'Borewell Road', 'HAL 2nd Stage', 'HAL 3rd Stage', 'HAL Airport Road',
  'Virgonagar', 'Avalahalli', 'Laggere', 'Nandini Layout',

  // ── South Bengaluru ────────────────────────────────────────────
  'Jayanagar', 'JP Nagar', 'BTM Layout', 'Banashankari', 'Basavanagudi',
  'Kanakapura Road', 'Bannerghatta Road', 'Electronic City', 'Electronic City Phase 1',
  'Electronic City Phase 2', 'Bommanahalli', 'Hulimavu', 'Begur', 'Harlur',
  'Arekere', 'Gottigere', 'Konanakunte', 'Subramanyapura', 'Uttarahalli',
  'Sarakki', 'Yelachenahalli', 'Puttenahalli', 'Hongasandra', 'Bikasipura',
  'Kumaraswamy Layout', 'Padmanabhanagar', 'Girinagar', 'Chamrajpet', 'Gandhi Nagar',
  'Lal Bagh Road', 'Arvind Nagar', 'Nayandahalli', 'Talaghattapura', 'Kengeri',
  'Kengeri Satellite Town', 'Jigani', 'Anekal', 'Chandapura', 'Attibele',
  'Bommasandra', 'Hosa Road', 'Hoskote', 'Hullahalli',

  // ── West Bengaluru ─────────────────────────────────────────────
  'Nagarabhavi', 'Rajarajeswari Nagar', 'RR Nagar', 'Vijayanagar', 'Chandra Layout',
  'Magadi Road', 'Basaveshwara Nagar', 'Rajajinagar', 'Malleswaram', 'Yeshwanthpur',
  'Peenya', 'Peenya Industrial Area', 'Dasarahalli', 'Jalahalli', 'Nagasandra',
  'Tumkur Road', 'BDA Layout', 'Chord Road', 'Mahalakshmi Layout', 'Marappana Palya',
  'Manjunath Nagar', 'Subramanyanagar', 'Prakash Nagar', 'Shivanagar',
  'Mathikere', 'Sadashivanagar',

  // ── North Bengaluru ────────────────────────────────────────────
  'Hebbal', 'Yelahanka', 'Yelahanka New Town', 'Devanahalli', 'Bagalur',
  'Thanisandra', 'Kogilu', 'RT Nagar', 'Sahakara Nagar', 'Kodigehalli',
  'Vidyaranyapura', 'Hesaraghatta Road', 'Bellary Road', 'Jakkur', 'Amruthahalli',
  'Bharat Nagar', 'MS Ramaiah Nagar', 'Sanjaynagar', 'New BEL Road',
  'Palace Guttahalli', 'Dollars Colony', 'Kalyananagar', 'Kalyana Nagar',
  'Doddaballapur Road', 'Doddaballapur', 'Nelamangala', 'Chikkabanavara',
  'Lakshminarayana Pura', 'Nagawara', 'Sanjay Nagar',

  // ── Outskirts / Peripheral ────────────────────────────────────
  'Kolar Road', 'Old Madras Road', 'Bannerghatta', 'Anekal Road',
  'Mysore Road Outskirts', 'Ramanagara', 'Bidadi', 'Tumkur Road Outskirts',
  'Hennur', 'Hennur Road', 'Hennur Main Road', 'Kasturi Nagar',
  'Horamavu Agara', 'Horamavu Banaswadi', 'Agara',
];

const AdminAddProperty = () => {
  const { id } = useParams(); // If editing
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [floorPlanFiles, setFloorPlanFiles] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [existingFloorPlans, setExistingFloorPlans] = useState([]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [customLandmark, setCustomLandmark] = useState('');
  const [customConfig, setCustomConfig] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: 'buy',
    propertyType: 'residential',
    unitType: 'apartment',
    location: '',
    area: '',
    address: '',
    priceMin: '',
    priceMax: '',
    priceUnit: 'Cr',
    estimatedEMI: '',
    projectSize: '',
    totalUnits: '',
    possessionDate: '',
    overview: '',
    amenities: [],
    landmarks: [],
    configurations: [],
    mapEmbed: '',
    mapLink: '',
    isNewLaunch: false,
    isFeatured: false,
    isActive: true,
    whatsappNumber: '',
    contactEmail: '',
    contactPhone: '',
  });

  // Load existing property for edit
  useEffect(() => {
    if (isEdit) {
      const fetchProperty = async () => {
        try {
          const res = await api.get(`/properties/${id}`);
          const p = res.data.data;
          setForm({
            title: p.title || '',
            category: p.category || 'buy',
            propertyType: p.propertyType || 'residential',
            unitType: p.unitType || 'apartment',
            location: p.location || '',
            area: p.area || '',
            address: p.address || '',
            priceMin: p.priceMin || '',
            priceMax: p.priceMax || '',
            priceUnit: p.priceUnit || 'Cr',
            estimatedEMI: p.estimatedEMI || '',
            projectSize: p.projectSize || '',
            totalUnits: p.totalUnits || '',
            possessionDate: p.possessionDate || '',
            overview: p.overview || '',
            amenities: p.amenities || [],
            landmarks: p.landmarks || [],
            configurations: p.configurations || [],
            mapEmbed: p.mapEmbed || '',
            mapLink: p.mapLink || '',
            isNewLaunch: p.isNewLaunch || false,
            isFeatured: p.isFeatured || false,
            isActive: p.isActive !== false,
            whatsappNumber: p.whatsappNumber || '',
            contactEmail: p.contactEmail || '',
            contactPhone: p.contactPhone || '',
          });
          setExistingPhotos(p.photos || []);
          setExistingFloorPlans(p.floorPlans || []);
        } catch (err) {
          toast.error('Failed to load property');
          navigate('/admin/dashboard');
        }
      };
      fetchProperty();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Reset unitType when propertyType changes
      ...(name === 'propertyType' ? { unitType: UNIT_TYPES[value]?.[0]?.value || '' } : {}),
    }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !form.amenities.includes(customAmenity.trim())) {
      setForm((prev) => ({ ...prev, amenities: [...prev.amenities, customAmenity.trim()] }));
      setCustomAmenity('');
    }
  };

  const addLandmark = () => {
    if (customLandmark.trim() && !form.landmarks.includes(customLandmark.trim())) {
      setForm((prev) => ({ ...prev, landmarks: [...prev.landmarks, customLandmark.trim()] }));
      setCustomLandmark('');
    }
  };

  const removeLandmark = (l) => {
    setForm((prev) => ({ ...prev, landmarks: prev.landmarks.filter((x) => x !== l) }));
  };

  const addConfig = () => {
    if (customConfig.trim() && !form.configurations.includes(customConfig.trim())) {
      setForm((prev) => ({ ...prev, configurations: [...prev.configurations, customConfig.trim()] }));
      setCustomConfig('');
    }
  };

  const removeConfig = (c) => {
    setForm((prev) => ({ ...prev, configurations: prev.configurations.filter((x) => x !== c) }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotoFiles((prev) => [...prev, ...files]);
  };

  const handleFloorPlanChange = (e) => {
    const files = Array.from(e.target.files);
    setFloorPlanFiles((prev) => [...prev, ...files]);
  };

  const removeNewPhoto = (index) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = async (photoPath) => {
    if (isEdit) {
      try {
        await api.delete(`/properties/${id}/photo`, { data: { photoPath } });
        setExistingPhotos((prev) => prev.filter((p) => p !== photoPath));
        toast.success('Photo removed');
      } catch (err) {
        toast.error('Failed to remove photo');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.propertyType || !form.unitType || !form.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, val);
        }
      });

      photoFiles.forEach((file) => formData.append('photos', file));
      floorPlanFiles.forEach((file) => formData.append('floorPlans', file));

      if (isEdit) {
        await api.put(`/properties/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Property updated successfully!');
      } else {
        await api.post('/properties', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Property added successfully!');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  const unitTypeOptions = UNIT_TYPES[form.propertyType] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-indigo-950 text-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-sm">BH</span>
          </div>
          <p className="font-bold text-sm">{isEdit ? 'Edit Property' : 'Add New Property'}</p>
        </div>
        <Link to="/admin/dashboard" className="text-white/70 hover:text-white text-xs flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Luxury 3 BHK Apartment in Whitefield"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field">
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select name="propertyType" value={form.propertyType} onChange={handleChange} className="input-field">
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Unit Type <span className="text-red-500">*</span>
                  </label>
                  <select name="unitType" value={form.unitType} onChange={handleChange} className="input-field">
                    {unitTypeOptions.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 flex-wrap">
                {[
                  { name: 'isNewLaunch', label: 'New Launch' },
                  { name: 'isFeatured', label: 'Featured' },
                  { name: 'isActive', label: 'Active Listing' },
                ].map(({ name, label }) => (
                  <label key={name} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name={name}
                      checked={form[name]}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-700 rounded border-gray-300 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Location (Bengaluru)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Location / Neighborhood <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g., Whitefield, Bengaluru"
                  className="input-field"
                  list="bengaluru-areas"
                  required
                />
                <datalist id="bengaluru-areas">
                  {BENGALURU_AREAS.map((area) => (
                    <option key={area} value={`${area}, Bengaluru`} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Area / Sector</label>
                <input
                  type="text"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  placeholder="e.g., Phase 2, Whitefield"
                  className="input-field"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Full property address"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Google Maps Embed URL</label>
                <input
                  type="url"
                  name="mapEmbed"
                  value={form.mapEmbed}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/maps?..."
                  className="input-field"
                />
                <p className="text-xs text-gray-400 mt-1">
                  From Google Maps → Share → Embed a map → Copy iframe src URL
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Google Maps Link</label>
                <input
                  type="url"
                  name="mapLink"
                  value={form.mapLink}
                  onChange={handleChange}
                  placeholder="https://maps.app.goo.gl/..."
                  className="input-field"
                />
              </div>
            </div>

            {/* Landmarks */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nearby Landmarks</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLandmark}
                  onChange={(e) => setCustomLandmark(e.target.value)}
                  placeholder="e.g., 5 min to ITPL"
                  className="input-field flex-1"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLandmark(); } }}
                />
                <button type="button" onClick={addLandmark} className="btn-primary px-4 text-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {form.landmarks.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.landmarks.map((l) => (
                    <span key={l} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                      {l}
                      <button type="button" onClick={() => removeLandmark(l)}>
                        <X className="w-3 h-3 text-gray-500 hover:text-red-500" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Pricing
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Min Price</label>
                <input
                  type="number"
                  name="priceMin"
                  value={form.priceMin}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Price</label>
                <input
                  type="number"
                  name="priceMax"
                  value={form.priceMax}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit</label>
                <select name="priceUnit" value={form.priceUnit} onChange={handleChange} className="input-field">
                  <option value="Cr">Crore (Cr)</option>
                  <option value="L">Lakh (L)</option>
                  <option value="K">Thousand (K)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Est. EMI</label>
                <input
                  type="text"
                  name="estimatedEMI"
                  value={form.estimatedEMI}
                  onChange={handleChange}
                  placeholder="₹ 50,000/month"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              Project Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Project Size</label>
                <input
                  type="text"
                  name="projectSize"
                  value={form.projectSize}
                  onChange={handleChange}
                  placeholder="e.g., 5 Acres"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Total Units</label>
                <input
                  type="number"
                  name="totalUnits"
                  value={form.totalUnits}
                  onChange={handleChange}
                  placeholder="e.g., 200"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Possession Date</label>
                <input
                  type="text"
                  name="possessionDate"
                  value={form.possessionDate}
                  onChange={handleChange}
                  placeholder="e.g., Dec 2026"
                  className="input-field"
                />
              </div>
            </div>

            {/* Configurations */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Configurations (BHK types)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customConfig}
                  onChange={(e) => setCustomConfig(e.target.value)}
                  placeholder="e.g., 2 BHK, 3 BHK"
                  className="input-field flex-1"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addConfig(); } }}
                />
                <button type="button" onClick={addConfig} className="btn-primary px-4 text-sm">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {form.configurations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.configurations.map((c) => (
                    <span key={c} className="flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs px-3 py-1.5 rounded-full font-semibold">
                      {c}
                      <button type="button" onClick={() => removeConfig(c)}>
                        <X className="w-3 h-3 hover:text-red-500" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Property Overview / Description</label>
              <textarea
                name="overview"
                value={form.overview}
                onChange={handleChange}
                placeholder="Describe the property in detail..."
                rows={4}
                className="input-field resize-none"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">5</span>
              Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
              {COMMON_AMENITIES.map((amenity) => (
                <label
                  key={amenity}
                  className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg border transition-colors ${
                    form.amenities.includes(amenity)
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="sr-only"
                  />
                  <span className="text-xs font-medium">{amenity}</span>
                </label>
              ))}
            </div>
            {/* Custom amenity */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                placeholder="Add custom amenity..."
                className="input-field flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomAmenity(); } }}
              />
              <button type="button" onClick={addCustomAmenity} className="btn-primary px-4 text-sm">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">6</span>
              Property Photos
            </h2>

            {/* Existing photos */}
            {existingPhotos.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Current photos:</p>
                <div className="flex flex-wrap gap-3">
                  {existingPhotos.map((photo, i) => (
                    <div key={i} className="relative">
                      <img
                        src={photo}
                        alt={`Photo ${i + 1}`}
                        className="w-20 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(photo)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New photo upload */}
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">
                  Click to upload photos
                </p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — Max 10MB each</p>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>

            {/* New photo previews */}
            {photoFiles.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {photoFiles.map((file, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New photo ${i + 1}`}
                      className="w-20 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewPhoto(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Floor plans */}
            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Floor Plans</label>
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-primary-400 transition-colors">
                  <p className="text-sm text-gray-500">Upload Floor Plans (optional)</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleFloorPlanChange}
                  className="hidden"
                />
              </label>
              {floorPlanFiles.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">{floorPlanFiles.length} floor plan(s) selected</p>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">7</span>
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  placeholder="contact@example.com"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4 justify-end pb-8">
            <Link
              to="/admin/dashboard"
              className="btn-outline px-8"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEdit ? 'Update Property' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProperty;

/**
 * Format price to Indian notation (Cr, L, K)
 */
export const formatPrice = (amount, unit = 'Cr') => {
  if (!amount && amount !== 0) return 'Price on Request';
  return `₹ ${amount} ${unit}`;
};

export const formatPriceRange = (min, max, unit = 'Cr') => {
  if (!min && !max) return 'Price on Request';
  if (!min) return `₹ ${max} ${unit}`;
  if (!max) return `₹ ${min} ${unit}`;
  return `₹ ${min} ${unit} to ${max} ${unit}`;
};

/**
 * Map category key to display label
 */
export const CATEGORY_LABELS = {
  buy: 'Buy',
  rent: 'Rent',
};

/**
 * Map propertyType key to display label
 */
export const PROPERTY_TYPE_LABELS = {
  residential: 'Residential',
  commercial: 'Commercial',
};

/**
 * Map unitType key to display label
 */
export const UNIT_TYPE_LABELS = {
  apartment: 'Apartment',
  land: 'Land',
  'low-rise-floor': 'Low Rise Floor',
  'residential-plots': 'Residential Plots',
  'independent-floors': 'Independent Floors',
  shop: 'Shop',
  'retail-shops': 'Retail Shops',
  'food-court': 'Food Court',
  'sco-plots': 'SCO Plots',
  'industrial-plot': 'Industrial Plot',
};

/**
 * Unit types per property type
 */
export const UNIT_TYPES = {
  residential: [
    { value: 'apartment', label: 'Apartment' },
    { value: 'land', label: 'Land' },
    { value: 'low-rise-floor', label: 'Low Rise Floor' },
    { value: 'residential-plots', label: 'Residential Plots' },
    { value: 'independent-floors', label: 'Independent Floors' },
  ],
  commercial: [
    { value: 'shop', label: 'Shop' },
    { value: 'retail-shops', label: 'Retail Shops' },
    { value: 'food-court', label: 'Food Court' },
    { value: 'sco-plots', label: 'SCO Plots' },
  ],
};

/**
 * Get property type display string (e.g., "Residential, Apartment")
 */
export const getPropertyTypeDisplay = (propertyType, unitType) => {
  const pt = PROPERTY_TYPE_LABELS[propertyType] || propertyType;
  const ut = UNIT_TYPE_LABELS[unitType] || unitType;
  return `${pt}, ${ut}`;
};

/**
 * Truncate text
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/**
 * Generate full image URL
 */
export const getImageUrl = (path) => {
  if (!path) return '/placeholder-property.jpg';
  if (path.startsWith('http')) return path;
  return path;
};

/**
 * Format date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * All known Bengaluru areas — used for location autocomplete
 */
export const BENGALURU_AREAS = [
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

/**
 * WhatsApp URL builder
 */
export const getWhatsAppUrl = (phone, message = '') => {
  const cleaned = phone.replace(/\D/g, '');
  const number = cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

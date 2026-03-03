import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Search } from 'lucide-react';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import { UNIT_TYPES, CATEGORY_LABELS, PROPERTY_TYPE_LABELS } from '../utils/helpers';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'buy', label: 'Buy' },
];

const PROPERTY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'residential', label: 'Residential' },
];

const PropertyListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Filter state from URL params
  const category = searchParams.get('category') || '';
  const propertyType = searchParams.get('propertyType') || '';
  const unitType = searchParams.get('unitType') || '';
  const search = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';
  const page = Number(searchParams.get('page') || 1);

  const [localSearch, setLocalSearch] = useState(search);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (propertyType) params.set('propertyType', propertyType);
      if (unitType) params.set('unitType', unitType);
      if (search) params.set('search', search);
      if (featured) params.set('featured', featured);
      params.set('page', page);
      params.set('limit', 12);

      const res = await api.get(`/properties?${params.toString()}`);
      setProperties(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [category, propertyType, unitType, search, featured, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilter('search', localSearch);
  };

  const hasFilters = category || propertyType || unitType || search;

  // Get page title
  const getTitle = () => {
    if (featured) return 'Featured Properties in Bengaluru';
    if (category) return `${CATEGORY_LABELS[category] || category} Properties in Bengaluru`;
    return 'All Properties in Bengaluru';
  };

  const unitTypeOptions = propertyType ? UNIT_TYPES[propertyType] || [] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sub-header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Category tabs */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateFilter('category', value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                    category === value
                      ? 'bg-primary-700 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search location, project..."
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-36 sm:w-64"
                />
              </div>
              <button type="submit" className="btn-primary text-sm py-2 px-4">
                Go
              </button>
            </form>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && (
                <span className="w-2 h-2 bg-primary-700 rounded-full" />
              )}
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="pt-3 pb-1 border-t border-gray-100 mt-3 flex flex-wrap gap-4 items-start animate-slide-down">
              {/* Property Type */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type:</span>
                {PROPERTY_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => {
                      updateFilter('propertyType', value);
                      updateFilter('unitType', '');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      propertyType === value
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Unit Type */}
              {unitTypeOptions.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Unit:</span>
                  {unitTypeOptions.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateFilter('unitType', unitType === value ? '' : value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        unitType === value
                          ? 'bg-olive-100 text-olive-700 border border-olive-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  <X className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title + count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{getTitle()}</h1>
            {!loading && (
              <p className="text-sm text-gray-500 mt-0.5">
                {pagination.total || 0} properties found
              </p>
            )}
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && properties.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No properties found</h2>
            <p className="text-gray-500 text-sm mb-6">
              Try adjusting your filters or search for a different location.
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        )}

        {/* Properties grid */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              disabled={page <= 1}
              onClick={() => updateFilter('page', page - 1)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(pagination.pages, 7) }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => updateFilter('page', p)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                    p === page
                      ? 'bg-primary-700 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={page >= pagination.pages}
              onClick={() => updateFilter('page', page + 1)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyListing;

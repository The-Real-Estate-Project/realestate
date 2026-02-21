import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, Navigation, ChevronDown } from 'lucide-react';
import { UNIT_TYPES } from '../utils/helpers';

const SearchBar = ({ initialCategory = 'buy' }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [propertyType, setPropertyType] = useState(''); // residential | commercial | plots
  const [selectedUnitTypes, setSelectedUnitTypes] = useState([]);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handlePropertyTypeChange = (type) => {
    setPropertyType(type);
    setSelectedUnitTypes([]);
  };

  const handleUnitTypeToggle = (value) => {
    setSelectedUnitTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (initialCategory) params.set('category', initialCategory);
    if (propertyType) params.set('propertyType', propertyType);
    if (selectedUnitTypes.length > 0) params.set('unitType', selectedUnitTypes[0]);
    if (searchText.trim()) params.set('search', searchText.trim());
    navigate(`/properties?${params.toString()}`);
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        const params = new URLSearchParams();
        if (initialCategory) params.set('category', initialCategory);
        navigate(`/properties?${params.toString()}`);
      });
    }
  };

  const getDropdownLabel = () => {
    if (!propertyType && selectedUnitTypes.length === 0) return 'Property Type';
    if (propertyType && selectedUnitTypes.length === 0) {
      return propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
    }
    return `${propertyType} (${selectedUnitTypes.length})`;
  };

  const currentUnitTypes = propertyType ? UNIT_TYPES[propertyType] || [] : [];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Main search bar */}
      <div className="flex items-center bg-white rounded-2xl shadow-lg border border-gray-200 overflow-visible">
        {/* Property Type dropdown trigger */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-5 py-4 border-r border-gray-200 text-sm font-semibold text-gray-700 hover:text-gray-900 whitespace-nowrap min-w-max transition-colors"
        >
          <span>{getDropdownLabel()}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Search input */}
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by city, location, project, developer"
          className="flex-1 px-4 py-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
        />

        {/* Near Me button */}
        <button
          onClick={handleNearMe}
          className="hidden sm:flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2.5 rounded-xl mx-2 text-sm font-semibold hover:bg-primary-200 transition-colors whitespace-nowrap"
        >
          <Navigation className="w-4 h-4" />
          <span>Near Me</span>
        </button>

        {/* Mic icon */}
        <button className="p-3 hover:bg-gray-100 rounded-full mx-1 transition-colors" aria-label="Voice search">
          <Mic className="w-5 h-5 text-gray-500" />
        </button>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="bg-olive-600 hover:bg-olive-700 text-white font-bold px-6 py-4 rounded-r-2xl flex items-center gap-2 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Dropdown panel */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 w-full z-50 p-5 animate-slide-down">
          {/* Property Type selection */}
          <div className="flex items-center gap-6 mb-5">
            {[
              { value: 'residential', label: 'Residential' },
              { value: 'commercial', label: 'Commercial' },
            ].map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <div
                  onClick={() => handlePropertyTypeChange(value)}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                    propertyType === value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {propertyType === value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <span
                  onClick={() => handlePropertyTypeChange(value)}
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {label}
                </span>
              </label>
            ))}
          </div>

          {/* Unit Type checkboxes */}
          {currentUnitTypes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Unit Type
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {currentUnitTypes.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUnitTypes.includes(value)}
                      onChange={() => handleUnitTypeToggle(value)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              {selectedUnitTypes.length > 0 && (
                <button
                  onClick={handleSearch}
                  className="mt-4 w-full btn-primary text-sm"
                >
                  Search Properties
                </button>
              )}
            </div>
          )}

          {!propertyType && (
            <p className="text-xs text-gray-400 mt-1">
              Select a property type to filter by unit type
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

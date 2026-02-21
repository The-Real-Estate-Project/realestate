import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, ChevronDown, MapPin } from 'lucide-react';
import { UNIT_TYPES, BENGALURU_AREAS } from '../utils/helpers';

const SearchBar = ({ initialCategory = 'buy' }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [propertyType, setPropertyType] = useState(''); // residential | commercial | plots
  const [selectedUnitTypes, setSelectedUnitTypes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Build suggestions whenever searchText changes
  useEffect(() => {
    const text = searchText.trim();
    if (text.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const lower = text.toLowerCase();
    const matched = BENGALURU_AREAS.filter((area) =>
      area.toLowerCase().includes(lower)
    ).slice(0, 8);
    setSuggestions(matched);
    setShowSuggestions(matched.length > 0);
    setActiveSuggestion(-1);
  }, [searchText]);

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
    // Only lock to a category when the user is purely browsing (no text, no type selected).
    // When they type a location or pick a property type, search across all categories so
    // results are never silently excluded by the home-page tab.
    const isTextSearch = searchText.trim() || propertyType;
    if (initialCategory && !isTextSearch) params.set('category', initialCategory);
    if (propertyType) params.set('propertyType', propertyType);
    if (selectedUnitTypes.length > 0) params.set('unitType', selectedUnitTypes[0]);
    if (searchText.trim()) params.set('search', searchText.trim());
    navigate(`/properties?${params.toString()}`);
    setShowDropdown(false);
  };

  const handleSelectSuggestion = (area) => {
    setSearchText(area);
    setShowSuggestions(false);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion((i) => Math.min(i + 1, suggestions.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion((i) => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter' && activeSuggestion >= 0) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[activeSuggestion]);
        return;
      }
      if (e.key === 'Escape') {
        setShowSuggestions(false);
        return;
      }
    }
    if (e.key === 'Enter') handleSearch();
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
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-3 sm:px-5 sm:py-4 border-r border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 whitespace-nowrap transition-colors"
        >
          {/* Full label on sm+, short label on mobile */}
          <span className="hidden sm:inline">{getDropdownLabel()}</span>
          <span className="sm:hidden">
            {!propertyType ? 'Type' : propertyType.charAt(0).toUpperCase() + propertyType.slice(1, 4) + '.'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Search input */}
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search location or project..."
            className="w-full px-3 py-3 sm:px-4 sm:py-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
            autoComplete="off"
          />
        </div>

        {/* Mic icon — hidden on mobile to save space */}
        <button className="hidden sm:flex p-3 hover:bg-gray-100 rounded-full mx-1 transition-colors" aria-label="Voice search">
          <Mic className="w-5 h-5 text-gray-500" />
        </button>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="bg-olive-600 hover:bg-olive-700 text-white font-bold px-4 py-3 sm:px-6 sm:py-4 rounded-r-2xl flex items-center gap-2 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Suggestions dropdown — full width of search bar */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {suggestions.map((area, i) => (
            <li
              key={area}
              onMouseDown={() => handleSelectSuggestion(area)}
              className={`flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                i === activeSuggestion
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="flex-1 min-w-0 truncate">
                {/* Bold the matching part */}
                {area.toLowerCase().includes(searchText.trim().toLowerCase()) ? (
                  (() => {
                    const idx = area.toLowerCase().indexOf(searchText.trim().toLowerCase());
                    return (
                      <>
                        {area.slice(0, idx)}
                        <strong className="font-semibold text-gray-900">
                          {area.slice(idx, idx + searchText.trim().length)}
                        </strong>
                        {area.slice(idx + searchText.trim().length)}
                      </>
                    );
                  })()
                ) : area}
              </span>
              <span className="hidden sm:inline ml-auto text-xs text-gray-400 flex-shrink-0 pl-2">Bengaluru</span>
            </li>
          ))}
        </ul>
      )}

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

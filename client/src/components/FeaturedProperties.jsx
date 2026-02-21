import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from './PropertyCard';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/properties/featured');
        setProperties(res.data.data || []);
      } catch (err) {
        console.error('Featured fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const maxIndex = Math.max(0, properties.length - visibleCount);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-7 bg-gray-200 rounded w-64 animate-pulse mb-2" />
              <div className="h-4 bg-gray-100 rounded w-48 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  const visibleProperties = properties.slice(currentIndex, currentIndex + visibleCount);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">
              Featured Projects in Bengaluru
            </h2>
            <p className="text-gray-500 text-sm mt-1">Handpicked premium properties</p>
          </div>
          <Link
            to="/properties?featured=true"
            className="hidden sm:block text-sm font-semibold text-primary-700 hover:text-primary-800 hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left arrow */}
          {currentIndex > 0 && (
            <button
              onClick={prev}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}

          <div
            ref={containerRef}
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))` }}
          >
            {visibleProperties.map((property) => (
              <PropertyCard key={property._id} property={property} variant="carousel" />
            ))}
          </div>

          {/* Right arrow */}
          {currentIndex < maxIndex && (
            <button
              onClick={next}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>

        {/* Dots */}
        {properties.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-primary-700' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Mobile "View All" */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/properties?featured=true"
            className="text-sm font-semibold text-primary-700 hover:underline"
          >
            View All Featured Properties →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;

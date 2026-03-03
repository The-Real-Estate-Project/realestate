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
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-indigo-950/82 backdrop-blur-[2px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="h-7 bg-white/10 rounded w-64 animate-pulse mb-2" />
              <div className="h-4 bg-white/10 rounded w-48 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 rounded-xl h-72 animate-pulse border border-white/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  const visibleProperties = properties.slice(currentIndex, currentIndex + visibleCount);

  return (
    <section className="py-12 relative">
      {/* Dark glass overlay — background image shows through at ~18% */}
      <div className="absolute inset-0 bg-indigo-950/82 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Featured Projects in Bengaluru
            </h2>
            <p className="text-gray-400 text-sm mt-1">Handpicked premium properties</p>
          </div>
          <Link
            to="/properties?featured=true"
            className="hidden sm:block text-sm font-semibold text-white/70 hover:text-white hover:underline"
          >
            View All →
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          {currentIndex > 0 && (
            <button
              onClick={prev}
              className="absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center transition-colors border border-white/20"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
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

          {currentIndex < maxIndex && (
            <button
              onClick={next}
              className="absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/35 rounded-full flex items-center justify-center transition-colors border border-white/20"
            >
              <ChevronRight className="w-5 h-5 text-white" />
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
                  i === currentIndex ? 'bg-primary-400' : 'bg-white/25'
                }`}
              />
            ))}
          </div>
        )}

        {/* Mobile "View All" */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/properties?featured=true"
            className="text-sm font-semibold text-white/70 hover:text-white hover:underline"
          >
            View All Featured Properties →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;

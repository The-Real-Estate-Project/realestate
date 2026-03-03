import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from './PropertyCard';

const NewlyLaunchedSection = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

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
    const fetchNewLaunches = async () => {
      try {
        const res = await api.get('/properties/new-launches');
        setProperties(res.data.data || []);
      } catch (err) {
        console.error('New launches fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewLaunches();
  }, []);

  const maxIndex = Math.max(0, properties.length - visibleCount);
  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  if (loading) {
    return (
      <section className="py-14 relative">
        <div className="absolute inset-0 bg-indigo-950/82 backdrop-blur-[2px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="h-8 bg-white/10 rounded w-64 mx-auto animate-pulse mb-2" />
            <div className="h-4 bg-white/10 rounded w-48 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 rounded-xl h-80 animate-pulse border border-white/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  const visibleProperties = properties.slice(currentIndex, currentIndex + visibleCount);

  return (
    <section className="py-14 relative">
      {/* Dark glass overlay — background image shows through at ~18% */}
      <div className="absolute inset-0 bg-indigo-950/82 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Newly Launched Projects
          </h2>
          <p className="text-gray-400 text-sm mt-2">Preferred units at zero brokerage</p>
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
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))` }}
          >
            {visibleProperties.map((property) => (
              <PropertyCard key={property._id} property={property} variant="new-launch" />
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
                  i === currentIndex ? 'bg-olive-400' : 'bg-white/25'
                }`}
              />
            ))}
          </div>
        )}

        {/* View All */}
        <div className="mt-8 text-center">
          <Link
            to="/properties?category=new-launch"
            className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-950 transition-all duration-200"
          >
            View All New Launches
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewlyLaunchedSection;

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
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto animate-pulse mb-2" />
            <div className="h-4 bg-gray-100 rounded w-48 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  const visibleProperties = properties.slice(currentIndex, currentIndex + visibleCount);

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - matches Image 5 exactly */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-950">
            Newly Launched Projects
          </h2>
          <p className="text-gray-500 text-sm mt-2">Preferred units at zero brokerage</p>
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
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))` }}
          >
            {visibleProperties.map((property) => (
              <PropertyCard key={property._id} property={property} variant="new-launch" />
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

        {/* Dots navigation */}
        {properties.length > visibleCount && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-olive-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* View All */}
        <div className="mt-8 text-center">
          <Link
            to="/properties?category=new-launch"
            className="inline-flex items-center gap-2 border border-primary-700 text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-primary-700 hover:text-white transition-all duration-200"
          >
            View All New Launches
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewlyLaunchedSection;

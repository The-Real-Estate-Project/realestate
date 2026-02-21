import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, IndianRupee } from 'lucide-react';
import { getPropertyTypeDisplay, formatPriceRange, getImageUrl, CATEGORY_LABELS } from '../utils/helpers';

const PropertyCard = ({ property, variant = 'default' }) => {
  const [liked, setLiked] = useState(false);

  const {
    _id,
    slug,
    title,
    propertyType,
    unitType,
    location,
    area,
    priceMin,
    priceMax,
    priceUnit,
    photos,
    isNewLaunch,
    category,
  } = property;

  const imageUrl = photos && photos.length > 0 ? getImageUrl(photos[0]) : null;
  const propertyLink = `/properties/${slug || _id}`;
  const typeDisplay = getPropertyTypeDisplay(propertyType, unitType);

  // Compact card (used in carousel/featured)
  if (variant === 'carousel') {
    return (
      <div className="card group h-full flex flex-col">
        <Link to={propertyLink} className="block overflow-hidden relative flex-shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-4xl">🏢</span>
            </div>
          )}

          {/* New Launch badge */}
          {isNewLaunch && (
            <span className="absolute top-3 left-3 badge-new-launch">
              New Launch
            </span>
          )}

          {/* Heart */}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
          </button>
        </Link>

        <div className="p-4 flex-1 flex flex-col">
          <Link to={propertyLink}>
            <p className="text-xs font-semibold text-gray-500 mb-1">{typeDisplay}</p>
            <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 hover:text-primary-700 transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-1 mt-1.5">
              <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <p className="text-xs text-gray-500 truncate">{location}</p>
            </div>
          </Link>

          <div className="mt-auto pt-3 border-t border-gray-100">
            <p className="text-sm font-bold text-gray-900">
              {formatPriceRange(priceMin, priceMax, priceUnit)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Newly launched card (compact grid card - Image 5 style)
  if (variant === 'new-launch') {
    return (
      <div className="card group">
        <Link to={propertyLink} className="block overflow-hidden relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
              <span className="text-5xl">🏙️</span>
            </div>
          )}
        </Link>

        <div className="p-4">
          <Link to={propertyLink}>
            <h3 className="font-bold text-gray-900 text-base leading-snug hover:text-primary-700 transition-colors line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-sm text-gray-500">{location}</p>
            </div>
          </Link>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div>
              <p className="text-base font-bold text-gray-900">
                {formatPriceRange(priceMin, priceMax, priceUnit)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{typeDisplay}</p>
            </div>
            {isNewLaunch && (
              <span className="badge-new-launch text-xs whitespace-nowrap">
                New Launch
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default / listing card
  return (
    <div className="card group">
      <Link to={propertyLink} className="block">
        <div className="relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-5xl">🏠</span>
            </div>
          )}

          {/* Overlaid badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isNewLaunch && (
              <span className="badge-new-launch">New Launch</span>
            )}
            {category && (
              <span className="bg-primary-700 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {CATEGORY_LABELS[category]}
              </span>
            )}
          </div>

          {/* Heart */}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart
              className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
          </button>
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide mb-1">
            {typeDisplay}
          </p>
          <h3 className="text-base font-bold text-gray-900 leading-snug hover:text-primary-700 transition-colors line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-1 mt-2">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-500">{location}{area ? `, ${area}` : ''}</p>
          </div>
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
            <IndianRupee className="w-4 h-4 text-gray-700" />
            <p className="text-base font-bold text-gray-900">
              {formatPriceRange(priceMin, priceMax, priceUnit)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;

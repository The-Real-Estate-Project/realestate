import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Key } from 'lucide-react';
import SearchBar from './SearchBar';

const TABS = [
  { key: 'buy', label: 'Buy', icon: Home },
  { key: 'rent', label: 'Rent', icon: Key },
];

// SVG city skyline (landmarks silhouette)
const CitySkyline = () => (
  <svg
    className="hero-skyline"
    viewBox="0 0 1440 300"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMax meet"
  >
    {/* Left side buildings */}
    <rect x="0" y="180" width="30" height="120" />
    <rect x="35" y="150" width="20" height="150" />
    <rect x="60" y="100" width="15" height="200" />
    <rect x="80" y="160" width="25" height="140" />
    <polygon points="92,160 105,100 118,160" />
    <rect x="110" y="160" width="30" height="140" />
    <rect x="145" y="130" width="20" height="170" />
    <rect x="170" y="80" width="12" height="220" />
    <rect x="186" y="170" width="18" height="130" />
    <rect x="210" y="140" width="22" height="160" />
    {/* Tower with dome */}
    <rect x="240" y="100" width="20" height="200" />
    <ellipse cx="250" cy="100" rx="16" ry="12" />
    <rect x="248" y="70" width="4" height="30" />
    <rect x="265" y="150" width="25" height="150" />
    <rect x="295" y="120" width="18" height="180" />
    {/* Clock tower style */}
    <rect x="320" y="80" width="22" height="220" />
    <rect x="316" y="60" width="30" height="25" />
    <rect x="328" y="50" width="8" height="15" />
    <rect x="348" y="140" width="20" height="160" />
    <rect x="375" y="110" width="16" height="190" />
    <rect x="396" y="170" width="28" height="130" />
    {/* Middle section */}
    <rect x="430" y="90" width="30" height="210" />
    <rect x="465" y="130" width="20" height="170" />
    <rect x="490" y="160" width="15" height="140" />
    <rect x="510" y="100" width="25" height="200" />
    <rect x="540" y="140" width="18" height="160" />
    {/* Tall building cluster */}
    <rect x="565" y="60" width="22" height="240" />
    <rect x="592" y="80" width="18" height="220" />
    <rect x="615" y="100" width="20" height="200" />
    <rect x="640" y="70" width="25" height="230" />
    {/* Right side */}
    <rect x="670" y="120" width="20" height="180" />
    <rect x="695" y="150" width="18" height="150" />
    <rect x="720" y="100" width="22" height="200" />
    <rect x="748" y="130" width="15" height="170" />
    <rect x="768" y="90" width="28" height="210" />
    <rect x="800" y="160" width="20" height="140" />
    <rect x="825" y="110" width="18" height="190" />
    <rect x="848" y="140" width="22" height="160" />
    <rect x="875" y="80" width="20" height="220" />
    <rect x="900" y="150" width="25" height="150" />
    {/* Distant buildings */}
    <rect x="930" y="120" width="16" height="180" />
    <rect x="950" y="90" width="20" height="210" />
    <rect x="975" y="140" width="18" height="160" />
    <rect x="998" y="110" width="22" height="190" />
    <rect x="1024" y="160" width="20" height="140" />
    <rect x="1050" y="100" width="15" height="200" />
    <rect x="1070" y="130" width="25" height="170" />
    <rect x="1100" y="80" width="18" height="220" />
    <rect x="1124" y="150" width="20" height="150" />
    <rect x="1148" y="120" width="16" height="180" />
    <rect x="1168" y="90" width="22" height="210" />
    <rect x="1195" y="140" width="20" height="160" />
    <rect x="1220" y="110" width="18" height="190" />
    <rect x="1244" y="160" width="25" height="140" />
    <rect x="1274" y="100" width="20" height="200" />
    <rect x="1300" y="130" width="16" height="170" />
    <rect x="1320" y="80" width="22" height="220" />
    <rect x="1347" y="150" width="18" height="150" />
    <rect x="1370" y="120" width="20" height="180" />
    <rect x="1395" y="90" width="15" height="210" />
    <rect x="1415" y="160" width="25" height="140" />
  </svg>
);

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const navigate = useNavigate();

  const handleTabClick = (key) => {
    setActiveTab(key);
  };

  return (
    <section className="relative bg-white min-h-[520px] flex items-center">
      {/* City skyline background — overflow-hidden scoped here so the dropdown isn't clipped */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CitySkyline />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Explore. Discover. Home.
          </h1>

          {/* Category tabs */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
            {TABS.map(({ key, label, icon: Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => handleTabClick(key)}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-700 text-white shadow-lg shadow-primary-200'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? 'text-primary-700' : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="w-full">
            <SearchBar initialCategory={activeTab} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;

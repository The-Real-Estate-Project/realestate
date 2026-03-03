import { useNavigate } from 'react-router-dom';

const CARDS = [
  {
    key: 'site',
    label: 'Site',
    sub: 'Residential Sites',
    params: 'unitType=site',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&w=700&q=75',
  },
  {
    key: 'flat',
    label: 'Flat',
    sub: 'Apartments & Flats',
    params: 'unitType=flat',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&w=700&q=75',
  },
  {
    key: 'land',
    label: 'Land',
    sub: 'Open Land',
    params: 'unitType=land',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&w=700&q=75',
  },
];

// Particle positions — fixed so they don't regenerate on re-render
const PARTICLES = [
  { left: '8%',  bottom: '20%', delay: '0s',    duration: '7s'  },
  { left: '16%', bottom: '35%', delay: '0.7s',  duration: '9s'  },
  { left: '24%', bottom: '22%', delay: '1.4s',  duration: '6s'  },
  { left: '32%', bottom: '50%', delay: '2.1s',  duration: '8s'  },
  { left: '42%', bottom: '28%', delay: '0.3s',  duration: '10s' },
  { left: '52%', bottom: '42%', delay: '1.8s',  duration: '7s'  },
  { left: '61%', bottom: '18%', delay: '0.9s',  duration: '9s'  },
  { left: '70%', bottom: '55%', delay: '2.5s',  duration: '6s'  },
  { left: '78%', bottom: '30%', delay: '1.2s',  duration: '8s'  },
  { left: '85%', bottom: '44%', delay: '0.5s',  duration: '11s' },
  { left: '91%', bottom: '25%', delay: '1.9s',  duration: '7s'  },
  { left: '96%', bottom: '38%', delay: '3.0s',  duration: '9s'  },
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden flex flex-col min-h-screen">

      {/* ─── Multi-layer dark gradient overlay ─────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/92 via-indigo-950/75 to-indigo-950/92" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />

      {/* ─── Ambient glow orbs ─────────────────────────────────────── */}
      <div className="hero-orb hero-orb-1 absolute top-24 left-1/4 w-[480px] h-[480px] rounded-full bg-primary-700/25 blur-3xl" />
      <div className="hero-orb hero-orb-2 absolute bottom-32 right-1/4 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="hero-orb hero-orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-indigo-800/15 blur-3xl" />

      {/* ─── Floating particles ────────────────────────────────────── */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="hero-particle absolute w-1 h-1 rounded-full bg-white/25"
          style={{ left: p.left, bottom: p.bottom, animationDelay: p.delay, animationDuration: p.duration }}
        />
      ))}

      {/* ─── Subtle grid overlay ───────────────────────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ─── Main content ──────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        {/* Greeting badge */}
        <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-olive-400 animate-pulse flex-shrink-0" />
          <span className="text-white/90 text-xs font-semibold tracking-[0.18em] uppercase">
            Welcome — Your Dream Home Awaits
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
          What are you{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-violet-300 to-primary-400">
            looking for?
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-white/65 text-base sm:text-lg max-w-xl mx-auto mb-14 leading-relaxed">
          Browse Sites, Flats &amp; Lands
        </p>

        {/* Category cards */}
        <div className="w-full max-w-5xl mx-auto">
          <p className="text-white/40 text-xs uppercase tracking-[0.2em] font-semibold mb-5">
            Browse by category
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {CARDS.map(({ key, label, sub, params, image }) => (
              <button
                key={key}
                onClick={() => navigate(`/properties?${params}`)}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-primary-400/50 border border-white/10 hover:border-white/25"
                style={{ height: 'clamp(160px, 28vw, 230px)' }}
              >
                {/* Card photo */}
                <img
                  src={image}
                  alt={label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Card overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                <div className="absolute inset-0 bg-primary-700/0 group-hover:bg-primary-700/20 transition-colors duration-300" />

                {/* Shimmer line on hover */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                  <p className="text-white font-bold text-2xl leading-tight drop-shadow-lg">
                    {label}
                  </p>
                  <p className="text-white/70 text-sm mt-0.5">{sub}</p>
                </div>

                {/* Arrow on hover */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/0 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;

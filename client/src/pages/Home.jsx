import HeroSection from '../components/HeroSection';
import FeaturedProperties from '../components/FeaturedProperties';
import NewlyLaunchedSection from '../components/NewlyLaunchedSection';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
  return (
    <>
      {/* ── Full-page video background ────────────────────────────────────
          position:fixed keeps the video pinned to the viewport while the
          page scrolls over it. scale(1.08) hides blur-edge artifacts.
          The WhyChooseUs section uses a solid bg-white to cover the video.
          The footer's own bg-indigo-950 (opaque) also covers it naturally.
      ─────────────────────────────────────────────────────────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 -z-10 w-full h-full pointer-events-none"
        style={{
          objectFit: 'cover',
          filter: 'blur(3px)',
          transform: 'scale(1.08)',
          transformOrigin: 'center center',
        }}
      >
        <source src="/bengaluru-bg.mp4" type="video/mp4" />
      </video>

      <main>
        <HeroSection />
        <FeaturedProperties />
        <NewlyLaunchedSection />
        <WhyChooseUs />
      </main>
    </>
  );
};

export default Home;

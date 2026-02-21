import HeroSection from '../components/HeroSection';
import FeaturedProperties from '../components/FeaturedProperties';
import NewlyLaunchedSection from '../components/NewlyLaunchedSection';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedProperties />
      <NewlyLaunchedSection />
      <WhyChooseUs />
    </main>
  );
};

export default Home;

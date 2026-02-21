import { Shield, Users, Home, Award } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verified Properties',
    description: 'All properties are verified and authenticated before listing for your peace of mind.',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    icon: Users,
    title: 'Expert Assistance',
    description: 'Our experienced team is always ready to help you find the perfect property.',
    color: 'bg-purple-50 text-purple-700',
  },
  {
    icon: Home,
    title: 'Wide Range',
    description: 'From apartments to plots, we have a wide range of properties across Bengaluru.',
    color: 'bg-green-50 text-green-700',
  },
  {
    icon: Award,
    title: 'Zero Brokerage',
    description: 'Enjoy direct deals with no hidden charges or brokerage fees on new launches.',
    color: 'bg-orange-50 text-orange-700',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-title">Why Choose Demo Homes V1?</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            We are dedicated to helping you find the best real estate deals in Bengaluru
            with complete transparency and support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${color} mb-4`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

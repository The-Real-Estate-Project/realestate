import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Suresh Babu',
    location: 'Kengeri, Bengaluru',
    initials: 'SB',
    review: "Honestly I was skeptical at first — I'd already wasted three months with another broker who kept showing me sites that were nowhere close to what I asked for. A friend referred me to RR Plots and within two weeks I had a site in RR Nagar that actually matched my budget. No drama, no hidden charges. They even helped me understand the khata documents which I had no clue about.",
  },
  {
    name: 'Meera Krishnamurthy',
    location: 'Originally from Chennai, now settled in Bengaluru',
    initials: 'MK',
    review: "Being from outside Bengaluru, I was worried about getting taken for a ride. But the team was very patient with me. I must have asked the same questions five different times and they never made me feel like a burden. We finalized a plot in Rajarajeshwari Nagar last year and the process was smoother than I expected. Would recommend to anyone who's new to the city.",
  },
  {
    name: 'Ravi & Sunitha Gowda',
    location: 'Mysuru Road, Bengaluru',
    initials: 'RG',
    review: "We were looking for something for our daughter — a small site we could hold for a few years. The person we dealt with was straightforward about which areas had better appreciation potential and which ones to avoid right now. We appreciated that he didn't just try to close the deal quickly. It felt like talking to someone who actually knew the area, not just reading from a brochure.",
  },
  {
    name: 'Anand Swamy',
    location: 'Tumkur Road, Bengaluru',
    initials: 'AS',
    review: "Called them on a Saturday afternoon expecting to leave a voicemail. Someone picked up, spent 40 minutes on the phone with me going through options. That kind of availability is rare. Ended up buying a plot the following month. Very happy with how everything was handled.",
  },
  {
    name: 'Prakash Hegde',
    location: 'Nagarbhavi, Bengaluru',
    initials: 'PH',
    review: "I had a fixed budget and didn't want to go even a rupee over. Most brokers I spoke to kept pushing me towards more expensive options. RR Plots actually respected my number. Found me something decent within what I could afford and didn't make me feel like a second-class buyer for it.",
  },
  {
    name: 'Divya Nair',
    location: 'Banashankari, Bengaluru',
    initials: 'DN',
    review: "My husband and I had been going back and forth on whether to buy a flat or a site. We kept changing our minds. The team at RR Plots sat with us twice, once at their office and once at the site itself, and just listened. No pushy sales talk. That kind of patience is hard to find. We went with a site finally and it was the right call.",
  },
  {
    name: 'Manjunath R',
    location: 'Vijayanagar, Bengaluru',
    initials: 'MR',
    review: "The documentation part is what I was most nervous about. I'd heard stories of people getting stuck with disputed properties. The team walked me through every paper before I signed anything — EC, RTC, conversion order. Everything was clean. That gave me a lot of confidence.",
  },
  {
    name: 'Lakshmi Venkataraman',
    location: 'Jayanagar, Bengaluru',
    initials: 'LV',
    review: "Bought a plot as a retirement investment. I'm not someone who knows much about real estate so I needed a lot of hand-holding. They were very thorough in explaining everything — what the market was doing, which areas to look at, what documents to check. Never felt rushed. Took me almost four months to decide and they were fine with that.",
  },
  {
    name: 'Girish Naik',
    location: 'Yeshwanthpur, Bengaluru',
    initials: 'GN',
    review: "Had a budget of around 40 lakhs and everyone else was showing me options at 55-60 lakhs saying it was 'just slightly above'. RR Plots actually showed me four decent sites within my range. One of them even had road-facing advantage. Very straightforward people to deal with.",
  },
  {
    name: 'Shobha & Rajesh Kumar',
    location: 'Uttarahalli, Bengaluru',
    initials: 'SK',
    review: "We were told about a particular layout that sounded too good to be true, and honestly it was — there were pending litigation issues. RR Plots flagged it before we could make a mistake. That one moment told us everything we needed to know about their integrity. We bought elsewhere through them and it was a completely clean deal.",
  },
  {
    name: 'Vinod Shetty',
    location: 'Mangaluru, investing in Bengaluru',
    initials: 'VS',
    review: "Since I'm not based in Bengaluru full-time I needed someone who could manage the site visits on my behalf and give me honest feedback over calls. That's exactly what they did. WhatsApp updates, photos, even a short video of the surrounding area. Felt like I had eyes on the ground without being there.",
  },
  {
    name: 'Preethi Shankar',
    location: 'Electronic City, Bengaluru',
    initials: 'PS',
    review: "First time buying property. I didn't know what BBMP approved layout meant, I didn't understand why some sites were cheaper than others, I had no idea what a betterment charge was. They explained everything without making me feel stupid. That matters more than people realise.",
  },
  {
    name: 'Karthik Reddy',
    location: 'Whitefield, Bengaluru',
    initials: 'KR',
    review: "I work in IT and my schedule is unpredictable. They accommodated site visits on weekends and even once on a public holiday. Small thing maybe, but it shows how serious they take the client relationship. The plot I bought has already appreciated by the time I'm writing this.",
  },
  {
    name: 'Suma & Nagaraj',
    location: 'Rajarajeshwari Nagar, Bengaluru',
    initials: 'SN',
    review: "We live in the same area and still learned things about our own neighbourhood from them. Which layouts have drainage issues, where the upcoming road widening is happening, which side of the main road to prefer. The local knowledge is genuinely impressive.",
  },
  {
    name: 'Ashok Patil',
    location: 'Dharwad, buying in Bengaluru',
    initials: 'AP',
    review: "My son kept telling me to just do everything online. But I'm old school — I needed to meet someone face to face and ask questions. The team was perfectly comfortable with that. I visited their office twice before committing to anything and they never seemed impatient with me. Good people.",
  },
  {
    name: 'Nandini Kulkarni',
    location: 'Padmanabhanagar, Bengaluru',
    initials: 'NK',
    review: "I specifically asked them not to call me every second day with updates. They respected that completely — sent me a message only when something relevant came up. That kind of professional boundary is honestly underrated when you're dealing with a big financial decision and don't want to be pestered.",
  },
  {
    name: 'Sathish & Kavitha Murthy',
    location: 'Kanakapura Road, Bengaluru',
    initials: 'SM',
    review: "We'd been sitting on the fence for almost a year. Every time we thought we were ready, something would come up — price shot up here, layout approval issue there. RR Plots kept track of what we were looking for even over that gap and reached out when a suitable site came up. That follow-through without being pushy is rare.",
  },
  {
    name: 'Deepak Bhat',
    location: 'Hebbal, Bengaluru',
    initials: 'DB',
    review: "Compared at least six brokers before going with RR Plots. The difference was simple — they gave me actual reasons for their recommendations, not just 'this is a good area'. Why it was good, what the upcoming infrastructure looked like, what the resale history was in that layout. That kind of reasoning builds trust fast.",
  },
  {
    name: 'Rekha Iyer',
    location: 'JP Nagar, Bengaluru',
    initials: 'RI',
    review: "My father-in-law was the one who found RR Plots through a relative. He's not easy to impress when it comes to money matters. But he was satisfied with how transparent they were throughout the process — no surprise costs, no last minute 'oh by the way' moments. We ended up completing the registration without a single hiccup.",
  },
  {
    name: 'Madhukar Rao',
    location: 'HSR Layout, Bengaluru',
    initials: 'MRa',
    review: "I asked some pointed questions about the ownership chain of the plot I was interested in. Instead of getting defensive, they pulled out the documents right there and walked me through each transaction. That level of transparency isn't something you see every day in this industry.",
  },
  {
    name: 'Bhavana & Srikanth',
    location: 'Malleshwaram, Bengaluru',
    initials: 'BS',
    review: "We specifically wanted a corner site with good access and weren't willing to settle. Took three months of searching. They never tried to talk us into something that didn't fit what we wanted just to close the deal faster. When the right one came up, they moved quickly and helped us secure it. Worth the wait.",
  },
  {
    name: 'Ramesh Holiyachi',
    location: 'Rajajinagar, Bengaluru',
    initials: 'RH',
    review: "The registration process was the part I was dreading most. They connected us with the right people, made sure all the paperwork was in order ahead of time, and were present on the registration day itself. Went through without any problems. I've heard horror stories from friends — our experience was nothing like that.",
  },
];

const VALUES = [
  {
    title: 'Honesty Over Hype',
    body: "We don't dress up a plot with marketing language it doesn't deserve. If a site has a limitation, we'll tell you upfront — because a client who buys with clear eyes is a client who comes back.",
  },
  {
    title: 'Your Timeline, Not Ours',
    body: "Real estate is rarely a quick decision, and we've never treated it like one. Whether you need a week or a year to make up your mind, we'll be right here — no pressure, no follow-up calls every other day.",
  },
  {
    title: 'Local Knowledge, No Algorithm',
    body: "We've watched Rajarajeshwari Nagar and the surrounding areas grow street by street. We know which layouts flood in July, which roads are getting widened, and which areas are quietly becoming the next big thing.",
  },
];

const StarIcon = () => (
  <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ReviewCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = (next) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(next);
      setAnimating(false);
    }, 250);
  };

  const prev = () => go(current === 0 ? REVIEWS.length - 1 : current - 1);
  const next = () => go(current === REVIEWS.length - 1 ? 0 : current + 1);

  const { name, location, initials, review } = REVIEWS[current];

  return (
    <div className="relative max-w-3xl mx-auto">

      {/* Card */}
      <div
        className="bg-white/8 backdrop-blur-sm rounded-2xl border border-white/15 px-8 sm:px-12 py-10 transition-opacity duration-250"
        style={{ opacity: animating ? 0 : 1 }}
      >
        {/* Stars */}
        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
        </div>

        {/* Quote */}
        <p className="text-white/85 text-base sm:text-lg leading-relaxed min-h-[100px]">
          "{review}"
        </p>

        {/* Reviewer */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/15">
          <div className="w-11 h-11 rounded-full bg-primary-700 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-white">{name}</p>
            <p className="text-xs text-white/45 mt-0.5">{location}</p>
          </div>
          <div className="ml-auto text-xs text-white/40 font-medium">
            {current + 1} / {REVIEWS.length}
          </div>
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        aria-label="Previous review"
        className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-primary-700 hover:border-primary-700 text-white flex items-center justify-center transition-all duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next review"
        className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-primary-700 hover:border-primary-700 text-white flex items-center justify-center transition-all duration-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators — grouped in sets of 5 for readability */}
      <div className="flex justify-center gap-1.5 mt-8 flex-wrap">
        {REVIEWS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to review ${i + 1}`}
            className={`rounded-full transition-all duration-200 ${
              i === current
                ? 'w-5 h-2 bg-primary-700'
                : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const AboutUs = () => {
  return (
    <div className="min-h-screen">

      {/* ── Full-page video background ─────────────────────────────────── */}
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

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative bg-indigo-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-950 opacity-90" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <img
            src="/rrplots-logo.png"
            alt="RR Plots"
            className="h-40 sm:h-52 lg:h-64 w-auto mx-auto object-contain mb-8"
          />
          <p className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-primary-300 bg-primary-700/20 border border-primary-600/30 rounded-full px-4 py-1.5 mb-6">
            About RR Plots
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            We Know Bengaluru{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-violet-300 to-primary-400">
              Like It's Home.
            </span>
            <br />Because It Is.
          </h1>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12">
            <div className="grid lg:grid-cols-5 gap-10 items-start">
              <div className="lg:col-span-2">
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-300">Our Story</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 leading-snug">
                  Built on Trust, One Family at a Time.
                </h2>
                <div className="mt-5 w-12 h-1 bg-primary-400 rounded-full" />
              </div>
              <div className="lg:col-span-3 space-y-5 text-white/75 text-base leading-relaxed">
                <p>
                  RR Plots didn't start with a grand vision. It started with a simple belief — that buying land in Bengaluru shouldn't feel like navigating a maze blindfolded. Back then, the Rajarajeshwari Nagar area was a fraction of what it is today, and most buyers had to rely entirely on whoever they could trust.
                </p>
                <p>
                  We built this firm on the back of that trust. Our earliest clients were neighbours, friends of friends, people who'd heard our name at a tea stall or from a relative. We'd sit with them, understand what they actually needed — not what was the easiest thing to sell — and find them something that fit.
                </p>
                <p>
                  That's still how we operate today. The city has grown beyond recognition, but the core of what we do hasn't changed: we listen first, and sell second.
                </p>
                <p>
                  With a deep understanding of Bengaluru's micro-markets, regulatory landscape, and long-term growth corridors, we provide the kind of guidance that turns a first-time buyer's anxiety into confidence — and a seasoned investor's due diligence into a profitable decision.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Stand For ─────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-300">What We Stand For</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                The Way We Think About Real Estate
              </h2>
            </div>
            <div className="space-y-5">
              {VALUES.map(({ title, body }, i) => (
                <div
                  key={title}
                  className="flex gap-5 bg-white/8 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/12 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
                    <p className="text-white/65 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews Carousel ──────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-12">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-300">Client Reviews</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                What People Are Saying
              </h2>
              <p className="text-white/40 text-sm mt-2">{REVIEWS.length} verified reviews</p>
            </div>
            <ReviewCarousel />
          </div>
        </div>
      </section>

      {/* ── Mission Strip ─────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-3xl py-14 px-8 sm:px-12 text-center">
            <p className="text-primary-300 text-xs font-semibold tracking-[0.2em] uppercase mb-4">Our Mission</p>
            <blockquote className="text-white text-xl sm:text-2xl font-semibold leading-relaxed">
              "Real estate is not just about property — it's about people, timing, and trust. Backed by 25 years of local expertise, we're here to make sure that when you make one of the biggest decisions of your life, you have someone genuinely in your corner."
            </blockquote>
            <div className="mt-6 w-12 h-1 bg-primary-400 rounded-full mx-auto" />
          </div>
        </div>
      </section>

      {/* ── Contact CTA ───────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-10">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Let's Find You the Right Plot
              </h2>
              <p className="text-white/65 text-sm leading-relaxed mt-3">
                No automated responses. No generic listings. Just a real conversation about what you're looking for and what Bengaluru has to offer right now.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/properties"
                  className="inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  Browse Properties
                </Link>
                <a
                  href="tel:+919945450585"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Call Us Now
                </a>
              </div>
            </div>
            <div className="space-y-4 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-300 mt-0.5 flex-shrink-0" />
                <span>Rajarajeshwari Nagar, Bengaluru, Karnataka</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-300 flex-shrink-0" />
                <a href="tel:+919945450585" className="hover:text-white transition-colors">
                  +91 99454 50585
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-300 flex-shrink-0" />
                <a href="mailto:rrplots@gmail.com" className="hover:text-white transition-colors">
                  rrplots@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;

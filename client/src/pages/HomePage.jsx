import Hero from "../components/Hero";
import TrustStrip from "../components/TrustStrip";
import CombinedSections from "../components/CombinedSections";
import Services from "../components/Services";
import ParallaxGallery from "../components/ParallaxGallery";
import Testimonials from "../components/Testimonials";
import HomeCTA from "../components/HomeCTA";
import Footer from "../components/Footer";
import RevealOnScroll from "../components/RevealOnScroll";
import CTASection from "../components/CTASection";
import CardSwap, { Card } from "../components/CardSwap";
import Gallery from "../components/Gallery";

const services = [
  {
    title: "Weddings",
    description:
      "Capturing the magic of your special day with cinematic storytelling.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Portraits",
    description: "Professional portraits that reveal your unique personality.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
  },
  {
    title: "Fashion",
    description: "High-end editorial shoots for brands and models.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
  },
];

const HomePage = () => {
  return (
    <>
      <Hero />
      <RevealOnScroll>
        <TrustStrip />
      </RevealOnScroll>

      <RevealOnScroll>
        <CombinedSections />
      </RevealOnScroll>

      <RevealOnScroll>
  
      {/* Services Section with CardSwap */}
      <section
        id="services"
        className="py-24 pb-40 bg-warm-ivory overflow-hidden"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-3">
            {/* Left Side - Header and Description */}
            <div className="flex-1 text-center lg:text-left max-w-lg">
              <span className="inline-block text-gold-accent font-inter text-[11px] uppercase tracking-[0.4em] mb-5 font-bold">
                What We Do
              </span>
              <h2 className="font-playfair text-5xl md:text-6xl text-charcoal-black mt-2 mb-8 leading-[1.1]">
                Our <span className="italic text-gold-accent">Services</span>
              </h2>
              <p className="font-playfair text-charcoal-black/90 text-xl md:text-2xl leading-relaxed mb-6 italic">
                "We specialize in capturing life's most precious moments with
                artistry and passion."
              </p>
              <p className="font-inter text-slate-gray leading-[1.8] mb-10 text-[15px] tracking-wide">
                From intimate weddings to stunning fashion editorials, our team
                brings creativity and technical excellence to every project.
                Each photograph tells a unique story, crafted with attention to
                detail and a deep understanding of light, composition, and
                emotion.
              </p>
              <a
                href="/services"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gold-accent text-charcoal-black font-inter text-sm font-semibold uppercase tracking-widest rounded-full hover:bg-charcoal-black hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Services
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>

            {/* Right Side - CardSwap */}
            <div
              className="flex-1 flex justify-center items-center"
              style={{ height: "600px", position: "relative" }}
            >
              <CardSwap
                width={380}
                height={520}
                cardDistance={50}
                verticalDistance={60}
                delay={5000}
                pauseOnHover={true}
              >
                {services.map((service, index) => (
                  <Card
                    key={index}
                    customClass="rounded-xl overflow-hidden shadow-2xl"
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-charcoal-black/80 via-charcoal-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-warm-ivory">
                        <h3 className="font-playfair text-3xl mb-2">
                          {service.title}
                        </h3>
                        <p className="font-inter text-sm opacity-90">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </div>
      </section>

      </RevealOnScroll>
        <Gallery />
      <RevealOnScroll>

      </RevealOnScroll>

      <RevealOnScroll>
        <ParallaxGallery />
      </RevealOnScroll>

      <RevealOnScroll>
        <Testimonials />
      </RevealOnScroll>

      <RevealOnScroll>
        <HomeCTA />
      </RevealOnScroll>
    </>
  );
};

export default HomePage;

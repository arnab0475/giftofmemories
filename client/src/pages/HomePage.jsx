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
import ServiceCategoryGrid from "../components/services/ServiceCategoryGrid";
import ProductCategoryGrid from "../components/products/ProductCategoryGrid";
import Gallery from "../components/Gallery";

const HomePage = () => {
  return (
    <>
      <Hero />

      <RevealOnScroll>
        <TrustStrip />
      </RevealOnScroll>

      <RevealOnScroll>
        {/* Services Section with Category Grid */}
        <section id="services" className="py-20 bg-warm-ivory relative">
          <div className="container mx-auto px-6 md:px-12">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-gold-accent font-inter text-xs uppercase tracking-[0.3em] mb-4 font-bold">
                What We Do
              </span>
              <h2 className="font-playfair text-4xl md:text-6xl text-charcoal-black mb-6">
                Our <span className="italic text-gold-accent">Services</span>
              </h2>
              <p className="font-inter text-slate-gray text-lg leading-relaxed font-light">
                From intimate weddings to stunning fashion editorials, our team
                brings creativity and technical excellence to every project,
                capturing life's most precious moments.
              </p>
            </div>

            {/* Service Grid */}
            <ServiceCategoryGrid />

            <div className="text-center mt-12">
              <a
                href="/services"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-gold-accent text-charcoal-black font-inter text-sm font-semibold uppercase tracking-widest hover:bg-gold-accent hover:text-white transition-all duration-300"
              >
                View All Services
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
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        {/* Products Section */}
        <section id="products" className="py-20 bg-white relative">
          <div className="container mx-auto px-6 md:px-12">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block text-gold-accent font-inter text-xs uppercase tracking-[0.3em] mb-4 font-bold">
                Our Shop
              </span>
              <h2 className="font-playfair text-4xl md:text-6xl text-charcoal-black mb-6">
                Featured{" "}
                <span className="italic text-gold-accent">Products</span>
              </h2>
              <p className="font-inter text-slate-gray text-lg leading-relaxed font-light">
                Preserve your memories with our premium photo prints, albums,
                frames, and unique merchandise. Quality products that last a
                lifetime.
              </p>
            </div>

            {/* Products Grid */}
            <ProductCategoryGrid />

            <div className="text-center mt-12">
              <a
                href="/shop"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-gold-accent text-charcoal-black font-inter text-sm font-semibold uppercase tracking-widest hover:bg-gold-accent hover:text-white transition-all duration-300"
              >
                View All Products
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
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <Gallery />
      </RevealOnScroll>

      <RevealOnScroll>
        <ParallaxGallery />
      </RevealOnScroll>

      <RevealOnScroll>
        <CombinedSections />
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

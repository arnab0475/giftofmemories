import { useState, useEffect } from "react";
import axios from "axios";
import Hero from "../components/Hero";
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
import HomeVideoSection from "../components/HomeVideoSection";

const HomePage = () => {
  const [packages, setPackages] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [homepageSettings, setHomepageSettings] = useState({
    showProducts: true,
    showServices: true,
    showGallery: true,
    showTestimonials: true,
    showScrollGallery: true,
    showStackedGallery: true,
    showHomeVideo: true,
    homeVideos: [],
    productsSectionTitle: "Premium Products",
    productsSectionDescription:
      "Transform your cherished moments into timeless keepsakes. Discover our handcrafted albums, gallery-quality prints, and bespoke merchandise designed to last generations.",
    productsSectionBadge: "Featured Collection",
    servicesSectionTitle: "Our Services",
    servicesSectionDescription:
      "From intimate weddings to stunning fashion editorials, our team brings creativity and technical excellence to every project, capturing life's most precious moments.",
    servicesSectionBadge: "What We Do",
  });

  useEffect(() => {
    const fetchHomepageSettings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/homepage-settings/get-settings`
        );
        setHomepageSettings(response.data);
      } catch (error) {
        console.error("Error fetching homepage settings:", error);
      }
    };
    fetchHomepageSettings();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/services/packages-with-services`
        );
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    // STRICT OVERFLOW CONTROL: Prevents horizontal scrolling on mobile devices
    <div className="overflow-x-hidden bg-charcoal-black selection:bg-gold-accent selection:text-charcoal-black">
      
      {/* ---------------- HERO SECTION ---------------- */}
      <Hero />

      {/* ---------------- PRODUCTS SECTION ---------------- */}
      {homepageSettings.showProducts && (
        <RevealOnScroll>
          <section
            id="products"
            className="py-20 md:py-32 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #faf8f5 0%, #f5f0e8 50%, #faf8f5 100%)`,
            }}
          >
            {/* Top Gold Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-accent/50 to-transparent" />

            {/* Subtle Dotted Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, #C9A24D 1px, transparent 0)`,
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            {/* Soft Glow Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />
            <div className="absolute top-20 left-10 w-64 md:w-80 h-64 md:h-80 bg-gold-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-gold-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
              
              {/* Eyebrow Badge */}
              <div className="flex justify-center mb-6 md:mb-8">
                <div className="inline-flex items-center gap-2.5 md:gap-3 px-5 py-2.5 md:px-6 md:py-3 bg-gold-accent/10 border border-gold-accent/30 rounded-full shadow-sm">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gold-accent rounded-full animate-pulse" />
                  <span className="text-gold-accent font-inter text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
                    {homepageSettings.productsSectionBadge || "Featured Collection"}
                  </span>
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gold-accent rounded-full animate-pulse" />
                </div>
              </div>

              {/* Section Header */}
              <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 px-2">
                <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-charcoal-black mb-6 leading-[1.15]">
                  {(homepageSettings.productsSectionTitle || "Premium Products")
                    .split(" ")
                    .slice(0, -1)
                    .join(" ")}{" "}
                  <span className="italic text-gold-accent relative inline-block">
                    {
                      (homepageSettings.productsSectionTitle || "Premium Products")
                        .split(" ")
                        .slice(-1)[0]
                    }
                    {/* Decorative underline */}
                    <svg
                      className="absolute -bottom-1 md:-bottom-2 left-0 w-full"
                      viewBox="0 0 200 8"
                      fill="none"
                    >
                      <path
                        d="M0 4C50 0 150 8 200 4"
                        stroke="#C9A24D"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h2>
                <p className="font-inter text-slate-gray text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-light max-w-2xl mx-auto">
                  {homepageSettings.productsSectionDescription ||
                    "Transform your cherished moments into timeless keepsakes. Discover our handcrafted albums, gallery-quality prints, and bespoke merchandise designed to last generations."}
                </p>
              </div>

              {/* Dynamic Products Grid Component */}
              <ProductCategoryGrid />

              {/* Call to Action Button */}
              <div className="text-center mt-12 md:mt-16">
                <a
                  href="/shop"
                  className="group relative inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-gold-accent text-white font-inter text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-charcoal-black transition-all duration-500 shadow-[0_10px_30px_rgba(201,162,77,0.3)] hover:shadow-[0_15px_40px_rgba(26,26,26,0.2)] hover:scale-[1.02] rounded-sm"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  Explore Shop
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1.5"
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
            </div>

            {/* Bottom Gold Border Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-accent/50 to-transparent" />
          </section>
        </RevealOnScroll>
      )}

      {/* ---------------- SERVICES SECTION ---------------- */}
      {homepageSettings.showServices && (
        <RevealOnScroll>
          <section id="services" className="py-20 md:py-32 bg-warm-ivory relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10">
              
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 px-2">
                <span className="inline-block text-gold-accent font-inter text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4 font-bold">
                  {homepageSettings.servicesSectionBadge || "What We Do"}
                </span>
                
                <h2 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-charcoal-black mb-6 leading-[1.15]">
                  {(homepageSettings.servicesSectionTitle || "Our Services")
                    .split(" ")
                    .slice(0, -1)
                    .join(" ")}{" "}
                  <span className="italic text-gold-accent">
                    {
                      (homepageSettings.servicesSectionTitle || "Our Services")
                        .split(" ")
                        .slice(-1)[0]
                    }
                  </span>
                </h2>
                
                <p className="font-inter text-slate-gray text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-light max-w-2xl mx-auto">
                  {homepageSettings.servicesSectionDescription ||
                    "From intimate weddings to stunning fashion editorials, our team brings creativity and technical excellence to every project, capturing life's most precious moments."}
                </p>
              </div>

              {/* Dynamic Service Grid Component */}
              <ServiceCategoryGrid
                packages={packages}
                isLoading={isLoadingServices}
              />

              {/* Call to Action Button */}
              <div className="text-center mt-12 md:mt-16">
                <a
                  href="/services"
                  className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 border border-gold-accent text-charcoal-black font-inter text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-gold-accent hover:text-white transition-all duration-300 rounded-sm hover:shadow-lg"
                >
                  View All Services
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
      )}

      {/* ---------------- OPTIONAL BLOCKS ---------------- */}
      
      {homepageSettings.showHomeVideo && homepageSettings.homeVideos?.length > 0 && (
        <RevealOnScroll>
          <HomeVideoSection videos={homepageSettings.homeVideos} />
        </RevealOnScroll>
      )}

      {homepageSettings.showGallery && (
        <RevealOnScroll>
          <ParallaxGallery />
        </RevealOnScroll>
      )}

      {/* Note: Gallery is usually heavy, rendering without RevealOnScroll ensures it computes its layout properly */}
      {homepageSettings.showStackedGallery && <Gallery />}

      {homepageSettings.showScrollGallery && (
        <RevealOnScroll>
          <CombinedSections />
        </RevealOnScroll>
      )}

      {homepageSettings.showTestimonials && (
        <RevealOnScroll>
          <Testimonials />
        </RevealOnScroll>
      )}

      {/* ---------------- FOOTER CALL TO ACTION ---------------- */}
      <RevealOnScroll>
        <HomeCTA />
      </RevealOnScroll>
      
    </div>
  );
};

export default HomePage;
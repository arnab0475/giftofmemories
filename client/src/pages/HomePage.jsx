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
          `${import.meta.env.VITE_NODE_URL}/api/homepage-settings/get-settings`,
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
          `${import.meta.env.VITE_NODE_URL}/api/services/packages-with-services`,
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
    <>
      <Hero />

      {homepageSettings.showProducts && (
        <RevealOnScroll>
          {/* Products Section - Featured First */}
          <section
            id="products"
            className="py-24 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #faf8f5 0%, #f5f0e8 50%, #faf8f5 100%)`,
            }}
          >
            {/* Top Gold Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-accent to-transparent" />

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.04]">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, #C9A24D 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-10 w-80 h-80 bg-gold-accent/15 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-accent/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-accent/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
              {/* Featured Badge */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gold-accent/10 border border-gold-accent/30 rounded-full">
                  <span className="w-2 h-2 bg-gold-accent rounded-full animate-pulse" />
                  <span className="text-gold-accent font-inter text-xs uppercase tracking-[0.2em] font-bold">
                    {homepageSettings.productsSectionBadge ||
                      "Featured Collection"}
                  </span>
                  <span className="w-2 h-2 bg-gold-accent rounded-full animate-pulse" />
                </div>
              </div>

              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-playfair text-5xl md:text-7xl text-charcoal-black mb-6">
                  {(homepageSettings.productsSectionTitle || "Premium Products")
                    .split(" ")
                    .slice(0, -1)
                    .join(" ")}{" "}
                  <span className="italic text-gold-accent relative">
                    {
                      (
                        homepageSettings.productsSectionTitle ||
                        "Premium Products"
                      )
                        .split(" ")
                        .slice(-1)[0]
                    }
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
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
                <p className="font-inter text-slate-gray text-lg md:text-xl leading-relaxed font-light max-w-2xl mx-auto">
                  {homepageSettings.productsSectionDescription ||
                    "Transform your cherished moments into timeless keepsakes. Discover our handcrafted albums, gallery-quality prints, and bespoke merchandise designed to last generations."}
                </p>
              </div>

              {/* Products Grid */}
              <ProductCategoryGrid />

              <div className="text-center mt-14">
                <a
                  href="/shop"
                  className="group relative inline-flex items-center gap-3 px-12 py-5 bg-gold-accent text-white font-inter text-sm font-bold uppercase tracking-widest hover:bg-charcoal-black transition-all duration-500 shadow-[0_10px_40px_rgba(201,162,77,0.4)] hover:shadow-[0_15px_50px_rgba(26,26,26,0.3)] hover:scale-105"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  Explore Shop
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 transition-transform group-hover:translate-x-2"
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
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-accent to-transparent" />
          </section>
        </RevealOnScroll>
      )}

      {homepageSettings.showServices && (
        <RevealOnScroll>
          {/* Services Section with Category Grid */}
          <section id="services" className="py-20 bg-warm-ivory relative">
            <div className="container mx-auto px-6 md:px-12">
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-block text-gold-accent font-inter text-xs uppercase tracking-[0.3em] mb-4 font-bold">
                  {homepageSettings.servicesSectionBadge || "What We Do"}
                </span>
                <h2 className="font-playfair text-4xl md:text-6xl text-charcoal-black mb-6">
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
                <p className="font-inter text-slate-gray text-lg leading-relaxed font-light">
                  {homepageSettings.servicesSectionDescription ||
                    "From intimate weddings to stunning fashion editorials, our team brings creativity and technical excellence to every project, capturing life's most precious moments."}
                </p>
              </div>

              {/* Service Grid */}
              <ServiceCategoryGrid
                packages={packages}
                isLoading={isLoadingServices}
              />

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
      )}

      {homepageSettings.showHomeVideo &&
        homepageSettings.homeVideos?.length > 0 && (
          <RevealOnScroll>
            <HomeVideoSection videos={homepageSettings.homeVideos} />
          </RevealOnScroll>
        )}

      {homepageSettings.showGallery && (
        <RevealOnScroll>
          <ParallaxGallery />
        </RevealOnScroll>
      )}

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

      <RevealOnScroll>
        <HomeCTA />
      </RevealOnScroll>
    </>
  );
};

export default HomePage;

import Hero from "../components/Hero";
import TrustStrip from "../components/TrustStrip";
import CombinedSections from "../components/CombinedSections";
import Services from "../components/Services";
import ParallaxGallery from "../components/ParallaxGallery";
import Testimonials from "../components/Testimonials";
import HomeCTA from "../components/HomeCTA";
import Footer from "../components/Footer";
import RevealOnScroll from "../components/RevealOnScroll";

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
        <Services />
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

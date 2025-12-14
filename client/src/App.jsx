import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-warm-ivory selection:bg-gold-accent selection:text-white">
      <Navbar />

      <main>
        <Hero />
        <TrustStrip />
        <Services />
        <Gallery />
        <Testimonials />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

export default App;

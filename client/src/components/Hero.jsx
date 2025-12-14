import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import hero1 from "../assets/images/hero-1.png";
import hero2 from "../assets/images/hero-2.png";
import hero3 from "../assets/images/hero-3.png";

const heroImages = [
  {
    id: 1,
    src: hero1,
    alt: "Fashion Photography",
    title: "Elegance in Every Frame",
    subtitle: "Capturing the essence of high fashion and individual style.",
  },
  {
    id: 2,
    src: hero2,
    alt: "Wedding Photography",
    title: "Timeless Love Stories",
    subtitle: "Documenting your most precious moments with cinematic beauty.",
  },
  {
    id: 3,
    src: hero3,
    alt: "Portrait Photography",
    title: "The Soul of the Subject",
    subtitle: "Portraits that speak volumes through light and shadow.",
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-charcoal-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={heroImages[currentIndex].src}
            alt={heroImages[currentIndex].alt}
            className="w-full h-full object-cover opacity-60"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black via-charcoal-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center text-center px-6">
        <div className="max-w-4xl z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-warm-ivory mb-6 leading-tight">
                {heroImages[currentIndex].title}
              </h1>
              <p className="font-inter text-lg md:text-xl text-muted-beige mb-10 max-w-2xl mx-auto font-light tracking-wide">
                {heroImages[currentIndex].subtitle}
              </p>
              <motion.a
                href="#portfolio"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-4 bg-gold-accent/90 text-charcoal-black font-inter text-sm uppercase tracking-widest hover:bg-gold-accent transition-colors"
              >
                View Portfolio
              </motion.a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-gold-accent w-8"
                : "bg-warm-ivory/50 hover:bg-warm-ivory"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;

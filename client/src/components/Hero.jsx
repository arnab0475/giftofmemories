import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MegaSearch from "./MegaSearch";
import Loader from "./Loader";

const Hero = () => {
  const [serverHero, setServerHero] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_NODE_URL}/api/hero/hero`,
        );
        if (res.ok) {
          const data = await res.json();
          setServerHero(data);
        }
      } catch (e) {
        console.warn("Could not fetch hero:", e);
      }
    };
    fetchHero();
  }, []);

  // Auto-slide effect
  const images = serverHero?.images || [];
  const slideCount = images.length;

  const nextSlide = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    if (slideCount <= 1) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [slideCount, nextSlide]);

  if (!serverHero) {
    return (
      <section className="relative h-screen w-full z-30 bg-charcoal-black flex items-center justify-center">
        <Loader color="#F5F3EF" />
      </section>
    );
  }

  // Animation variants for crossfade transitions with darkening effect
  const fadeVariants = {
    enter: {
      opacity: 0,
      filter: "brightness(0.6)",
    },
    center: {
      opacity: 1,
      filter: "brightness(1)",
    },
    exit: {
      opacity: 0,
      filter: "brightness(0.6)",
    },
  };

  return (
    <section className="relative h-screen w-full z-30 bg-charcoal-black">
      {/* Image Slider - Crossfade */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentSlide}
            src={images[currentSlide] || ""}
            alt={`${serverHero.title} - Slide ${currentSlide + 1}`}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 1.8, ease: "easeInOut" },
              filter: { duration: 1.8, ease: "easeInOut" },
            }}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-t from-charcoal-black via-charcoal-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-6 z-40">
        <div className="max-w-4xl z-10">
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-warm-ivory mb-6 leading-tight">
            {serverHero.title}
          </h1>
          <p className="font-inter text-lg md:text-xl text-muted-beige mb-6 max-w-2xl mx-auto font-light tracking-wide">
            {serverHero.subtitle}
          </p>
          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 20 }}
              transition={{ delay: 0.8 }}
              className="w-full max-w-4xl mx-auto"
            >
              <MegaSearch />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {slideCount > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-gold-accent w-8"
                  : "bg-white/40 hover:bg-white/60 w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import MegaSearch from "./MegaSearch";
import Loader from "./Loader";

const Hero = () => {
  const [serverHero, setServerHero] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_NODE_URL}/api/hero/hero`);
        if (res.ok) {
          const data = await res.json();
          setServerHero(data);
        }
      } catch (e) {
        console.warn("Could not fetch hero data:", e);
      }
    };
    fetchHero();
  }, []);

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
      <section className="relative h-[100dvh] w-full z-30 bg-charcoal-black flex items-center justify-center">
        <Loader color="#F5F3EF" />
      </section>
    );
  }

  const fadeVariants = {
    enter: { opacity: 0, scale: 1.05 },
    center: { opacity: 0.6, scale: 1 },
    exit: { opacity: 0 },
  };

  return (
    /* FIX: Removed overflow-hidden from here so the dropdown can bleed into the next section */
    <section className="relative h-[100dvh] w-full z-30 bg-charcoal-black">
      
      {/* Background Image Slider Wrapper - Added overflow-hidden here to keep images contained */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentSlide}
            src={images[currentSlide] || ""}
            alt={`${serverHero.title} - Slide ${currentSlide + 1}`}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/60 via-transparent to-charcoal-black/80 pointer-events-none" />
      </div>

      {/* Main Content Area - Ensuring a high z-index for the search bar */}
      <div className="relative z-40 h-full flex flex-col items-center justify-center text-center px-5 sm:px-10">
        <div className="max-w-5xl w-full flex flex-col items-center">
          
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gold-accent font-inter text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-4 drop-shadow-md"
          >
            Candid and cinematic wedding stories by Gift of Memories
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-playfair text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-warm-ivory font-bold mb-6 leading-[1.1] drop-shadow-2xl"
          >
            {serverHero.title || "Preserving Your Legacy"}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-inter text-sm sm:text-lg md:text-xl text-warm-ivory/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg"
          >
            Capturing weddings, celebrations, and unforgettable moments across Kolkata and beyond.
          </motion.p>
          
          {/* SEARCH WRAPPER: Increased bottom margin and removed local overflow logic */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="relative w-full max-w-3xl mb-12 z-50"
          >
            <MegaSearch />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-row items-center justify-center gap-3 sm:gap-4 w-full"
          >
            <Link 
              to="/gallery" 
              className="w-1/2 sm:w-auto px-2 sm:px-10 py-3.5 sm:py-4 text-center bg-gold-accent text-charcoal-black font-inter font-black text-[10px] md:text-xs uppercase tracking-widest rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-xl shadow-black/20"
            >
              View Portfolio
            </Link>
            <Link 
              to="/services" 
              className="w-1/2 sm:w-auto px-2 sm:px-10 py-3.5 sm:py-4 text-center border-2 border-white/30 text-white font-inter font-black text-[10px] md:text-xs uppercase tracking-widest rounded-full hover:bg-white hover:text-charcoal-black hover:scale-105 transition-all duration-300 backdrop-blur-sm"
            >
              Explore Services
            </Link>
          </motion.div>
        </div>
      </div>

      {slideCount > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 transition-all duration-500 rounded-full shadow-lg ${
                index === currentSlide
                  ? "bg-gold-accent w-10"
                  : "bg-white/30 hover:bg-white/60 w-3"
              }`}
              aria-label={`View slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
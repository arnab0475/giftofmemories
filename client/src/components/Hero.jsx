import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MegaSearch from "./MegaSearch";

const Hero = () => {
  const [serverHero, setServerHero] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_NODE_URL}/api/hero/hero`
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

  if (!serverHero) {
    return (
      <section className="relative h-screen w-full z-30 bg-charcoal-black flex items-center justify-center">
        <div className="text-warm-ivory">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative h-screen w-full z-30 bg-charcoal-black">
      <div className="absolute inset-0 w-full h-full">
        <img
          src={serverHero.image}
          alt={serverHero.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-charcoal-black via-charcoal-black/20 to-transparent" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center text-center px-6">
        <div className="max-w-4xl z-10">
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-warm-ivory mb-6 leading-tight">
            {serverHero.title}
          </h1>
          <p className="font-inter text-lg md:text-xl text-muted-beige mb-6 max-w-2xl mx-auto font-light tracking-wide">
            {serverHero.subtitle}
          </p>
          <div className="flex flex-col items-center gap-6">
            <motion.a
              href={serverHero.buttonLink || "#portfolio"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-4 bg-gold-accent/90 text-charcoal-black font-inter text-sm uppercase tracking-widest hover:bg-gold-accent transition-colors"
            >
              {serverHero.buttonText || "View Portfolio"}
            </motion.a>

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
    </section>
  );
};

export default Hero;

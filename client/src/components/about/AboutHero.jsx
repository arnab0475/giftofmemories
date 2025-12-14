import { motion } from "framer-motion";
import aboutHeroBg from "../../assets/images/about-hero.png";

const AboutHero = () => {
  return (
    <section className="relative h-[50vh] w-full overflow-hidden bg-charcoal-black flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={aboutHeroBg}
          alt="Vintage Camera Setup"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/70 via-charcoal-black/30 to-warm-ivory" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-playfair text-4xl md:text-6xl text-warm-ivory mb-6 font-bold tracking-tight">
            The Story Behind The Lens
          </h1>
          <p className="font-inter text-lg text-warm-ivory/90 font-light max-w-2xl mx-auto leading-relaxed">
            We don't just capture images; we preserve the feelings that make
            life beautiful.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;

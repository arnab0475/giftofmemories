import { motion } from "framer-motion";
import galleryHeroBg from "../../assets/images/gallery-hero.png";

const GalleryHero = () => {
  return (
    <section className="relative h-[40vh] w-full overflow-hidden bg-charcoal-black flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={galleryHeroBg}
          alt="Photography Gallery"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal-black/80 to-charcoal-black/40" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-warm-ivory mb-3 font-bold tracking-tight">
            Our Work
          </h1>
          <p className="font-inter text-lg text-muted-beige/80 mb-0 font-light max-w-2xl mx-auto">
            A glimpse into moments we’ve had the privilege to capture. Every
            image tells a unique story of love, joy, and connection.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default GalleryHero;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import serviceHeroBg from "../../assets/images/service-hero.png";

const ServiceHero = () => {
  return (
    <section className="relative h-[45vh] w-full overflow-hidden bg-charcoal-black flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={serviceHeroBg}
          alt="Photography Services"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/60 to-charcoal-black/80" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-warm-ivory mb-4 font-bold tracking-tight">
            Our Photography Services
          </h1>
          <p className="font-inter text-lg text-muted-beige mb-6 font-light">
            Crafted experiences for weddings, events, portraits and brands. We
            turn moments into timeless memories.
          </p>

          {/* Breadcrumbs */}
          <div className="flex items-center justify-center space-x-2 text-sm font-inter uppercase tracking-widest text-warm-ivory/60">
            <Link to="/" className="hover:text-gold-accent transition-colors">
              Home
            </Link>
            <span className="text-gold-accent">•</span>
            <span className="text-warm-ivory">Services</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceHero;

import { motion } from "framer-motion";
import contactHeroBg from "../../assets/images/contact-hero.png";

const ContactHero = () => {
  return (
    <motion.section
      initial="initial"
      whileHover="hover"
      className="relative h-[55vh] w-full overflow-hidden bg-charcoal-black flex items-center justify-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <motion.img
          variants={{
            initial: { scale: 1, opacity: 0.5, x: 0 },
            hover: {
              scale: 1.02,
              opacity: 1,
              x: [0, 10, 0, -10, -5, 0],
              transition: {
                opacity: { duration: 0.5, ease: "easeInOut" },
                x: { duration: 0.5, ease: "easeInOut" },
              },
            },
          }}
          src={contactHeroBg}
          alt="Photography Studio"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-black/90 to-charcoal-black/40" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl text-warm-ivory mb-3 font-bold tracking-tight">
            Get In Touch
          </h1>
          <p className="font-inter text-lg text-muted-beige/80 mb-0 font-light max-w-2xl mx-auto">
            Ready to start your journey? We'd love to hear from you. Tell us
            about your vision, and we'll help bring it to life.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ContactHero;

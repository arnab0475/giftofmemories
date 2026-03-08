import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // FIX 1: Import React Router Link

const CustomPackageCTA = () => {
  return (
    // FIX 2: Scaled down mobile padding (py-16 md:py-24)
    <section className="py-16 md:py-24 bg-gold-accent text-center relative overflow-hidden">
      
      {/* FIX 3: Added a very subtle, elegant inner shadow/gradient to the gold background so it isn't completely flat */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          // Added y: 20 so it slides up gently instead of just scaling in place
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          // Added the margin trigger safety so it fires correctly on mobile
          viewport={{ once: true, margin: "-50px" }} 
          className="max-w-3xl mx-auto"
        >
          {/* Scaled text sizes for small screens */}
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-charcoal-black mb-4 md:mb-6 font-bold leading-tight px-2 drop-shadow-sm">
            Looking for a Custom Photography Package?
          </h2>
          
          <p className="font-inter text-charcoal-black/80 text-base md:text-lg mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
            Tell us your exact requirements and we’ll tailor a comprehensive plan just for your special day.
          </p>
          
          {/* FIX 1 (Cont.): Swapped <button> for <Link> so it routes to your contact page! */}
          <Link 
            to="/contact" 
            // Swapped rounded-[10px] for rounded-full to match the high-end pill shape of your other CTAs
            className="inline-block px-8 py-3.5 md:px-10 md:py-4 bg-charcoal-black text-gold-accent font-inter text-xs md:text-sm uppercase tracking-widest font-bold rounded-full shadow-xl shadow-black/20 hover:bg-warm-ivory hover:text-charcoal-black transition-all duration-300 transform hover:-translate-y-1"
          >
            Request Custom Quote
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomPackageCTA;
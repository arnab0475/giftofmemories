import { motion } from "framer-motion";

const CustomPackageCTA = () => {
  return (
    <section className="py-24 bg-gold-accent text-center">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-playfair text-4xl md:text-5xl text-charcoal-black mb-4 font-bold">
            Looking for a Custom Photography Package?
          </h2>
          <p className="font-inter text-charcoal-black/80 text-lg mb-10">
            Tell us your requirements and we’ll tailor a plan just for you.
          </p>
          <button className="px-10 py-4 bg-charcoal-black text-gold-accent font-inter text-sm uppercase tracking-widest font-bold rounded-[10px] shadow-lg hover:bg-warm-ivory hover:text-charcoal-black transition-all duration-300 transform hover:scale-105">
            Request Custom Quote
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomPackageCTA;

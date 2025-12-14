import { motion } from "framer-motion";

const GalleryCTA = () => {
  return (
    <section className="py-24 bg-gold-accent text-center">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal-black mb-4">
            Loved What You See?
          </h2>
          <p className="font-inter text-lg text-charcoal-black/80 mb-10 block">
            Let us capture your story next. Dates fill up fast.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3 bg-charcoal-black text-gold-accent font-inter text-sm uppercase tracking-widest font-bold rounded-[6px] shadow-lg hover:bg-warm-ivory hover:text-charcoal-black transition-all">
              Book a Session
            </button>
            <button className="px-8 py-3 border border-charcoal-black text-charcoal-black font-inter text-sm uppercase tracking-widest font-bold rounded-[6px] hover:bg-charcoal-black hover:text-gold-accent transition-all">
              Talk on WhatsApp
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GalleryCTA;

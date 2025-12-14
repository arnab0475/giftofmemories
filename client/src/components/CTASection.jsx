import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section id="contact" className="py-32 bg-warm-ivory text-center">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-playfair text-5xl md:text-6xl text-charcoal-black mb-6">
            Let's Create Something Beautiful
          </h2>
          <p className="font-inter text-slate-gray mb-10 text-lg font-light">
            Ready to capture your story? Get in touch to discuss your project or
            book a session.
          </p>
          <motion.a
            href="mailto:hello@lumina.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 py-4 bg-charcoal-black text-warm-ivory font-inter text-sm uppercase tracking-widest hover:bg-gold-accent hover:text-charcoal-black transition-all duration-300 shadow-lg"
          >
            Book a Consultation
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

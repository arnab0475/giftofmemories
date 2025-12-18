import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutCTA = () => {
  return (
    <section className="py-24 bg-white text-center">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal-black mb-4">
            Ready to Write Your Chapter?
          </h2>
          <p className="font-inter text-lg text-charcoal-black/80 mb-10 block max-w-xl mx-auto">
            We break everything down for you. Reach out to us for a
            no-obligation chat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3 bg-charcoal-black text-gold-accent font-inter text-sm uppercase tracking-widest font-bold rounded-[6px] shadow-lg hover:bg-warm-ivory hover:text-charcoal-black transition-all"
            >
              Start a Conversation
            </Link>
            <Link
              to="/gallery"
              className="px-8 py-3 border border-charcoal-black text-charcoal-black font-inter text-sm uppercase tracking-widest font-bold rounded-[6px] hover:bg-charcoal-black hover:text-gold-accent transition-all"
            >
              View Portfolio
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutCTA;

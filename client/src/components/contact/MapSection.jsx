import { motion } from "framer-motion";
import mapImage from "../../assets/images/map-placeholder.png";

const MapSection = () => {
  return (
    <section className="py-20 bg-warm-ivory">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[14px] overflow-hidden shadow-sm h-[400px] md:h-[500px] border border-muted-beige/30"
        >
          {/* Static Image Placeholder for Map */}
          <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
            <img
              src={mapImage}
              alt="Studio Location Map"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white p-6 rounded-lg shadow-lg max-w-xs">
            <h4 className="font-playfair text-lg font-bold text-charcoal-black mb-2">
              Gift of Memories
            </h4>
            <p className="font-inter text-sm text-slate-gray mb-3">
              Sukanta pally Rabindra Nagar, Dum Dum Cantonment , Kolkata, West Bengal, India
            </p>
            <a
              href="https://maps.app.goo.gl/8efg7B8JEt9n89bw5?g_st=aw"
              target="_blank"
              rel="noreferrer"
              className="text-gold-accent font-inter text-xs font-bold uppercase tracking-widest hover:text-charcoal-black transition-colors"
            >
              Get Directions
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;

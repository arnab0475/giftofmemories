import { motion } from "framer-motion";

const stats = [
  { value: "8+", label: "Years of Experience" },
  { value: "500+", label: "Happy Couples" },
  { value: "1200+", label: "Events Covered" },
  { value: "50+", label: "Cities Travelled" },
];

const StatsStrip = () => {
  return (
    <div className="bg-charcoal-black py-12 border-y border-gold-accent/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h4 className="font-playfair text-3xl md:text-4xl text-gold-accent font-bold mb-1">
                {stat.value}
              </h4>
              <span className="font-inter text-xs md:text-sm text-stone-300 uppercase tracking-widest">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsStrip;

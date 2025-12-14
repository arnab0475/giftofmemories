import { motion } from "framer-motion";
import { Heart, Star, Camera } from "lucide-react";

const ValuesSection = () => {
  const values = [
    {
      icon: <Heart size={32} />,
      title: "Emotional Depth",
      description:
        "We look beyond the pose to find the genuine feelings—the unspoken words, the tearful glances.",
    },
    {
      icon: <Star size={32} />,
      title: "Premium Quality",
      description:
        "From capturing RAW moments to our post-processing, we ensure every pixel is perfect.",
    },
    {
      icon: <Camera size={32} />,
      title: "Timeless Style",
      description:
        "Trends fade, but photographs shouldn't. Our editing style ensures your images look classic, elegant, and real years later.",
    },
  ];

  return (
    <section className="py-24 bg-muted-beige/40">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-warm-ivory shadow-sm flex items-center justify-center text-gold-accent mb-6 border border-white">
                {value.icon}
              </div>
              <h3 className="font-playfair text-xl font-bold text-charcoal-black mb-3">
                {value.title}
              </h3>
              <p className="font-inter text-slate-gray text-sm leading-relaxed max-w-xs mx-auto">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;

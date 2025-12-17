import { Award, Camera, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";

const TrustStrip = () => {
  const stats = [
    { icon: <Camera size={24} />, label: "Years Experience", value: "10+" },
    { icon: <Heart size={24} />, label: "Happy Couples", value: "500+" },
    { icon: <Award size={24} />, label: "Awards Won", value: "15" },
    { icon: <Users size={24} />, label: "Events Covered", value: "1200+" },
  ];

  return (
    <div className="bg-gold-accent py-16 border-b border-muted-beige">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center space-y-2 group cursor-default"
            >
              <div className="text-slate-gray mb-2 transition-transform duration-300 group-hover:scale-110">
                {stat.icon}
              </div>
              <h3 className="font-playfair text-3xl font-bold text-charcoal-black">
                {stat.value}
              </h3>
              <p className="font-inter text-sm uppercase tracking-widest text-slate-gray">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustStrip;

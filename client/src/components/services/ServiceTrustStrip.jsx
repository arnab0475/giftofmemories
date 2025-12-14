import { Camera, Clock, Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const ServiceTrustStrip = () => {
  const items = [
    { icon: <Camera size={24} />, label: "Pro Equipment" },
    { icon: <Clock size={24} />, label: "On-Time Delivery" },
    { icon: <Users size={24} />, label: "Expert Team" },
    { icon: <ShieldCheck size={24} />, label: "Transparent Pricing" },
  ];

  return (
    <div className="bg-warm-ivory py-16 border-t border-muted-beige/40">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-gold-accent/10 flex items-center justify-center text-gold-accent mb-1">
                {item.icon}
              </div>
              <span className="font-inter text-sm font-semibold text-charcoal-black uppercase tracking-wide">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceTrustStrip;

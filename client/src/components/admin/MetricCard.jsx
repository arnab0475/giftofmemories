import { motion } from "framer-motion";

const MetricCard = ({ label, value, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-[14px] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-[#2B2B2B]/5 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-[#2B2B2B]/60 text-sm font-medium font-inter">
          {label}
        </p>
        <div className="p-2 bg-[#FAF9F6] rounded-full group-hover:bg-[#C9A24D]/10 transition-colors">
          <Icon size={20} className="text-[#C9A24D]" />
        </div>
      </div>

      <h3 className="font-playfair text-3xl font-bold text-[#0F0F0F] tracking-tight">
        {value}
      </h3>

      {/* Subtle bottom accent line on hover */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#C9A24D] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </motion.div>
  );
};

export default MetricCard;

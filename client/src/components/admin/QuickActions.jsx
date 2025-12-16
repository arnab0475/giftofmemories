import { Plus, Upload, Bell } from "lucide-react";
import { motion } from "framer-motion";

const QuickActions = () => {
  const actions = [
    { label: "Add New Service", icon: Plus },
    { label: "Upload Gallery Item", icon: Upload },
    { label: "Create Reminder", icon: Bell },
  ];

  return (
    <div className="bg-[#E5DCCF]/50 md:bg-[#EDE6DB] rounded-[12px] p-4 flex flex-col md:flex-row items-center gap-4 border border-[#2B2B2B]/5">
      <div className="flex items-center gap-2 mr-auto md:mr-4">
        <span className="text-[#2B2B2B] text-xs font-bold uppercase tracking-widest px-2">
          Quick Actions
        </span>
        <div className="h-4 w-[1px] bg-[#2B2B2B]/20 hidden md:block"></div>
      </div>

      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-transparent border border-[#C9A24D] rounded-lg text-[#0F0F0F] text-[13px] font-semibold hover:bg-[#C9A24D] hover:text-white transition-all duration-300 flex-1 md:flex-none justify-center whitespace-nowrap"
          >
            <action.icon size={14} />
            {action.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

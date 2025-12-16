import { motion } from "framer-motion";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F5] p-8 font-inter">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="font-playfair text-4xl text-[#0F0F0F] mb-6">
          Dashboard
        </h1>
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#E5E5E5]">
          <p className="text-[#2B2B2B]">Welcome to the Admin Dashboard.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;

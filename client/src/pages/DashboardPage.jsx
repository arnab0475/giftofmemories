import { motion } from "framer-motion";
import { Layers, Image, MessageSquare, Bell } from "lucide-react";

import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import MetricCard from "../components/admin/MetricCard";
import QuickActions from "../components/admin/QuickActions";
import RecentEnquiries from "../components/admin/RecentEnquiries";

const DashboardPage = () => {
  const metrics = [
    { label: "Total Services", value: "12", icon: Layers, delay: 0.1 },
    { label: "Gallery Items", value: "148", icon: Image, delay: 0.2 },
    { label: "Total Enquiries", value: "342", icon: MessageSquare, delay: 0.3 },
    { label: "Reminders Set", value: "8", icon: Bell, delay: 0.4 },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
      <Sidebar />

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[1600px] mx-auto space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>

            <QuickActions />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-3">
                <RecentEnquiries />
              </div>
            </div>

            <div className="bg-white p-6 rounded-[14px] shadow-sm border border-[#2B2B2B]/5">
              <h3 className="font-playfair text-lg font-semibold text-[#0F0F0F] mb-4">
                Activity Overview (Last 7 Days)
              </h3>
              <div className="flex items-end justify-between h-[120px] gap-2 mt-4 px-2">
                {[35, 55, 40, 75, 50, 90, 65].map((height, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 flex-1 group"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{
                        delay: 0.5 + i * 0.1,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      className="w-full bg-[#EDE6DB] rounded-t-sm group-hover:bg-[#C9A24D] transition-colors duration-300 relative"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0F0F0F] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {height} Visits
                      </div>
                    </motion.div>
                    <span className="text-[10px] text-[#2B2B2B]/40 font-semibold uppercase">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

import { ArrowRight } from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";

const RecentEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/enquiry/enquiries`,
          {
            withCredentials: true,
          }
        );
        setEnquiries(res.data.slice(0, 10)); // show latest 10
      } catch (err) {
        // Fallback to empty or previously hardcoded data on error
        setEnquiries([]);
        console.error("Failed to fetch enquiries", err);
      }
    };
    fetchEnquiries();
  }, []);

  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "new":
        return "bg-[#C9A24D]/10 text-[#C9A24D] border-[#C9A24D]/20";
      case "responded":
        return "bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20";
      case "pending":
        return "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20";
      default:
        return "bg-[#2B2B2B]/5 text-[#2B2B2B]/60 border-[#2B2B2B]/10";
    }
  };

  const capitalize = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  return (
    <div className="bg-white rounded-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#2B2B2B]/5 overflow-hidden font-inter">
      <div className="p-6 flex items-center justify-between border-b border-[#2B2B2B]/5">
        <h3 className="font-playfair text-lg font-semibold text-[#0F0F0F]">
          Recent Enquiries
        </h3>
        <button className="text-[#C9A24D] text-[13px] font-semibold hover:text-[#0F0F0F] transition-colors flex items-center gap-1 group">
          View All{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF9F6] text-[#2B2B2B]/60 text-[12px] uppercase tracking-wider font-semibold border-b border-[#2B2B2B]/5">
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Contact Detail</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Date Rec.</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-[#6B6B6B]"
                >
                  No enquiries found
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry, index) => (
                <tr
                  key={enquiry._id || index}
                  className="border-b border-[#2B2B2B]/5 hover:bg-[#FAF9F6] transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 text-[#0F0F0F] text-sm font-medium">
                    {enquiry.name}
                  </td>
                  <td className="px-6 py-4 text-[#2B2B2B] text-sm">
                    {enquiry.email || enquiry.phone}
                  </td>
                  <td className="px-6 py-4 text-[#2B2B2B] text-sm">
                    {enquiry.source ? enquiry.source : "Website"}
                  </td>
                  <td className="px-6 py-4 text-[#2B2B2B]/70 text-sm">
                    {enquiry.createdAt
                      ? new Date(enquiry.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getStatusStyle(
                        enquiry.status ? capitalize(enquiry.status) : "New"
                      )}`}
                    >
                      {enquiry.status ? capitalize(enquiry.status) : "New"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 text-center md:hidden">
        <p className="text-xs text-gray-400">Scroll right to view table</p>
      </div>
    </div>
  );
};

export default RecentEnquiries;

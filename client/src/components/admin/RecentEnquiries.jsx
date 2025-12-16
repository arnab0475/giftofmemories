import { ArrowRight } from "lucide-react";

const RecentEnquiries = () => {
  const enquiries = [
    {
      name: "Emily Parker",
      contact: "emily@example.com",
      source: "Website",
      date: "Oct 24, 2025",
      status: "New",
    },
    {
      name: "Ryan Simmons",
      contact: "+1 (555) 012-3400",
      source: "Chatbot",
      date: "Oct 24, 2025",
      status: "Pending",
    },
    {
      name: "Sarah Wong",
      contact: "sarah.w@test.com",
      source: "WhatsApp",
      date: "Oct 23, 2025",
      status: "Responded",
    },
    {
      name: "David Chen",
      contact: "+1 (555) 987-6543",
      source: "Popup",
      date: "Oct 22, 2025",
      status: "New",
    },
    {
      name: "Jessica Alba",
      contact: "jessica@demo.com",
      source: "Website",
      date: "Oct 21, 2025",
      status: "Responded",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-[#C9A24D]/10 text-[#C9A24D] border-[#C9A24D]/20";
      case "Responded":
        return "bg-[#2ECC71]/10 text-[#2ECC71] border-[#2ECC71]/20";
      default:
        return "bg-[#2B2B2B]/5 text-[#2B2B2B]/60 border-[#2B2B2B]/10";
    }
  };

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
            {enquiries.map((enquiry, index) => (
              <tr
                key={index}
                className="border-b border-[#2B2B2B]/5 hover:bg-[#FAF9F6] transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 text-[#0F0F0F] text-sm font-medium">
                  {enquiry.name}
                </td>
                <td className="px-6 py-4 text-[#2B2B2B] text-sm">
                  {enquiry.contact}
                </td>
                <td className="px-6 py-4 text-[#2B2B2B] text-sm">
                  {enquiry.source}
                </td>
                <td className="px-6 py-4 text-[#2B2B2B]/70 text-sm">
                  {enquiry.date}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getStatusStyle(
                      enquiry.status
                    )}`}
                  >
                    {enquiry.status}
                  </span>
                </td>
              </tr>
            ))}
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

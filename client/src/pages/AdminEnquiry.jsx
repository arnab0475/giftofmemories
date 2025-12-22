import { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";

const AdminEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/enquiry/enquiries`,
          {
            withCredentials: true,
          }
        );
        setEnquiries(res.data);
      } catch (err) {
        setError("Failed to load enquiries");
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  return (
    <div className="flex min-h-screen bg-warm-ivory font-inter">
      <Sidebar />
      <div className="flex-1 ml-65 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-8 overflow-x-auto">
          <div className="max-w-400 mx-auto space-y-8">
            <h2 className="font-playfair text-3xl font-bold text-charcoal-black mb-8">
              All Enquiries
            </h2>
            {loading ? (
              <div className="text-center text-slate-gray/60 py-10">
                Loading...
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-10">{error}</div>
            ) : (
              <div className="bg-white rounded-[14px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-gray/5 overflow-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-warm-ivory text-slate-gray/60 text-[12px] uppercase tracking-wider font-semibold border-b border-slate-gray/5">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Event Type</th>
                      <th className="px-6 py-4">Event Date</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-8 text-center text-sm text-slate-gray/60"
                        >
                          No enquiries found
                        </td>
                      </tr>
                    ) : (
                      enquiries.map((enquiry) => (
                        <tr
                          key={enquiry._id}
                          onClick={() =>
                            window.location.assign(
                              `/admin-enquiries/${enquiry._id}`
                            )
                          }
                          className="border-b border-slate-gray/5 hover:bg-warm-ivory transition-colors group cursor-pointer"
                        >
                          <td className="px-6 py-4 text-charcoal-black text-sm font-medium">
                            {enquiry.name}
                          </td>
                          <td className="px-6 py-4 text-slate-gray text-sm">
                            {enquiry.email}
                          </td>
                          <td className="px-6 py-4 text-slate-gray text-sm">
                            {enquiry.phone}
                          </td>
                          <td className="px-6 py-4 text-slate-gray text-sm">
                            {enquiry.eventType}
                          </td>
                          <td className="px-6 py-4 text-slate-gray text-sm">
                            {enquiry.eventDate
                              ? new Date(enquiry.eventDate).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-6 py-4 text-slate-gray text-sm">
                            {enquiry.source ? enquiry.source : "Website"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getStatusStyle(
                                enquiry.status
                              )}`}
                            >
                              {capitalize(enquiry.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-gray/70 text-sm">
                            {enquiry.createdAt
                              ? new Date(enquiry.createdAt).toLocaleString()
                              : "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="p-4 text-center md:hidden">
                  <p className="text-xs text-gray-400">
                    Scroll right to view table
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

function getStatusStyle(status) {
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
}
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

export default AdminEnquiry;

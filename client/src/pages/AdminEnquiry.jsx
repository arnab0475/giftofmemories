import { useEffect, useState, useMemo } from "react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { RefreshCw } from "lucide-react";
import Loader from "../components/Loader";

const AdminEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Filter UI and state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    search: "",
    from: "",
    to: "",
  });

  const handleFilterChange = (e) =>
    setFilters((s) => ({ ...s, [e.target.name]: e.target.value }));

  const clearFilters = () =>
    setFilters({ status: "", source: "", search: "", from: "", to: "" });

  const filteredEnquiries = useMemo(() => {
    if (!enquiries || enquiries.length === 0) return [];
    return enquiries.filter((q) => {
      // search by name/email/phone
      if (filters.search) {
        const s = filters.search.toLowerCase();
        const hay =
          `${q.name} ${q.email} ${q.phone} ${q.eventType}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      if (filters.status && filters.status !== "all") {
        if ((q.status || "").toLowerCase() !== filters.status) return false;
      }
      if (filters.source && filters.source !== "all") {
        const src = (q.source || "website").toLowerCase();
        if (filters.source === "website" && src !== "website") return false;
        if (filters.source === "other" && src === "website") return false;
      }
      if (filters.from) {
        const created = q.createdAt ? new Date(q.createdAt) : null;
        if (!created) return false;
        const fromDate = new Date(filters.from + "T00:00:00");
        if (created < fromDate) return false;
      }
      if (filters.to) {
        const created = q.createdAt ? new Date(q.createdAt) : null;
        if (!created) return false;
        const toDate = new Date(filters.to + "T23:59:59");
        if (created > toDate) return false;
      }
      return true;
    });
  }, [enquiries, filters]);

  const fetchEnquiries = async () => {
    try {
      setError("");
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
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEnquiries();
  };

  useEffect(() => {
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
              <div className="text-center py-10">
                <Loader />
              </div>
            ) : error ? (
              <div className="text-center text-red-600 py-10">{error}</div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-slate-gray/60">
                    Showing {filteredEnquiries.length} of {enquiries.length}{" "}
                    enquiries
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="py-1 px-3 bg-white border rounded-md text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${
                          refreshing ? "animate-spin" : ""
                        }`}
                      />
                      {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                    <button
                      onClick={() => setShowFilters((s) => !s)}
                      className="py-1 px-3 bg-white border rounded-md text-sm hover:bg-slate-50"
                    >
                      {showFilters ? "Hide Filters" : "Filters"}
                    </button>
                    <button
                      onClick={() => {
                        setFilters({
                          status: "",
                          source: "",
                          search: "",
                          from: "",
                          to: "",
                        });
                      }}
                      className="py-1 px-3 bg-white border rounded-md text-sm hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div className="bg-white p-4 rounded-[10px] border border-slate-gray/5 mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
                    <select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="p-2 border rounded"
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="responded">Responded</option>
                      <option value="new">New</option>
                    </select>

                    <select
                      name="source"
                      value={filters.source}
                      onChange={handleFilterChange}
                      className="p-2 border rounded"
                    >
                      <option value="">All Sources</option>
                      <option value="website">Website</option>
                      <option value="other">Other</option>
                    </select>

                    <input
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Search name, email, phone"
                      className="p-2 border rounded"
                    />

                    <input
                      name="from"
                      value={filters.from}
                      onChange={handleFilterChange}
                      type="date"
                      className="p-2 border rounded"
                    />

                    <input
                      name="to"
                      value={filters.to}
                      onChange={handleFilterChange}
                      type="date"
                      className="p-2 border rounded"
                    />
                  </div>
                )}

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
                      {filteredEnquiries.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-6 py-8 text-center text-sm text-slate-gray/60"
                          >
                            No enquiries found
                          </td>
                        </tr>
                      ) : (
                        filteredEnquiries.map((enquiry) => (
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
                                ? new Date(
                                    enquiry.eventDate
                                  ).toLocaleDateString()
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
              </>
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

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingBag,
  Star,
  Image,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import Loader from "../components/Loader";

const AdminReportsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState({
    bookings: {
      total: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      thisMonth: 0,
      lastMonth: 0,
    },
    users: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
    },
    services: {
      total: 0,
      mostBooked: [],
    },
    products: {
      total: 0,
      bestsellers: 0,
    },
    gallery: {
      total: 0,
    },
    blogs: {
      total: 0,
    },
    testimonials: {
      total: 0,
    },
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [
        enquiriesRes,
        usersRes,
        servicesRes,
        productsRes,
        galleryRes,
        blogsRes,
        testimonialsRes,
      ] = await Promise.all([
        axios.get(`${import.meta.env.VITE_NODE_URL}/api/enquiry/enquiries`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_NODE_URL}/api/users/all`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_NODE_URL}/api/services/services`),
        axios.get(`${import.meta.env.VITE_NODE_URL}/api/shop/get-products`),
        axios.get(`${import.meta.env.VITE_NODE_URL}/api/gallery/get-gallery`),
        axios.get(`${import.meta.env.VITE_NODE_URL}/api/blogs`),
        axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/testimonial/testimonials`
        ),
      ]);

      const enquiries = enquiriesRes.data;
      const users = usersRes.data;
      const services = servicesRes.data;
      const products = productsRes.data;

      // Calculate dates
      const now = new Date();
      const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Bookings statistics
      const bookingsThisMonth = enquiries.filter(
        (e) => new Date(e.createdAt) >= firstDayThisMonth
      ).length;
      const bookingsLastMonth = enquiries.filter(
        (e) =>
          new Date(e.createdAt) >= firstDayLastMonth &&
          new Date(e.createdAt) <= lastDayLastMonth
      ).length;

      // Users statistics
      const usersThisMonth = users.filter(
        (u) => new Date(u.createdAt) >= firstDayThisMonth
      ).length;
      const usersLastMonth = users.filter(
        (u) =>
          new Date(u.createdAt) >= firstDayLastMonth &&
          new Date(u.createdAt) <= lastDayLastMonth
      ).length;

      // Most booked services
      const serviceBookingCount = {};
      enquiries.forEach((e) => {
        if (e.eventType) {
          serviceBookingCount[e.eventType] =
            (serviceBookingCount[e.eventType] || 0) + 1;
        }
      });

      const mostBooked = Object.entries(serviceBookingCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      setReports({
        bookings: {
          total: enquiries.length,
          pending: enquiries.filter((e) => e.status === "pending").length,
          accepted: enquiries.filter((e) => e.status === "accepted").length,
          rejected: enquiries.filter((e) => e.status === "rejected").length,
          thisMonth: bookingsThisMonth,
          lastMonth: bookingsLastMonth,
        },
        users: {
          total: users.length,
          thisMonth: usersThisMonth,
          lastMonth: usersLastMonth,
        },
        services: {
          total: services.length,
          mostBooked,
        },
        products: {
          total: products.length,
          bestsellers: products.filter((p) => p.isBestseller).length,
        },
        gallery: {
          total: galleryRes.data.length,
        },
        blogs: {
          total: blogsRes.data.length,
        },
        testimonials: {
          total: testimonialsRes.data.length,
        },
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const exportReport = () => {
    const reportData = JSON.stringify(reports, null, 2);
    const blob = new Blob([reportData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reports-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report exported successfully!");
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, growth, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-lg bg-${color}-100 text-${color}-600 flex items-center justify-center`}
        >
          <Icon size={24} />
        </div>
        {growth !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              growth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp size={16} />
            {growth >= 0 ? "+" : ""}
            {growth}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-charcoal-black mb-1">{value}</h3>
      <p className="text-sm text-slate-gray font-medium">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
      <Sidebar />

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1600px] mx-auto space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-playfair text-3xl font-bold text-charcoal-black">
                  Analytics & Reports
                </h1>
                <p className="text-slate-gray text-sm mt-1">
                  Comprehensive overview of your business metrics
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchReports}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    size={18}
                    className={isLoading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
                <button
                  onClick={exportReport}
                  className="flex items-center gap-2 bg-gold-accent text-white px-5 py-2.5 rounded-lg hover:brightness-105 transition-all font-medium"
                >
                  <Download size={18} />
                  Export Report
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader color="#C9A24D" />
              </div>
            ) : (
              <>
                {/* Overview Stats */}
                <div>
                  <h2 className="text-lg font-semibold text-charcoal-black mb-4">
                    Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      icon={Calendar}
                      title="Total Bookings"
                      value={reports.bookings.total}
                      subtitle={`${reports.bookings.thisMonth} this month`}
                      growth={calculateGrowth(
                        reports.bookings.thisMonth,
                        reports.bookings.lastMonth
                      )}
                      color="blue"
                    />
                    <StatCard
                      icon={Users}
                      title="Registered Users"
                      value={reports.users.total}
                      subtitle={`${reports.users.thisMonth} this month`}
                      growth={calculateGrowth(
                        reports.users.thisMonth,
                        reports.users.lastMonth
                      )}
                      color="purple"
                    />
                    <StatCard
                      icon={ShoppingBag}
                      title="Products"
                      value={reports.products.total}
                      subtitle={`${reports.products.bestsellers} bestsellers`}
                      color="green"
                    />
                    <StatCard
                      icon={Image}
                      title="Gallery Items"
                      value={reports.gallery.total}
                      color="orange"
                    />
                  </div>
                </div>

                {/* Bookings Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-charcoal-black mb-4 flex items-center gap-2">
                      <Calendar size={20} className="text-gold-accent" />
                      Bookings Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-gray">
                          Pending
                        </span>
                        <span className="text-xl font-bold text-yellow-600">
                          {reports.bookings.pending}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-gray">
                          Accepted
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          {reports.bookings.accepted}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-gray">
                          Rejected
                        </span>
                        <span className="text-xl font-bold text-red-600">
                          {reports.bookings.rejected}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Most Booked Services */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-charcoal-black mb-4 flex items-center gap-2">
                      <Star size={20} className="text-gold-accent" />
                      Most Booked Services
                    </h3>
                    {reports.services.mostBooked.length > 0 ? (
                      <div className="space-y-3">
                        {reports.services.mostBooked.map((service, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gold-accent/20 flex items-center justify-center text-gold-accent font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="text-sm font-medium text-charcoal-black">
                                {service.name}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-gold-accent">
                              {service.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-8">
                        No bookings data yet
                      </p>
                    )}
                  </div>
                </div>

                {/* Content Stats */}
                <div>
                  <h2 className="text-lg font-semibold text-charcoal-black mb-4">
                    Content & Engagement
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                      icon={FileText}
                      title="Services"
                      value={reports.services.total}
                      color="indigo"
                    />
                    <StatCard
                      icon={FileText}
                      title="Blog Posts"
                      value={reports.blogs.total}
                      color="pink"
                    />
                    <StatCard
                      icon={Star}
                      title="Testimonials"
                      value={reports.testimonials.total}
                      color="amber"
                    />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminReportsPage;

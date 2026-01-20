import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  Check,
  X,
  UserCheck,
  UserX,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import Loader from "../components/Loader";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/users/all`,
        { withCredentials: true }
      );
      // Filter to show only approved users
      setUsers(res.data.filter((user) => user.status === "approved"));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_NODE_URL}/api/users/${userId}`,
        { withCredentials: true }
      );
      setUsers(users.filter((u) => u._id !== userId));
      toast.success("User deleted");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  // Filter users by search
  // Filter users by search
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const stats = {
    approved: users.length, // All users shown are approved
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      approved: "bg-emerald-100 text-emerald-800 border border-emerald-200",
      rejected: "bg-red-100 text-red-800 border border-red-200",
    };
    return styles[status] || styles.pending;
  };

  const getRoleBadge = (role) => {
    return role === "vip"
      ? "bg-purple-100 text-purple-800 border border-purple-200"
      : "bg-slate-100 text-slate-600 border border-slate-200";
  };

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
                  User Management
                </h1>
                <p className="text-slate-gray text-sm mt-1">
                  View all registered users
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 max-w-sm">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 rounded-lg">
                    <CheckCircle size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-charcoal-black">
                      {stats.approved}
                    </p>
                    <p className="text-xs text-slate-gray">
                      Total Registered Users
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-gray"
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold-accent bg-white"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center">
                  <Loader color="#C9A24D" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-slate-gray">
                  No users found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-gray uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-gray uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-gray uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-gray uppercase tracking-wider">
                          Discount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-gray uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-gray uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gold-accent/10 flex items-center justify-center text-gold-accent font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-charcoal-black">
                                  {user.name}
                                </p>
                                <p className="text-xs text-slate-gray">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-gray">
                            {user.phone || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadge(
                                user.role
                              )}`}
                            >
                              {user.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-charcoal-black">
                            {user.discount}%
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-gray">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsersPage;

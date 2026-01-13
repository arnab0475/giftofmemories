import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
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

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    status: "approved",
    role: "user",
    discount: 15,
    notes: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/users/all`,
        { withCredentials: true }
      );
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update existing user
        const res = await axios.put(
          `${import.meta.env.VITE_NODE_URL}/api/users/${editingUser._id}`,
          formData,
          { withCredentials: true }
        );
        setUsers(
          users.map((u) => (u._id === editingUser._id ? res.data.user : u))
        );
        toast.success("User updated successfully");
      } else {
        // Create new user
        const res = await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/users/create`,
          formData,
          { withCredentials: true }
        );
        setUsers([res.data.user, ...users]);
        toast.success("User created successfully");
      }
      closeModal();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(error.response?.data?.message || "Failed to save user");
    }
  };

  const handleApprove = async (userId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_NODE_URL}/api/users/${userId}/approve`,
        {},
        { withCredentials: true }
      );
      setUsers(users.map((u) => (u._id === userId ? res.data.user : u)));
      toast.success("User approved");
    } catch (error) {
      toast.error("Failed to approve user");
    }
  };

  const handleReject = async (userId) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_NODE_URL}/api/users/${userId}/reject`,
        {},
        { withCredentials: true }
      );
      setUsers(users.map((u) => (u._id === userId ? res.data.user : u)));
      toast.success("User rejected");
    } catch (error) {
      toast.error("Failed to reject user");
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

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      status: "approved",
      role: "user",
      discount: 15,
      notes: "",
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone || "",
      status: user.status,
      role: user.role,
      discount: user.discount,
      notes: user.notes || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      status: "approved",
      role: "user",
      discount: 15,
      notes: "",
    });
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: users.length,
    pending: users.filter((u) => u.status === "pending").length,
    approved: users.filter((u) => u.status === "approved").length,
    rejected: users.filter((u) => u.status === "rejected").length,
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
                  Manage registered users and approvals
                </p>
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-gold-accent text-white px-5 py-2.5 rounded-lg hover:brightness-105 transition-all font-medium"
              >
                <Plus size={18} />
                Add User
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-100 rounded-lg">
                    <Users size={20} className="text-slate-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-charcoal-black">
                      {stats.total}
                    </p>
                    <p className="text-xs text-slate-gray">Total Users</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-yellow-100 rounded-lg">
                    <Clock size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-charcoal-black">
                      {stats.pending}
                    </p>
                    <p className="text-xs text-slate-gray">Pending Approval</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 rounded-lg">
                    <CheckCircle size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-charcoal-black">
                      {stats.approved}
                    </p>
                    <p className="text-xs text-slate-gray">Approved</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-100 rounded-lg">
                    <XCircle size={20} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-charcoal-black">
                      {stats.rejected}
                    </p>
                    <p className="text-xs text-slate-gray">Rejected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Filter */}
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
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold-accent bg-white min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gold-accent mx-auto"></div>
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
                          Status
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
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                user.status
                              )}`}
                            >
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </span>
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
                              {user.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleApprove(user._id)}
                                    className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                    title="Approve"
                                  >
                                    <UserCheck size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleReject(user._id)}
                                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                    title="Reject"
                                  >
                                    <UserX size={16} />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => openEditModal(user)}
                                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-playfair text-xl font-bold text-charcoal-black">
                  {editingUser ? "Edit User" : "Add New User"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-black mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-black mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-black mb-1">
                      Password {editingUser ? "(leave blank to keep)" : "*"}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required={!editingUser}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-black mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-black mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold-accent"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-black mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold-accent"
                    >
                      <option value="user">User</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-black mb-1">
                      Discount %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal-black mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-gold-accent resize-none"
                    placeholder="Internal notes about this user..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-gray hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gold-accent text-white hover:brightness-105 transition-all font-medium"
                  >
                    {editingUser ? "Update User" : "Create User"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsersPage;

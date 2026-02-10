import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Image as ImageIcon,
  Package as PackageIcon,
} from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminServicePage = () => {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [expandedPackages, setExpandedPackages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [currentService, setCurrentService] = useState(null);
  const [selectedPackageForService, setSelectedPackageForService] =
    useState(null);

  // Package form state
  const [packageForm, setPackageForm] = useState({
    title: "",
    description: "",
    startingPrice: "",
    order: "",
    isMostBooked: false,
  });

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    title: "",
    category: "Weddings",
    shortDescription: "",
    description: "",
    price: "",
    duration: "",
    deliverables: "",
    location: "",
    packageId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [packageImageFile, setPackageImageFile] = useState(null);
  const [packageImagePreview, setPackageImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = ["Weddings", "Portraits", "Events", "Commercial"];

  const fetchPackages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/services/packages`,
        { withCredentials: true }
      );
      setPackages(res.data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages");
    }
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/services/services`
      );
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchPackages();
  }, []);

  // Package modal handlers
  const openAddPackageModal = () => {
    setCurrentPackage(null);
    setPackageForm({
      title: "",
      description: "",
      startingPrice: "",
      order: "",
      isMostBooked: false,
    });
    setPackageImageFile(null);
    setPackageImagePreview(null);
    setShowPackageModal(true);
  };

  const openEditPackageModal = (pkg) => {
    setCurrentPackage(pkg);
    setPackageForm({
      title: pkg.title || "",
      description: pkg.description || "",
      startingPrice: pkg.startingPrice?.toString() || "",
      order: pkg.order?.toString() || "",
      isMostBooked: pkg.isMostBooked || false,
    });
    setPackageImageFile(null);
    setPackageImagePreview(pkg.image || null);
    setShowPackageModal(true);
  };

  const closePackageModal = () => {
    setShowPackageModal(false);
    setCurrentPackage(null);
    setPackageForm({
      title: "",
      description: "",
      startingPrice: "",
      order: "",
      isMostBooked: false,
    });
    setPackageImageFile(null);
    setPackageImagePreview(null);
  };

  const handlePackageInputChange = (e) => {
    const { name, value } = e.target;
    setPackageForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePackageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPackageImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPackageImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPackage = async (e) => {
    e.preventDefault();
    if (!packageForm.title.trim()) {
      toast.error("Package title is required");
      return;
    }
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("title", packageForm.title);
      formData.append("description", packageForm.description);

      if (packageForm.startingPrice) {
        formData.append("startingPrice", packageForm.startingPrice);
      }
      if (packageForm.order) {
        formData.append("order", packageForm.order);
      }
      formData.append("isMostBooked", packageForm.isMostBooked);

      if (packageImageFile) {
        formData.append("image", packageImageFile);
      }

      if (currentPackage) {
        await axios.put(
          `${import.meta.env.VITE_NODE_URL}/api/services/packages/${
            currentPackage._id
          }`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        toast.success("Package updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/services/packages`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        toast.success("Package created successfully");
      }

      closePackageModal();
      await fetchPackages();
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Failed to save package");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePackage = async (id) => {
    if (
      !window.confirm(
        "Delete this package? Services will remain but be unassigned."
      )
    ) {
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_NODE_URL}/api/services/packages/${id}`,
        { withCredentials: true }
      );
      toast.success("Package deleted successfully");
      await fetchPackages();
      await fetchServices();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    }
  };

  // Service modal handlers
  const openAddServiceModal = (packageId = null) => {
    setCurrentService(null);
    setSelectedPackageForService(packageId);
    setServiceForm({
      title: "",
      category: "Weddings",
      shortDescription: "",
      description: "",
      price: "",
      duration: "",
      deliverables: "",
      location: "",
      packageId: packageId || "",
    });
    setImageFile(null);
    setImagePreview(null);
    setLogoFile(null);
    setLogoPreview(null);
    setShowServiceModal(true);
  };

  const openEditServiceModal = (service) => {
    setCurrentService(service);
    setSelectedPackageForService(service.package);
    setServiceForm({
      title: service.title,
      category: service.category,
      shortDescription: service.shortDescription || "",
      description: service.description,
      price: service.price,
      duration: service.details?.duration || "",
      deliverables: service.details?.deliverables || "",
      location: service.details?.location || "",
      packageId: service.package || "",
    });
    setImagePreview(
      service.images && service.images.length > 0 ? service.images[0] : null
    );
    setImageFile(null);
    setLogoPreview(service.logo || null);
    setLogoFile(null);
    setShowServiceModal(true);
  };

  const closeServiceModal = () => {
    setShowServiceModal(false);
    setCurrentService(null);
    setSelectedPackageForService(null);
    setServiceForm({
      title: "",
      category: "Weddings",
      shortDescription: "",
      description: "",
      price: "",
      duration: "",
      deliverables: "",
      location: "",
      packageId: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const data = new FormData();
      data.append("title", serviceForm.title);
      data.append("category", serviceForm.category);
      data.append("shortDescription", serviceForm.shortDescription);
      data.append("description", serviceForm.description);
      data.append("price", serviceForm.price);

      const details = {
        duration: serviceForm.duration,
        deliverables: serviceForm.deliverables,
        location: serviceForm.location,
      };
      data.append("details", JSON.stringify(details));

      if (serviceForm.packageId) {
        data.append("packageId", serviceForm.packageId);
      } else {
        data.append("packageId", "");
      }

      if (imageFile) {
        data.append("images", imageFile);
      }

      if (logoFile) {
        data.append("logo", logoFile);
      }

      if (currentService) {
        await axios.put(
          `${import.meta.env.VITE_NODE_URL}/api/services/update-service/${
            currentService._id
          }`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        toast.success("Service updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/services/add-service`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        toast.success("Service created successfully");
      }

      closeServiceModal();
      await fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_NODE_URL}/api/services/delete-service/${id}`,
          {
            withCredentials: true,
          }
        );
        toast.success("Service deleted successfully");
        await fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error("Failed to delete service");
      }
    }
  };

  const togglePackageExpand = (packageId) => {
    setExpandedPackages((prev) => ({
      ...prev,
      [packageId]: !prev[packageId],
    }));
  };

  const getServicesForPackage = (packageId) => {
    return services.filter((s) => s.package === packageId);
  };

  const getUnassignedServices = () => {
    return services.filter((s) => !s.package);
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
      <Sidebar />

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="font-playfair text-3xl font-bold text-[#0F0F0F] mb-2">
                  Packages & Services
                </h1>
                <p className="text-gray-500">
                  Manage packages and their associated services
                </p>
              </div>
              <button
                onClick={openAddPackageModal}
                className="bg-[#C9A24D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b08d42] transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus size={20} />
                Add Service
              </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-2">
              <Search className="text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-700 placeholder:text-gray-400"
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Packages with Services */}
                {filteredPackages.map((pkg) => {
                  const pkgServices = getServicesForPackage(pkg._id);
                  const isExpanded = expandedPackages[pkg._id];

                  return (
                    <motion.div
                      key={pkg._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      {/* Package Header */}
                      <div className="p-6 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center gap-4 flex-1">
                          {pkg.image ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-[#C9A24D]/20">
                              <img
                                src={pkg.image}
                                alt={pkg.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-[#C9A24D]/10 rounded-lg flex items-center justify-center">
                              <PackageIcon
                                className="text-[#C9A24D]"
                                size={24}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-playfair text-xl font-bold text-[#0F0F0F]">
                                {pkg.title}
                              </h3>
                              {pkg.isMostBooked && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full border border-amber-200">
                                  🔥 Most Booked
                                </span>
                              )}
                            </div>
                            {pkg.description && (
                              <p className="text-gray-500 text-sm mt-1">
                                {pkg.description}
                              </p>
                            )}
                            {pkg.startingPrice && (
                              <p className="text-[#C9A24D] font-medium text-sm mt-1">
                                Starting from ₹{pkg.startingPrice}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openAddServiceModal(pkg._id)}
                            className="px-4 py-2 bg-[#C9A24D]/10 text-[#C9A24D] rounded-lg hover:bg-[#C9A24D]/20 transition-colors flex items-center gap-2 text-sm font-medium"
                          >
                            <Plus size={16} />
                            Add Package
                          </button>
                          <button
                            onClick={() => openEditPackageModal(pkg)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePackage(pkg._id)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => togglePackageExpand(pkg._id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Services under package */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 bg-gray-50">
                              {pkgServices.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                  <p>No services in this package yet</p>
                                  <button
                                    onClick={() => openAddServiceModal(pkg._id)}
                                    className="mt-3 text-[#C9A24D] hover:underline text-sm font-medium"
                                  >
                                    Add your first service
                                  </button>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {pkgServices.map((service) => (
                                    <div
                                      key={service._id}
                                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                                    >
                                      <div className="h-40 overflow-hidden relative">
                                        {service.images &&
                                          service.images.length > 0 && (
                                            <img
                                              src={service.images[0]}
                                              alt={service.title}
                                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                          )}
                                        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-charcoal-black rounded backdrop-blur-sm">
                                          {service.category}
                                        </div>
                                      </div>
                                      <div className="p-4">
                                        <h4 className="font-playfair text-base font-bold text-[#0F0F0F] mb-1 line-clamp-1">
                                          {service.title}
                                        </h4>
                                        <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                                          {service.shortDescription ||
                                            service.description}
                                        </p>
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                          <button
                                            onClick={() =>
                                              openEditServiceModal(service)
                                            }
                                            className="flex items-center gap-1 text-gray-600 hover:text-[#C9A24D] transition-colors text-xs font-medium"
                                          >
                                            <Edit2 size={14} />
                                            Edit
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleDeleteService(service._id)
                                            }
                                            className="flex items-center gap-1 text-red-400 hover:text-red-600 transition-colors text-xs font-medium"
                                          >
                                            <Trash2 size={14} />
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Unassigned Services */}
                {getUnassignedServices().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <PackageIcon className="text-gray-400" size={24} />
                        </div>
                        <div>
                          <h3 className="font-playfair text-xl font-bold text-[#0F0F0F]">
                            Unassigned Services
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            Services not linked to any package
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getUnassignedServices().map((service) => (
                          <div
                            key={service._id}
                            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                          >
                            <div className="h-40 overflow-hidden relative">
                              {service.images && service.images.length > 0 && (
                                <img
                                  src={service.images[0]}
                                  alt={service.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              )}
                              <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-charcoal-black rounded backdrop-blur-sm">
                                {service.category}
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-playfair text-base font-bold text-[#0F0F0F] mb-1 line-clamp-1">
                                {service.title}
                              </h4>
                              <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                                {service.shortDescription ||
                                  service.description}
                              </p>
                              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => openEditServiceModal(service)}
                                  className="flex items-center gap-1 text-gray-600 hover:text-[#C9A24D] transition-colors text-xs font-medium"
                                >
                                  <Edit2 size={14} />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteService(service._id)
                                  }
                                  className="flex items-center gap-1 text-red-400 hover:text-red-600 transition-colors text-xs font-medium"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {filteredPackages.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                    <PackageIcon
                      className="mx-auto text-gray-300 mb-4"
                      size={48}
                    />
                    <p className="text-gray-400 mb-4">No packages found</p>
                    <button
                      onClick={openAddPackageModal}
                      className="text-[#C9A24D] hover:underline font-medium"
                    >
                      Create your first package
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Package Modal */}
      <AnimatePresence>
        {showPackageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closePackageModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
                <h2 className="font-playfair text-2xl font-bold text-[#0F0F0F]">
                  {currentPackage ? "Edit Package" : "Add New Package"}
                </h2>
                <button
                  onClick={closePackageModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitPackage} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={packageForm.title}
                    onChange={handlePackageInputChange}
                    required
                    placeholder="e.g. Royal Wedding Bundle"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={packageForm.description}
                    onChange={handlePackageInputChange}
                    rows={4}
                    placeholder="Brief description of this package..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Starting Price (₹)
                    </label>
                    <input
                      type="number"
                      name="startingPrice"
                      value={packageForm.startingPrice}
                      onChange={handlePackageInputChange}
                      min="0"
                      placeholder="e.g. 50000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={packageForm.order}
                      onChange={handlePackageInputChange}
                      placeholder="e.g. 1, 2, 3..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Package Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Image
                  </label>
                  <div className="flex gap-6 items-start">
                    {packageImagePreview && (
                      <img
                        src={packageImagePreview}
                        alt="Package Preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A24D] transition-colors relative">
                      <input
                        type="file"
                        onChange={handlePackageFileChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <ImageIcon className="text-gray-400 mb-2" size={24} />
                      <span className="text-sm text-gray-600">
                        {packageImageFile ? "Change Image" : "Upload Image"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Most Booked Toggle */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Most Booked Package
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Mark this package as most booked to highlight it on the
                      services page
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPackageForm((prev) => ({
                        ...prev,
                        isMostBooked: !prev.isMostBooked,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      packageForm.isMostBooked ? "bg-[#C9A24D]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        packageForm.isMostBooked
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closePackageModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#C9A24D] text-white rounded-lg hover:bg-[#b08d42] font-medium transition-colors disabled:opacity-50"
                  >
                    {isSaving
                      ? "Saving..."
                      : currentPackage
                      ? "Update Package"
                      : "Create Package"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Modal */}
      <AnimatePresence>
        {showServiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeServiceModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
                <h2 className="font-playfair text-2xl font-bold text-[#0F0F0F]">
                  {currentService ? "Edit Service" : "Add New Service"}
                </h2>
                <button
                  onClick={closeServiceModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitService} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={serviceForm.title}
                      onChange={handleServiceInputChange}
                      required
                      placeholder="e.g. Premium Wedding Photography"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={serviceForm.category}
                      onChange={handleServiceInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package
                  </label>
                  <select
                    name="packageId"
                    value={serviceForm.packageId}
                    onChange={handleServiceInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                  >
                    <option value="">No Package (Standalone Service)</option>
                    {packages.map((pkg) => (
                      <option key={pkg._id} value={pkg._id}>
                        {pkg.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={serviceForm.shortDescription}
                    onChange={handleServiceInputChange}
                    maxLength={100}
                    placeholder="Brief summary for card view..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description *
                  </label>
                  <textarea
                    name="description"
                    value={serviceForm.description}
                    onChange={handleServiceInputChange}
                    required
                    rows={6}
                    placeholder="Detailed description of the service..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={serviceForm.price}
                      onChange={handleServiceInputChange}
                      required
                      placeholder="e.g. ₹45,000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={serviceForm.duration}
                      onChange={handleServiceInputChange}
                      placeholder="e.g. Full Day Coverage"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deliverables
                    </label>
                    <input
                      type="text"
                      name="deliverables"
                      value={serviceForm.deliverables}
                      onChange={handleServiceInputChange}
                      placeholder="e.g. 300+ Edited Photos"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={serviceForm.location}
                      onChange={handleServiceInputChange}
                      placeholder="e.g. Studio or On-site"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cover Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image
                    </label>
                    <div className="flex gap-4 items-start">
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                      <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A24D] transition-colors relative">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <ImageIcon className="text-gray-400 mb-2" size={20} />
                        <span className="text-xs text-gray-600 text-center">
                          {imageFile ? "Change Cover" : "Upload Cover"}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Service Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Logo / Icon
                    </label>
                    <div className="flex gap-4 items-start">
                      {logoPreview && (
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-24 h-24 object-contain rounded-lg border border-gray-200 bg-gray-50 p-2"
                        />
                      )}
                      <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A24D] transition-colors relative">
                        <input
                          type="file"
                          onChange={handleLogoFileChange}
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <ImageIcon className="text-gray-400 mb-2" size={20} />
                        <span className="text-xs text-gray-600 text-center">
                          {logoFile ? "Change Logo" : "Upload Logo"}
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Small icon shown alongside service title
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeServiceModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#C9A24D] text-white rounded-lg hover:bg-[#b08d42] font-medium transition-colors disabled:opacity-50"
                  >
                    {isSaving
                      ? "Saving..."
                      : currentService
                      ? "Update Service"
                      : "Create Service"}
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

export default AdminServicePage;

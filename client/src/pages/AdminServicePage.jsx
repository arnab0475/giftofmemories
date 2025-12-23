import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";

const AdminServicePage = () => {
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Weddings",
    shortDescription: "",
    description: "",
    price: "",
    duration: "",
    deliverables: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = ["Weddings", "Portraits", "Events", "Commercial"];

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:4000/api/services/services"
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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Weddings",
      shortDescription: "",
      description: "",
      price: "",
      duration: "",
      deliverables: "",
      location: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setCurrentService(null);
    setIsEditing(false);
  };

  const handleAddService = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleEditService = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      category: service.category,
      shortDescription: service.shortDescription || "",
      description: service.description,
      price: service.price,
      duration: service.details?.duration || "",
      deliverables: service.details?.deliverables || "",
      location: service.details?.location || "",
    });
    setImagePreview(
      service.images && service.images.length > 0 ? service.images[0] : null
    );
    setIsEditing(true);
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(
          `http://localhost:4000/api/services/delete-service/${id}`,
          {
            withCredentials: true,
          }
        );
        toast.success("Service deleted successfully");
        setServices((prev) => prev.filter((s) => s._id !== id));
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error("Failed to delete service");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("shortDescription", formData.shortDescription);
      data.append("description", formData.description);
      data.append("price", formData.price);

      const details = {
        duration: formData.duration,
        deliverables: formData.deliverables,
        location: formData.location,
      };
      data.append("details", JSON.stringify(details));

      if (imageFile) {
        data.append("images", imageFile);
      }

      if (currentService) {
        await axios.put(
          `http://localhost:4000/api/services/update-service/${currentService._id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        toast.success("Service updated successfully");
      } else {
        await axios.post(
          "http://localhost:4000/api/services/add-service",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        toast.success("Service created successfully");
      }

      resetForm();
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
      <Sidebar />

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 p-8 overflow-y-auto">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={resetForm}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Services
              </button>

              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="font-playfair text-2xl font-bold text-[#0F0F0F] mb-6 border-b pb-4">
                  {currentService ? "Edit Service" : "Add New Service"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Service Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none transition-shadow"
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
                      Short Description (Card View)
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      maxLength={100}
                      placeholder="Brief summary..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description (Detail Page)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                    ></textarea>
                  </div>

                  {/* Pricing & Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="e.g. ₹45,000"
                        required
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
                        value={formData.duration}
                        onChange={handleInputChange}
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
                        value={formData.deliverables}
                        onChange={handleInputChange}
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
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Studio or On-site"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image
                    </label>
                    <div className="flex gap-6 items-start">
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                      <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A24D] transition-colors relative">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <ImageIcon className="text-gray-400 mb-2" size={24} />
                        <span className="text-sm text-gray-600">
                          {imageFile ? "Change Image" : "Upload Image"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={resetForm}
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
              </div>
            </motion.div>
          ) : (
            <div className="max-w-[1600px] mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="font-playfair text-3xl font-bold text-[#0F0F0F] mb-2">
                    Services Management
                  </h1>
                  <p className="text-gray-500">
                    Manage your service offerings and packages.
                  </p>
                </div>
                <button
                  onClick={handleAddService}
                  className="bg-[#C9A24D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b08d42] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Plus size={20} />
                  Add New Service
                </button>
              </div>

              {/* Search */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-700 placeholder:text-gray-400"
                />
              </div>

              {isLoading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A24D]"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <div
                      key={service._id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                    >
                      <div className="h-48 overflow-hidden relative">
                        {service.images && service.images.length > 0 && (
                          <img
                            src={service.images[0]}
                            alt={service.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-charcoal-black rounded-sm backdrop-blur-sm">
                          {service.category}
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-playfair text-xl font-bold text-[#0F0F0F] line-clamp-1">
                            {service.title}
                          </h3>
                        </div>

                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
                          {service.shortDescription || service.description}
                        </p>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-2">
                          <button
                            onClick={() => handleEditService(service)}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#C9A24D] transition-colors text-sm font-medium"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors text-sm font-medium"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredServices.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                      No services found.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminServicePage;

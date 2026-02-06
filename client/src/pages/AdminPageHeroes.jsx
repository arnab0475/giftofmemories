import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Image,
  Save,
  RefreshCw,
  Upload,
  X,
  Briefcase,
  ShoppingBag,
  BookOpen,
  Phone,
  RotateCcw,
  Users,
} from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminPageHeroes = () => {
  const [heroes, setHeroes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    breadcrumb: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const pageConfig = {
    services: {
      label: "Services Page",
      icon: Briefcase,
      color: "bg-blue-500",
    },
    shop: {
      label: "Shop Page",
      icon: ShoppingBag,
      color: "bg-amber-500",
    },
    blog: {
      label: "Blog Page",
      icon: BookOpen,
      color: "bg-green-500",
    },
    contact: {
      label: "Contact Page",
      icon: Phone,
      color: "bg-purple-500",
    },
    about: {
      label: "About Page",
      icon: Users,
      color: "bg-teal-500",
    },
  };

  const fetchHeroes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/page-hero/admin/get-all`,
        { withCredentials: true },
      );
      setHeroes(response.data);
    } catch (error) {
      console.error("Error fetching page heroes:", error);
      toast.error("Failed to fetch page heroes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const handleSelectPage = (page) => {
    const hero = heroes.find((h) => h.page === page);
    setSelectedPage(page);
    setFormData({
      title: hero?.title || "",
      subtitle: hero?.subtitle || "",
      description: hero?.description || "",
      breadcrumb: hero?.breadcrumb || "",
    });
    setImagePreview(hero?.backgroundImage || null);
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    try {
      setIsSaving(true);
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("breadcrumb", formData.breadcrumb);
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      await axios.put(
        `${import.meta.env.VITE_NODE_URL}/api/page-hero/admin/update/${selectedPage}`,
        formDataToSend,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      toast.success("Page hero updated successfully!");
      fetchHeroes();
    } catch (error) {
      console.error("Error saving page hero:", error);
      toast.error("Failed to save page hero");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!selectedPage) return;

    if (
      !window.confirm("Are you sure you want to reset this hero to default?")
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_NODE_URL}/api/page-hero/admin/reset/${selectedPage}`,
        { withCredentials: true },
      );

      toast.success("Page hero reset to default!");
      setFormData({
        title: response.data.hero.title,
        subtitle: response.data.hero.subtitle,
        description: response.data.hero.description,
        breadcrumb: response.data.hero.breadcrumb,
      });
      setImagePreview(null);
      setImageFile(null);
      fetchHeroes();
    } catch (error) {
      console.error("Error resetting page hero:", error);
      toast.error("Failed to reset page hero");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar title="Page Hero Management" />

        <main className="flex-1 p-6 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader color="#C9A24D" />
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold-accent/10 rounded-xl flex items-center justify-center">
                    <Image className="w-6 h-6 text-gold-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Page Hero Sections
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Customize hero sections for Services, Shop, Blog, and
                      Contact pages
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Page Selector */}
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="font-semibold text-gray-700 mb-4">
                    Select Page
                  </h3>
                  {Object.entries(pageConfig).map(([page, config]) => {
                    const Icon = config.icon;
                    const hero = heroes.find((h) => h.page === page);
                    const isSelected = selectedPage === page;

                    return (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectPage(page)}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-gold-accent bg-gold-accent/5"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="font-medium text-gray-800">
                              {config.label}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {hero?.isDefault ? "Using default" : "Customized"}
                            </p>
                          </div>
                          {!hero?.isDefault && (
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Editor */}
                <div className="lg:col-span-2">
                  {selectedPage ? (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-gray-800">
                          Edit {pageConfig[selectedPage].label} Hero
                        </h3>
                        <button
                          onClick={handleReset}
                          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reset to Default
                        </button>
                      </div>

                      {/* Image Upload */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Image
                        </label>
                        {imagePreview ? (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={handleRemoveImage}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gold-accent transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              Click to upload image
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Form Fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                title: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                            placeholder="Enter hero title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={formData.subtitle}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subtitle: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                            placeholder="Enter subtitle"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                            placeholder="Enter description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Breadcrumb Text
                          </label>
                          <input
                            type="text"
                            value={formData.breadcrumb}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                breadcrumb: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                            placeholder="e.g., Gift of memories • Services"
                          />
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                        <p className="text-xs text-gray-400 mb-2">Preview</p>
                        <div
                          className="relative h-32 rounded-lg overflow-hidden bg-cover bg-center"
                          style={{
                            backgroundImage: imagePreview
                              ? `url(${imagePreview})`
                              : "linear-gradient(to right, #1a1a1a, #2d2d2d)",
                          }}
                        >
                          <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center p-4">
                            <p className="text-gold-accent text-xs mb-1">
                              {formData.breadcrumb}
                            </p>
                            <h4 className="text-white font-playfair text-lg font-bold">
                              {formData.title}
                            </h4>
                            <p className="text-gray-300 text-xs mt-1 line-clamp-2">
                              {formData.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-6 py-3 bg-gold-accent text-white rounded-lg hover:bg-gold-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                          {isSaving ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                      <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600">
                        Select a page to edit
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Choose a page from the left to customize its hero
                        section
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPageHeroes;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Eye,
  EyeOff,
  ShoppingBag,
  Briefcase,
  Image,
  MessageSquare,
  Save,
  RefreshCw,
} from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminHomepageSettings = () => {
  const [settings, setSettings] = useState({
    showProducts: true,
    showServices: true,
    showGallery: true,
    showTestimonials: true,
    showScrollGallery: true,
    showStackedGallery: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/homepage-settings/get-settings`,
      );
      setSettings(response.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch homepage settings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = async (section) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_NODE_URL}/api/homepage-settings/toggle/${section}`,
        {},
        { withCredentials: true },
      );
      setSettings(response.data.settings);
      toast.success(`${section.replace("show", "")} visibility updated!`);
    } catch (error) {
      console.error("Error toggling section:", error);
      toast.error("Failed to update visibility");
    }
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      const response = await axios.put(
        `${import.meta.env.VITE_NODE_URL}/api/homepage-settings/update-settings`,
        settings,
        { withCredentials: true },
      );
      setSettings(response.data.settings);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    {
      key: "showProducts",
      label: "Products Section",
      description: "Display featured products on the homepage",
      icon: ShoppingBag,
      color: "bg-amber-500",
    },
    {
      key: "showServices",
      label: "Services Section",
      description: "Display service categories on the homepage",
      icon: Briefcase,
      color: "bg-blue-500",
    },
    {
      key: "showGallery",
      label: "Gallery Section",
      description: "Display parallax gallery on the homepage",
      icon: Image,
      color: "bg-green-500",
    },
    {
      key: "showTestimonials",
      label: "Testimonials Section",
      description: "Display customer testimonials on the homepage",
      icon: MessageSquare,
      color: "bg-purple-500",
    },
    {
      key: "showScrollGallery",
      label: "Scroll Gallery Section",
      description: "Display the horizontal scroll gallery on the homepage",
      icon: Image,
      color: "bg-teal-500",
    },
    {
      key: "showStackedGallery",
      label: "Stacked Gallery Section",
      description: "Display the scroll-driven stacked gallery on the homepage",
      icon: Image,
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="Homepage Settings" />

        <main className="flex-1 p-6 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader color="#C9A24D" />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gold-accent/10 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-gold-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Homepage Section Visibility
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Control which sections are displayed on the homepage
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Toggles */}
              <div className="space-y-4">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isVisible = settings[section.key];

                  return (
                    <motion.div
                      key={section.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 ${section.color} rounded-xl flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {section.label}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {section.description}
                            </p>
                          </div>
                        </div>

                        {/* Toggle Button */}
                        <button
                          onClick={() => handleToggle(section.key)}
                          className={`relative inline-flex h-12 w-24 items-center justify-center rounded-lg transition-all duration-300 ${
                            isVisible
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        >
                          <span className="flex items-center gap-2 text-white font-medium text-sm">
                            {isVisible ? (
                              <>
                                <Eye className="w-4 h-4" />
                                Show
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-4 h-4" />
                                Hide
                              </>
                            )}
                          </span>
                        </button>
                      </div>

                      {/* Status Indicator */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isVisible ? "bg-green-500" : "bg-gray-400"
                            }`}
                          />
                          <span className="text-sm text-gray-500">
                            {isVisible
                              ? "Currently visible on homepage"
                              : "Currently hidden from homepage"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={fetchSettings}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="px-6 py-3 bg-gold-accent text-white rounded-lg hover:bg-gold-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save All Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminHomepageSettings;

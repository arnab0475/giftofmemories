import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Video,
  Youtube,
  Upload,
  X,
  Trash2,
  Play,
  Plus,
  GripVertical,
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
    showHomeVideo: true,
    homeVideos: [],
    productsSectionTitle: "Premium Products",
    productsSectionDescription:
      "Transform your cherished moments into timeless keepsakes. Discover our handcrafted albums, gallery-quality prints, and bespoke merchandise designed to last generations.",
    productsSectionBadge: "Featured Collection",
    servicesSectionTitle: "Our Services",
    servicesSectionDescription:
      "From intimate weddings to stunning fashion editorials, our team brings creativity and technical excellence to every project, capturing life's most precious moments.",
    servicesSectionBadge: "What We Do",
    faqs: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoModalType, setVideoModalType] = useState("youtube");
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState(null);

  // Video form states
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a video file");
        return;
      }
      setUploadFile(file);
      const url = URL.createObjectURL(file);
      setUploadPreview(url);
    }
  };

  const handleYoutubeSubmit = async (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    try {
      setIsUploadingVideo(true);
      const response = await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/homepage-settings/video/youtube`,
        {
          youtubeUrl,
          title: videoTitle,
          description: videoDescription,
        },
        { withCredentials: true },
      );
      setSettings(response.data.settings);
      toast.success("YouTube video added successfully!");
      resetVideoModal();
    } catch (error) {
      console.error("Error adding YouTube video:", error);
      toast.error(
        error.response?.data?.message || "Failed to add YouTube video",
      );
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Please select a video file");
      return;
    }

    try {
      setIsUploadingVideo(true);
      const formData = new FormData();
      formData.append("video", uploadFile);
      formData.append("title", videoTitle);
      formData.append("description", videoDescription);

      const response = await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/homepage-settings/video/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );
      setSettings(response.data.settings);
      toast.success("Video uploaded successfully!");
      resetVideoModal();
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error(error.response?.data?.message || "Failed to upload video");
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      setDeletingVideoId(videoId);
      const response = await axios.delete(
        `${import.meta.env.VITE_NODE_URL}/api/homepage-settings/video/${videoId}`,
        { withCredentials: true },
      );
      setSettings(response.data.settings);
      toast.success("Video deleted successfully!");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    } finally {
      setDeletingVideoId(null);
    }
  };

  const resetVideoModal = () => {
    setShowVideoModal(false);
    setYoutubeUrl("");
    setVideoTitle("");
    setVideoDescription("");
    setUploadFile(null);
    setUploadPreview(null);
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
      key: "showHomeVideo",
      label: "Home Video Section",
      description: "Display featured video after services section",
      icon: Video,
      color: "bg-red-500",
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

              {/* Home Video Management Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Homepage Videos
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Manage featured videos displayed on homepage (
                        {settings.homeVideos?.length || 0} videos)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setVideoModalType("youtube");
                        setShowVideoModal(true);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Youtube size={16} />
                      Add YouTube
                    </button>
                    <button
                      onClick={() => {
                        setVideoModalType("upload");
                        setShowVideoModal(true);
                      }}
                      className="px-4 py-2 bg-gold-accent text-white rounded-lg hover:bg-gold-accent/90 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Upload size={16} />
                      Upload Video
                    </button>
                  </div>
                </div>

                {/* Videos Grid */}
                {settings.homeVideos?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {settings.homeVideos.map((video, index) => (
                      <div
                        key={video._id}
                        className="border border-gray-200 rounded-lg overflow-hidden group"
                      >
                        <div className="relative aspect-video bg-gray-100">
                          {video.type === "youtube" ? (
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title || "Video thumbnail"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={video.url}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                              <Play
                                size={20}
                                className="text-charcoal-black ml-1"
                              />
                            </div>
                          </div>
                          <div className="absolute top-2 left-2 flex gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                video.type === "youtube"
                                  ? "bg-red-600 text-white"
                                  : "bg-gold-accent text-white"
                              }`}
                            >
                              {video.type === "youtube" ? "YouTube" : "Video"}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-800 text-white">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 bg-white">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 text-sm truncate">
                                {video.title || "Untitled Video"}
                              </h4>
                              {video.description && (
                                <p className="text-gray-500 text-xs mt-0.5 truncate">
                                  {video.description}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteVideo(video._id)}
                              disabled={deletingVideoId === video._id}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {deletingVideoId === video._id ? (
                                <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add More Card */}
                    <button
                      onClick={() => {
                        setVideoModalType("youtube");
                        setShowVideoModal(true);
                      }}
                      className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center hover:border-gold-accent hover:bg-gold-accent/5 transition-colors"
                    >
                      <Plus size={32} className="text-gray-400 mb-2" />
                      <span className="text-gray-500 text-sm">
                        Add More Videos
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <Video size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No videos added yet</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Add YouTube videos or upload your own
                    </p>
                  </div>
                )}
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

              {/* Section Content Editor */}
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Products Section Content
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Customize the Products section title and description
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={settings.productsSectionBadge || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          productsSectionBadge: e.target.value,
                        })
                      }
                      placeholder="Featured Collection"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={settings.productsSectionTitle || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          productsSectionTitle: e.target.value,
                        })
                      }
                      placeholder="Premium Products"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      The last word will be highlighted in gold
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Description
                    </label>
                    <textarea
                      value={settings.productsSectionDescription || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          productsSectionDescription: e.target.value,
                        })
                      }
                      placeholder="Transform your cherished moments..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Services Section Content
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Customize the Services section title and description
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={settings.servicesSectionBadge || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          servicesSectionBadge: e.target.value,
                        })
                      }
                      placeholder="What We Do"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={settings.servicesSectionTitle || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          servicesSectionTitle: e.target.value,
                        })
                      }
                      placeholder="Our Services"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      The last word will be highlighted in gold
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Description
                    </label>
                    <textarea
                      value={settings.servicesSectionDescription || ""}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          servicesSectionDescription: e.target.value,
                        })
                      }
                      placeholder="From intimate weddings..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent resize-none"
                    />
                  </div>
                </div>
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
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {videoModalType === "youtube"
                        ? "Adding..."
                        : "Uploading..."}
                    </>
                  ) : (
                    <>
                      {videoModalType === "youtube" ? (
                        <Youtube size={18} />
                      ) : (
                        <Upload size={18} />
                      )}
                      {videoModalType === "youtube"
                        ? "Add YouTube Video"
                        : "Upload Video"}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => resetVideoModal()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-playfair text-xl font-bold text-gray-800">
                  {videoModalType === "youtube"
                    ? "Add YouTube Video"
                    : "Upload Video"}
                </h2>
                <button
                  onClick={() => resetVideoModal()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={
                  videoModalType === "youtube"
                    ? handleYoutubeSubmit
                    : handleVideoUpload
                }
                className="p-6 space-y-4"
              >
                {videoModalType === "youtube" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video File
                    </label>
                    {uploadPreview ? (
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <video
                          src={uploadPreview}
                          controls
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUploadFile(null);
                            setUploadPreview(null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gold-accent transition-colors">
                        <Upload size={32} className="text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm">
                          Click to upload video
                        </span>
                        <span className="text-gray-400 text-xs mt-1">
                          MP4, MOV, AVI (max 100MB)
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Our Story"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="A brief description..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploadingVideo}
                  className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                    videoModalType === "youtube"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gold-accent text-white hover:bg-gold-accent/90"
                  }`}
                >
                  {isUploadingVideo ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {videoModalType === "youtube"
                        ? "Adding..."
                        : "Uploading..."}
                    </>
                  ) : (
                    <>
                      {videoModalType === "youtube" ? (
                        <Youtube size={18} />
                      ) : (
                        <Upload size={18} />
                      )}
                      {videoModalType === "youtube"
                        ? "Add YouTube Video"
                        : "Upload Video"}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHomepageSettings;

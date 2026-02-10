import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Video,
  Youtube,
  Edit2,
  Eye,
  EyeOff,
  X,
  Upload,
  Play,
} from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminPageVideos = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [editingVideo, setEditingVideo] = useState(null);

  // Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadPageType, setUploadPageType] = useState("services");
  const [uploadPreview, setUploadPreview] = useState(null);

  // YouTube State
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeDescription, setYoutubeDescription] = useState("");
  const [youtubePageType, setYoutubePageType] = useState("services");

  const pageTypes = [
    {
      value: "services",
      label: "Services Page",
      description: "How to use our services",
    },
    { value: "shop", label: "Shop Page", description: "How to buy products" },
    {
      value: "booking",
      label: "Booking Page",
      description: "How to book services",
    },
    {
      value: "service-details",
      label: "Service Details",
      description: "Service tutorials",
    },
    {
      value: "product-details",
      label: "Product Details",
      description: "Product guides",
    },
  ];

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/page-videos/admin/all`,
        { withCredentials: true },
      );
      setVideos(response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to fetch videos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Please select a video file");
      return;
    }
    if (!uploadTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("video", uploadFile);
      formData.append("title", uploadTitle);
      formData.append("description", uploadDescription);
      formData.append("pageType", uploadPageType);

      await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/page-videos/add`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      toast.success("Video uploaded successfully");
      resetUploadModal();
      fetchVideos();
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error(error.response?.data?.message || "Failed to upload video");
    } finally {
      setIsUploading(false);
    }
  };

  const handleYoutubeUpload = async (e) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }
    if (!youtubeTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }

    try {
      setIsUploading(true);
      await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/page-videos/add-youtube`,
        {
          youtubeUrl,
          title: youtubeTitle,
          description: youtubeDescription,
          pageType: youtubePageType,
        },
        { withCredentials: true },
      );

      toast.success("YouTube video added successfully");
      resetYoutubeModal();
      fetchVideos();
    } catch (error) {
      console.error("Error adding YouTube video:", error);
      toast.error(
        error.response?.data?.message || "Failed to add YouTube video",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      setIsUploading(true);
      await axios.put(
        `${import.meta.env.VITE_NODE_URL}/api/page-videos/update/${editingVideo._id}`,
        {
          title: editingVideo.title,
          description: editingVideo.description,
          pageType: editingVideo.pageType,
        },
        { withCredentials: true },
      );

      toast.success("Video updated successfully");
      setShowEditModal(false);
      setEditingVideo(null);
      fetchVideos();
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Failed to update video");
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_NODE_URL}/api/page-videos/toggle-status/${id}`,
        {},
        { withCredentials: true },
      );
      toast.success("Video status updated");
      setVideos((prev) =>
        prev.map((v) => (v._id === id ? { ...v, isActive: !v.isActive } : v)),
      );
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_NODE_URL}/api/page-videos/delete/${id}`,
        { withCredentials: true },
      );
      toast.success("Video deleted successfully");
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  const resetUploadModal = () => {
    setShowUploadModal(false);
    setUploadFile(null);
    setUploadTitle("");
    setUploadDescription("");
    setUploadPageType("services");
    setUploadPreview(null);
  };

  const resetYoutubeModal = () => {
    setShowYoutubeModal(false);
    setYoutubeUrl("");
    setYoutubeTitle("");
    setYoutubeDescription("");
    setYoutubePageType("services");
  };

  const filteredVideos =
    activeFilter === "all"
      ? videos
      : videos.filter((v) => v.pageType === activeFilter);

  const getPageLabel = (type) => {
    const found = pageTypes.find((p) => p.value === type);
    return found ? found.label : type;
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
      <Sidebar />

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-playfair text-3xl font-bold text-[#0F0F0F] mb-2">
                  Page Videos Management
                </h1>
                <p className="text-gray-500">
                  Upload instructional videos for services, shop, and booking
                  pages.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowYoutubeModal(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Youtube size={20} />
                  Add YouTube Video
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-[#C9A24D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b08d42] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Plus size={20} />
                  Upload Video
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  activeFilter === "all"
                    ? "bg-[#C9A24D] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                All Pages
              </button>
              {pageTypes.map((page) => (
                <button
                  key={page.value}
                  onClick={() => setActiveFilter(page.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                    activeFilter === page.value
                      ? "bg-[#C9A24D] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>

            {/* Videos Grid */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <Video size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No videos found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Add videos to show instructional content on your pages
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <motion.div
                    key={video._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-xl overflow-hidden shadow-sm border transition-all ${
                      video.isActive
                        ? "border-gray-200"
                        : "border-red-200 opacity-60"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-100">
                      {video.videoType === "youtube" ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={video.videoUrl}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <Play size={20} className="text-[#0F0F0F] ml-1" />
                        </div>
                      </div>
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            video.videoType === "youtube"
                              ? "bg-red-600 text-white"
                              : "bg-[#C9A24D] text-white"
                          }`}
                        >
                          {video.videoType === "youtube"
                            ? "YouTube"
                            : "Uploaded"}
                        </span>
                      </div>
                      {/* Status Badge */}
                      {!video.isActive && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-600">
                            Inactive
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-[#0F0F0F] line-clamp-1">
                          {video.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 whitespace-nowrap">
                          {getPageLabel(video.pageType)}
                        </span>
                      </div>
                      {video.description && (
                        <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                          {video.description}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setEditingVideo(video);
                            setShowEditModal(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(video._id)}
                          className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                            video.isActive
                              ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                        >
                          {video.isActive ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(video._id)}
                          className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Upload Video Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => resetUploadModal()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-playfair text-xl font-bold text-[#0F0F0F]">
                  Upload Video
                </h2>
                <button
                  onClick={() => resetUploadModal()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-6 space-y-4">
                {/* Video Upload */}
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
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#C9A24D] transition-colors">
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

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="How to book a service"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="A step-by-step guide..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A24D] resize-none"
                  />
                </div>

                {/* Page Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display On
                  </label>
                  <select
                    value={uploadPageType}
                    onChange={(e) => setUploadPageType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  >
                    {pageTypes.map((page) => (
                      <option key={page.value} value={page.value}>
                        {page.label} - {page.description}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-[#C9A24D] text-white py-3 rounded-lg font-medium hover:bg-[#b08d42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload Video
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* YouTube Video Modal */}
      <AnimatePresence>
        {showYoutubeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => resetYoutubeModal()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-playfair text-xl font-bold text-[#0F0F0F]">
                  Add YouTube Video
                </h2>
                <button
                  onClick={() => resetYoutubeModal()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleYoutubeUpload} className="p-6 space-y-4">
                {/* YouTube URL */}
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

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={youtubeTitle}
                    onChange={(e) => setYoutubeTitle(e.target.value)}
                    placeholder="How to use our booking system"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={youtubeDescription}
                    onChange={(e) => setYoutubeDescription(e.target.value)}
                    placeholder="A helpful tutorial video..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  />
                </div>

                {/* Page Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display On
                  </label>
                  <select
                    value={youtubePageType}
                    onChange={(e) => setYoutubePageType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {pageTypes.map((page) => (
                      <option key={page.value} value={page.value}>
                        {page.label} - {page.description}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Youtube size={18} />
                      Add YouTube Video
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Video Modal */}
      <AnimatePresence>
        {showEditModal && editingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowEditModal(false);
              setEditingVideo(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-playfair text-xl font-bold text-[#0F0F0F]">
                  Edit Video
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingVideo(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEdit} className="p-6 space-y-4">
                {/* Preview */}
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {editingVideo.videoType === "youtube" ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${editingVideo.youtubeId}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={editingVideo.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingVideo.title}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingVideo.description || ""}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A24D] resize-none"
                  />
                </div>

                {/* Page Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display On
                  </label>
                  <select
                    value={editingVideo.pageType}
                    onChange={(e) =>
                      setEditingVideo({
                        ...editingVideo,
                        pageType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A24D]"
                  >
                    {pageTypes.map((page) => (
                      <option key={page.value} value={page.value}>
                        {page.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-[#C9A24D] text-white py-3 rounded-lg font-medium hover:bg-[#b08d42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
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

export default AdminPageVideos;

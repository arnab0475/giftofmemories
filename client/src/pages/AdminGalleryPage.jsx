import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Image, Video, Youtube, Link } from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminGalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);

  // Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState(
    "Pre-Wedding Photoshoot"
  );
  const [uploadPreview, setUploadPreview] = useState(null);

  // YouTube State
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeCategory, setYoutubeCategory] = useState(
    "Pre-Wedding Cinematic"
  );

  const categories = [
    "Pre-Wedding Cinematic",
    "Pre-Wedding Photoshoot",
    "Wedding Highlights",
    "Wedding Ceremony",
    "Haldi & Mehendi",
    "Sangeet Night",
    "Reception",
    "Engagement",
    "Couple Portraits",
    "Family Portraits",
    "Destination Wedding",
    "Traditional Rituals",
    "Behind The Scenes",
  ];

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/gallery/get-gallery`
      );
      setGalleryItems(response.data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error("Failed to fetch gallery items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Please select a file");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("tags", JSON.stringify([uploadCategory]));

      await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/gallery/add-gallery`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Gallery item uploaded successfully");
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadPreview(null);
      setUploadCategory("Weddings");
      fetchGallery();
    } catch (error) {
      console.error("Error uploading item:", error);
      toast.error("Failed to upload item");
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

    try {
      setIsUploading(true);
      await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/gallery/add-youtube`,
        {
          youtubeUrl: youtubeUrl,
          title: youtubeTitle,
          tags: JSON.stringify([youtubeCategory]),
        },
        {
          withCredentials: true,
        }
      );

      toast.success("YouTube video added successfully");
      setShowYoutubeModal(false);
      setYoutubeUrl("");
      setYoutubeTitle("");
      setYoutubeCategory("Weddings");
      fetchGallery();
    } catch (error) {
      console.error("Error adding YouTube video:", error);
      toast.error(
        error.response?.data?.message || "Failed to add YouTube video"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_NODE_URL}/api/gallery/delete-gallery/${id}`,
          {
            withCredentials: true,
          }
        );
        toast.success("Item deleted successfully");
        setGalleryItems((prev) => prev.filter((item) => item._id !== id));
      } catch (error) {
        console.error("Error deleting item:", error);
        toast.error("Failed to delete item");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
      <Sidebar />

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-playfair text-3xl font-bold text-[#0F0F0F] mb-2">
                  Gallery Management
                </h1>
                <p className="text-gray-500">
                  Manage photos and videos in your gallery.
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
                  Add Image
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleryItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      {item.type === "youtube" ? (
                        <img
                          src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                          alt={item.title || "YouTube video"}
                          className="w-full h-full object-cover"
                        />
                      ) : item.type === "video" ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt="Gallery item"
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 bg-white rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm">
                        {item.type === "youtube" ? (
                          <Youtube size={14} />
                        ) : item.type === "video" ? (
                          <Video size={14} />
                        ) : (
                          <Image size={14} />
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {item.type === "youtube" && item.title && (
                        <p className="text-sm font-medium text-gray-800 mb-2 line-clamp-1">
                          {item.title}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {item.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0F0F0F] font-playfair">
                Upload to Gallery
              </h2>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#C9A24D] transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {uploadPreview ? (
                    <img
                      src={uploadPreview}
                      alt="Preview"
                      className="max-h-40 mx-auto rounded"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <Image className="mb-2" size={32} />
                      <span className="text-sm">Click to upload image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                    setUploadPreview(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 px-4 py-2 bg-[#C9A24D] text-white rounded-lg hover:bg-[#b08d42] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* YouTube Modal */}
      {showYoutubeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
          >
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Youtube className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-[#0F0F0F] font-playfair">
                Add YouTube Video
              </h2>
            </div>

            <form onSubmit={handleYoutubeUpload} className="p-6 space-y-4">
              {/* YouTube URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Video URL *
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports youtube.com and youtu.be links
                </p>
              </div>

              {/* Video Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  value={youtubeTitle}
                  onChange={(e) => setYoutubeTitle(e.target.value)}
                  placeholder="e.g. Royal Wedding Highlights"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                />
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={youtubeCategory}
                  onChange={(e) => setYoutubeCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowYoutubeModal(false);
                    setYoutubeUrl("");
                    setYoutubeTitle("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Adding..." : "Add Video"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryPage;

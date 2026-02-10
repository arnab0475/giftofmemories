import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Upload,
  Trash2,
  Edit2,
  X,
  Plus,
  Grid3X3,
  Layers,
  LayoutList,
  Save,
  Images,
} from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminHomepageGallery = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("parallax");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState({
    section: "parallax",
    alt: "",
    category: "",
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkPreviews, setBulkPreviews] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const sectionConfig = {
    parallax: {
      label: "Parallax Gallery",
      icon: Layers,
      color: "bg-blue-500",
      description: "Horizontal scrolling rows with parallax effect",
    },
    scroll: {
      label: "Scroll Gallery",
      icon: LayoutList,
      color: "bg-green-500",
      description: "Side images in the combined sections area",
    },
    stacked: {
      label: "Stacked Gallery",
      icon: Grid3X3,
      color: "bg-purple-500",
      description: "Vertical stacked cards with scroll animation",
    },
  };

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/homepage-gallery/admin/get-all`,
        { withCredentials: true },
      );
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to fetch images");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const filteredImages = images.filter(
    (img) => img.section === selectedSection,
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleBulkImageChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_FILES = 20;
    const MAX_TOTAL_SIZE = 200 * 1024 * 1024; // 200MB

    // Check number of files
    if (files.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} images allowed per upload`);
      return;
    }

    // Check individual file sizes and total size
    let totalSize = 0;
    const oversizedFiles = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
      }
      totalSize += file.size;
    }

    if (oversizedFiles.length > 0) {
      toast.error(
        `${oversizedFiles.length} file(s) exceed 10MB limit: ${oversizedFiles.slice(0, 3).join(", ")}${oversizedFiles.length > 3 ? "..." : ""}`,
      );
      return;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error(
        `Total size (${(totalSize / 1024 / 1024).toFixed(1)}MB) exceeds 200MB limit`,
      );
      return;
    }

    setBulkFiles(files);
    setBulkPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const openAddModal = () => {
    setEditingImage(null);
    setFormData({
      section: selectedSection,
      alt: "",
      category: "",
      order: filteredImages.length,
    });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (image) => {
    setEditingImage(image);
    setFormData({
      section: image.section,
      alt: image.alt,
      category: image.category || "",
      order: image.order,
    });
    setImagePreview(image.imageUrl);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("section", formData.section);
      formDataToSend.append("alt", formData.alt);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("order", formData.order);
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (editingImage) {
        await axios.put(
          `${import.meta.env.VITE_NODE_URL}/api/homepage-gallery/admin/update/${editingImage._id}`,
          formDataToSend,
          { withCredentials: true },
        );
        toast.success("Image updated successfully");
      } else {
        if (!imageFile) {
          toast.error("Please select an image");
          setIsSaving(false);
          return;
        }
        await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/homepage-gallery/admin/add`,
          formDataToSend,
          { withCredentials: true },
        );
        toast.success("Image added successfully");
      }

      setIsModalOpen(false);
      fetchImages();
    } catch (error) {
      console.error("Error saving image:", error);
      toast.error("Failed to save image");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) {
      toast.error("Please select images to upload");
      return;
    }

    setIsSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("section", selectedSection);
      bulkFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/homepage-gallery/admin/bulk-upload`,
        formDataToSend,
        { withCredentials: true },
      );

      toast.success(`${bulkFiles.length} images uploaded successfully`);
      setIsBulkModalOpen(false);
      setBulkFiles([]);
      setBulkPreviews([]);
      fetchImages();
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_NODE_URL}/api/homepage-gallery/admin/delete/${id}`,
        { withCredentials: true },
      );
      toast.success("Image deleted successfully");
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const toggleImageStatus = async (image) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("isActive", !image.isActive);

      await axios.put(
        `${import.meta.env.VITE_NODE_URL}/api/homepage-gallery/admin/update/${image._id}`,
        formDataToSend,
        { withCredentials: true },
      );

      toast.success(
        `Image ${image.isActive ? "hidden" : "shown"} successfully`,
      );
      fetchImages();
    } catch (error) {
      console.error("Error toggling image:", error);
      toast.error("Failed to update image");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 ml-[260px] flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar title="Homepage Gallery" />

        <div className="p-6">
          {/* Section Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            {Object.entries(sectionConfig).map(([key, config]) => {
              const Icon = config.icon;
              const count = images.filter((img) => img.section === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedSection(key)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all ${
                    selectedSection === key
                      ? "bg-charcoal-black text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{config.label}</p>
                    <p
                      className={`text-xs ${
                        selectedSection === key
                          ? "text-gray-300"
                          : "text-gray-400"
                      }`}
                    >
                      {count} images
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Section Info */}
          <div className="bg-white rounded-xl p-4 mb-6 border-l-4 border-gold-accent">
            <p className="text-gray-600">
              {sectionConfig[selectedSection].description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-3 bg-gold-accent text-white rounded-lg hover:bg-gold-accent/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Image
            </button>
            <button
              onClick={() => setIsBulkModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-charcoal-black text-white rounded-lg hover:bg-charcoal-black/90 transition-colors"
            >
              <Images className="w-5 h-5" />
              Bulk Upload
            </button>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-white rounded-xl overflow-hidden shadow-lg ${
                    !image.isActive ? "opacity-50" : ""
                  }`}
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={image.imageUrl}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      #{image.order + 1}
                    </div>
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(image)}
                          className="p-2 bg-white rounded-full text-charcoal-black hover:bg-gold-accent hover:text-white transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(image._id)}
                          className="p-2 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-sm text-gray-800 truncate">
                      {image.alt}
                    </p>
                    {image.category && (
                      <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                        {image.category}
                      </span>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => toggleImageStatus(image)}
                        className={`text-xs px-3 py-1 rounded-full ${
                          image.isActive
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {image.isActive ? "Active" : "Hidden"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl">
              <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                No images in {sectionConfig[selectedSection].label}
              </p>
              <button
                onClick={openAddModal}
                className="text-gold-accent hover:underline"
              >
                Add your first image
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-charcoal-black">
                    {editingImage ? "Edit Image" : "Add New Image"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-gold-accent transition-colors"
                      onClick={() =>
                        document.getElementById("image-upload").click()
                      }
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">
                            Click to upload image
                          </p>
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section
                    </label>
                    <select
                      value={formData.section}
                      onChange={(e) =>
                        setFormData({ ...formData, section: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                    >
                      {Object.entries(sectionConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Alt Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={formData.alt}
                      onChange={(e) =>
                        setFormData({ ...formData, alt: e.target.value })
                      }
                      placeholder="Describe the image"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                    />
                  </div>

                  {/* Category (for stacked gallery) */}
                  {formData.section === "stacked" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        placeholder="e.g., Wedding, Portrait"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 bg-gold-accent text-white rounded-lg hover:bg-gold-accent/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingImage ? "Update Image" : "Add Image"}
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Upload Modal */}
        <AnimatePresence>
          {isBulkModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsBulkModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-charcoal-black">
                      Bulk Upload to {sectionConfig[selectedSection].label}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Max 20 images • 10MB each • Total 200MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsBulkModalOpen(false);
                      setBulkFiles([]);
                      setBulkPreviews([]);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Upload Requirements */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-amber-800 mb-2">
                      Upload Requirements
                    </h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>
                        • <strong>Max Images:</strong> 20 images per upload
                      </li>
                      <li>
                        • <strong>Max File Size:</strong> 10MB per image
                      </li>
                      <li>
                        • <strong>Total Size:</strong> 200MB maximum
                      </li>
                      <li>
                        • <strong>Recommended Resolution:</strong> 1920×1080px
                        (landscape) or 1080×1350px (portrait)
                      </li>
                      <li>
                        • <strong>Formats:</strong> JPG, PNG, WebP
                      </li>
                    </ul>
                  </div>

                  {/* Upload Area */}
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-gold-accent transition-colors mb-6"
                    onClick={() =>
                      document.getElementById("bulk-upload").click()
                    }
                  >
                    <Images className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Click to select multiple images
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Drag & drop or click to browse
                    </p>
                    <input
                      id="bulk-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleBulkImageChange}
                      className="hidden"
                    />
                  </div>

                  {/* Preview Grid */}
                  {bulkPreviews.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-3">
                        {bulkFiles.length} images selected
                      </p>
                      <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto">
                        {bulkPreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="aspect-square rounded-lg overflow-hidden"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBulkUpload}
                    disabled={isSaving || bulkFiles.length === 0}
                    className="w-full py-3 bg-charcoal-black text-white rounded-lg hover:bg-charcoal-black/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload {bulkFiles.length} Images
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminHomepageGallery;

import React, { useState, useEffect } from "react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import { motion } from "framer-motion";
import { Upload, Save, Link as LinkIcon, Clock, Type } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminPopups = () => {
  const [currentPopup, setCurrentPopup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    message: "",
    link: "",
    delay: 3000,
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchPopup();
  }, []);

  const fetchPopup = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/pop/popup`,
        { withCredentials: true }
      );
      if (response.data) {
        setCurrentPopup(response.data);
        setFormData({
          message: response.data.message || "",
          link: response.data.link || "",
          delay: response.data.delay || 3000,
          image: null,
        });
        setPreviewUrl(response.data.image);
      }
    } catch (error) {
      console.log("No active popup or error fetching");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const data = new FormData();
    data.append("message", formData.message);
    data.append("link", formData.link);
    data.append("delay", formData.delay);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (currentPopup && currentPopup._id) {
        // Update existing
        await axios.put(
          `${import.meta.env.VITE_NODE_URL}/api/pop/admin/popup/${
            currentPopup._id
          }`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Create new
        await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/pop/admin/popup`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      toast.success("Popup updated successfully!");
      fetchPopup();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update popup");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar />
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-playfair text-3xl font-bold text-[#0F0F0F] mb-2">
              Website Popup
            </h1>
            <p className="text-[#2B2B2B]/60 mb-8">
              Manage the announcement popup shown to visitors.
            </p>

            <div className="bg-white rounded-xl shadow-sm border border-[#2B2B2B]/5 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Left Column: Image Upload */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[#0F0F0F] mb-2">
                        Popup Image
                      </label>
                      <div className="relative aspect-video bg-[#FAF9F6] border-2 border-dashed border-[#2B2B2B]/10 rounded-lg overflow-hidden group hover:border-[#C9A24D] transition-colors">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#2B2B2B]/40">
                            <Upload size={32} strokeWidth={1.5} />
                            <span className="text-xs mt-2 uppercase tracking-widest">
                              Upload Image
                            </span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <p className="text-xs text-[#2B2B2B]/40 mt-2 text-center">
                        Best size: 800x600px or similar ratio. Click to change.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Details */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-[#0F0F0F] mb-2 flex items-center gap-2">
                        <Type size={16} className="text-[#C9A24D]" />
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-[#FAF9F6] border-none rounded-lg focus:ring-1 focus:ring-[#C9A24D] text-[#0F0F0F] placeholder-[#2B2B2B]/30 h-32 resize-none"
                        placeholder="Enter your announcement message..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0F0F0F] mb-2 flex items-center gap-2">
                        <LinkIcon size={16} className="text-[#C9A24D]" />
                        Call to Action Link (Optional)
                      </label>
                      <input
                        type="url"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-[#FAF9F6] border-none rounded-lg focus:ring-1 focus:ring-[#C9A24D] text-[#0F0F0F] placeholder-[#2B2B2B]/30"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0F0F0F] mb-2 flex items-center gap-2">
                        <Clock size={16} className="text-[#C9A24D]" />
                        Delay (ms)
                      </label>
                      <input
                        type="number"
                        value={formData.delay}
                        onChange={(e) =>
                          setFormData({ ...formData, delay: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-[#FAF9F6] border-none rounded-lg focus:ring-1 focus:ring-[#C9A24D] text-[#0F0F0F] placeholder-[#2B2B2B]/30"
                        placeholder="3000"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="w-full bg-[#0F0F0F] text-[#FAF9F6] py-3 rounded-lg font-bold uppercase tracking-widest hover:bg-[#C9A24D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {uploading ? "Saving..." : "Save Popup"}
                        {!uploading && <Save size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPopups;

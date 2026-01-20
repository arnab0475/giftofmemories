import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Upload, Edit, Trash2, Plus, Save, X } from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import Loader from "../components/Loader";

const AdminAboutPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Story Section State
  const [storyModal, setStoryModal] = useState(false);
  const [storyForm, setStoryForm] = useState({
    storyTitle: "",
    storyContent: "",
    storySignature: "",
    image: null,
  });
  const [storyImagePreview, setStoryImagePreview] = useState(null);

  // Team Member State
  const [teamModal, setTeamModal] = useState(false);
  const [teamForm, setTeamForm] = useState({
    name: "",
    designation: "",
    quote: "",
    image: null,
  });
  const [teamImagePreview, setTeamImagePreview] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/about/get-about`
      );
      setAboutData(response.data);
      setStoryForm({
        storyTitle: response.data.storyTitle,
        storyContent: response.data.storyContent,
        storySignature: response.data.storySignature,
        image: null,
      });
      setStoryImagePreview(response.data.storyImage);
    } catch (error) {
      console.error("Error fetching about data:", error);
      toast.error("Failed to fetch about data");
    } finally {
      setIsLoading(false);
    }
  };

  // Story Section Handlers
  const handleStoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoryForm({ ...storyForm, image: file });
      setStoryImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateStory = async () => {
    try {
      const formData = new FormData();
      formData.append("storyTitle", storyForm.storyTitle);
      formData.append("storyContent", storyForm.storyContent);
      formData.append("storySignature", storyForm.storySignature);
      if (storyForm.image) {
        formData.append("image", storyForm.image);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_NODE_URL}/api/about/update-story`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setAboutData(response.data.about);
      setStoryModal(false);
      toast.success("Story section updated successfully");
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error("Failed to update story section");
    }
  };

  // Team Member Handlers
  const handleTeamImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeamForm({ ...teamForm, image: file });
      setTeamImagePreview(URL.createObjectURL(file));
    }
  };

  const openAddTeamModal = () => {
    setTeamForm({ name: "", designation: "", quote: "", image: null });
    setTeamImagePreview(null);
    setEditingMemberId(null);
    setTeamModal(true);
  };

  const openEditTeamModal = (member) => {
    setTeamForm({
      name: member.name,
      designation: member.designation,
      quote: member.quote,
      image: null,
    });
    setTeamImagePreview(member.image);
    setEditingMemberId(member._id);
    setTeamModal(true);
  };

  const handleSaveTeamMember = async () => {
    try {
      if (!teamForm.name || !teamForm.designation || !teamForm.quote) {
        toast.error("Please fill all fields");
        return;
      }

      const formData = new FormData();
      formData.append("name", teamForm.name);
      formData.append("designation", teamForm.designation);
      formData.append("quote", teamForm.quote);
      if (teamForm.image) {
        formData.append("image", teamForm.image);
      }

      let response;
      if (editingMemberId) {
        // Update existing member
        response = await axios.put(
          `${
            import.meta.env.VITE_NODE_URL
          }/api/about/update-team-member/${editingMemberId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        toast.success("Team member updated successfully");
      } else {
        // Add new member
        if (!teamForm.image) {
          toast.error("Please upload an image");
          return;
        }
        response = await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/about/add-team-member`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        toast.success("Team member added successfully");
      }

      setAboutData(response.data.about);
      setTeamModal(false);
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Failed to save team member");
    }
  };

  const handleDeleteTeamMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_NODE_URL
        }/api/about/delete-team-member/${memberId}`,
        { withCredentials: true }
      );
      setAboutData(response.data.about);
      toast.success("Team member deleted successfully");
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
        <Sidebar />
        <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
          <TopBar />
          <main className="flex-1 p-8 overflow-y-auto flex items-center justify-center">
            <Loader color="#C9A24D" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
      <Sidebar />

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-playfair font-bold text-charcoal-black mb-2">
                Manage About Page
              </h1>
              <p className="text-slate-gray font-inter">
                Update story content and manage team members
              </p>
            </div>

            {/* Story Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-playfair font-bold text-charcoal-black">
                  Story Section ("Crafting Memories")
                </h2>
                <button
                  onClick={() => setStoryModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gold-accent text-white rounded-lg hover:bg-gold-accent/90 transition-colors"
                >
                  <Edit size={18} />
                  Edit Story
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={aboutData?.storyImage}
                    alt="Story"
                    className="w-full h-96 object-cover rounded-xl"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-playfair font-semibold mb-3">
                    {aboutData?.storyTitle}
                  </h3>
                  <p className="text-slate-gray font-inter leading-relaxed mb-4 line-clamp-6">
                    {aboutData?.storyContent}
                  </p>
                  <p className="text-gold-accent font-playfair italic">
                    {aboutData?.storySignature}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Team Members Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-playfair font-bold text-charcoal-black">
                  Team Members ("Meet The Creators")
                </h2>
                <button
                  onClick={openAddTeamModal}
                  className="flex items-center gap-2 px-4 py-2 bg-gold-accent text-white rounded-lg hover:bg-gold-accent/90 transition-colors"
                >
                  <Plus size={18} />
                  Add Team Member
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aboutData?.teamMembers?.map((member) => (
                  <div
                    key={member._id}
                    className="bg-warm-ivory rounded-xl overflow-hidden border border-gold-accent/20"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-playfair font-bold text-charcoal-black">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gold-accent font-inter uppercase tracking-wide mb-2">
                        {member.designation}
                      </p>
                      <p className="text-sm text-slate-gray font-inter line-clamp-3 mb-4">
                        {member.quote}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditTeamModal(member)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Story Edit Modal */}
      {storyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-playfair font-bold text-charcoal-black">
                Edit Story Section
              </h3>
              <button
                onClick={() => setStoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-inter font-semibold text-charcoal-black mb-2">
                  Story Image
                </label>
                <div className="flex items-center gap-4">
                  {storyImagePreview && (
                    <img
                      src={storyImagePreview}
                      alt="Preview"
                      className="w-32 h-40 object-cover rounded-lg"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-charcoal-black rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                    <Upload size={18} />
                    Upload New Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleStoryImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-inter font-semibold text-charcoal-black mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={storyForm.storyTitle}
                  onChange={(e) =>
                    setStoryForm({ ...storyForm, storyTitle: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                  placeholder="Crafting Memories Since 2016"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-inter font-semibold text-charcoal-black mb-2">
                  Content
                </label>
                <textarea
                  value={storyForm.storyContent}
                  onChange={(e) =>
                    setStoryForm({ ...storyForm, storyContent: e.target.value })
                  }
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                  placeholder="Your story content..."
                />
              </div>

              {/* Signature */}
              <div>
                <label className="block text-sm font-inter font-semibold text-charcoal-black mb-2">
                  Signature
                </label>
                <input
                  type="text"
                  value={storyForm.storySignature}
                  onChange={(e) =>
                    setStoryForm({
                      ...storyForm,
                      storySignature: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                  placeholder="- Gift of Memories Team"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateStory}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold-accent text-white rounded-lg hover:bg-gold-accent/90 transition-colors"
                >
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  onClick={() => setStoryModal(false)}
                  className="px-6 py-3 bg-gray-200 text-charcoal-black rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Team Member Modal */}
      {teamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-playfair font-bold text-charcoal-black">
                {editingMemberId ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button
                onClick={() => setTeamModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-inter font-semibold text-charcoal-black mb-2">
                  Photo *
                </label>
                <div className="flex items-center gap-4">
                  {teamImagePreview && (
                    <img
                      src={teamImagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-charcoal-black rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                    <Upload size={18} />
                    {editingMemberId ? "Change Photo" : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTeamImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-inter font-semibold text-charcoal-black mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-inter font-semibold text-charcoal-black mb-2">
                  Designation *
                </label>
                <input
                  type="text"
                  value={teamForm.designation}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, designation: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                  placeholder="Lead Photographer"
                />
              </div>

              {/* Quote */}
              <div>
                <label className="block text-sm font-inter font-semibold text-charcoal-black mb-2">
                  Quote *
                </label>
                <textarea
                  value={teamForm.quote}
                  onChange={(e) =>
                    setTeamForm({ ...teamForm, quote: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-accent focus:border-transparent"
                  placeholder="A brief quote or description..."
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveTeamMember}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold-accent text-white rounded-lg hover:bg-gold-accent/90 transition-colors"
                >
                  <Save size={18} />
                  {editingMemberId ? "Update Member" : "Add Member"}
                </button>
                <button
                  onClick={() => setTeamModal(false)}
                  className="px-6 py-3 bg-gray-200 text-charcoal-black rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminAboutPage;

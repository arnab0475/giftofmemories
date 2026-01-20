import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Search, ArrowLeft } from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import BlogEditor from "../components/admin/BlogEditor";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/blogs`
      );
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAddBlog = () => {
    setCurrentBlog(null);
    setIsEditing(true);
  };

  const handleEditBlog = (blog) => {
    setCurrentBlog(blog);
    setIsEditing(true);
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_NODE_URL}/api/blogs/${id}`);
        toast.success("Blog deleted successfully");
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast.error("Failed to delete blog");
      }
    }
  };

  const handleSaveBlog = async (blogData) => {
    try {
      setIsLoading(true);

      if (currentBlog) {
        // Update
        await axios.put(
          `${import.meta.env.VITE_NODE_URL}/api/blogs/${currentBlog._id}`,
          blogData
        );
        toast.success("Blog updated successfully");
      } else {
        // Create
        await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/blogs`,
          blogData
        );
        toast.success("Blog created successfully");
      }
      setIsEditing(false);
      setCurrentBlog(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Failed to save blog. Please try again.");
      setIsLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
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
            >
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Blog List
              </button>
              <BlogEditor
                blog={currentBlog}
                onSave={handleSaveBlog}
                onCancel={() => setIsEditing(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[1600px] mx-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="font-playfair text-3xl font-bold text-[#0F0F0F] mb-2">
                    Blog Management
                  </h1>
                  <p className="text-gray-500">
                    Manage your blog posts, stories, and articles.
                  </p>
                </div>
                <button
                  onClick={handleAddBlog}
                  className="bg-[#C9A24D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b08d42] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Plus size={20} />
                  Add New Blog
                </button>
              </div>

              {/* Search and Filter */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
                <Search className="text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search blogs..."
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-charcoal-black rounded-sm backdrop-blur-sm">
                          {blog.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-xs text-gray-400 mb-2 font-inter uppercase tracking-wide">
                          {blog.date}
                        </div>
                        <h3 className="font-playfair text-xl font-bold text-[#0F0F0F] mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                          {blog.excerpt}
                        </p>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <button
                            onClick={() => handleEditBlog(blog)}
                            className="flex items-center gap-2 text-gray-600 hover:text-[#C9A24D] transition-colors text-sm font-medium"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog._id)}
                            className="flex items-center gap-2 text-red-400 hover:text-red-600 transition-colors text-sm font-medium"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredBlogs.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                      No blogs found matching your search.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminBlogPage;

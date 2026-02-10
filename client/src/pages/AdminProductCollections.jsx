import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Eye,
  EyeOff,
  Package,
  GripVertical,
  Check,
  LayoutGrid,
  Rows,
  Star,
} from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminProductCollections = () => {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    displayStyle: "grid",
  });

  // Selected products for adding to collection
  const [selectedProducts, setSelectedProducts] = useState([]);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/product-collections/admin/get-collections`,
        { withCredentials: true },
      );
      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Failed to fetch collections");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/shop/admin/get-products`,
        { withCredentials: true },
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      displayStyle: "grid",
    });
    setEditingCollection(null);
  };

  const handleOpenModal = (collection = null) => {
    if (collection) {
      setEditingCollection(collection);
      setFormData({
        name: collection.name,
        description: collection.description || "",
        displayStyle: collection.displayStyle || "grid",
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Collection name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingCollection) {
        const response = await axios.put(
          `${import.meta.env.VITE_NODE_URL}/api/product-collections/update/${editingCollection._id}`,
          formData,
          { withCredentials: true },
        );
        setCollections((prev) =>
          prev.map((c) =>
            c._id === editingCollection._id ? response.data.collection : c,
          ),
        );
        toast.success("Collection updated successfully");
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/product-collections/create`,
          formData,
          { withCredentials: true },
        );
        setCollections((prev) => [...prev, response.data.collection]);
        toast.success("Collection created successfully");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving collection:", error);
      toast.error(error.response?.data?.message || "Failed to save collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this collection?")) {
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_NODE_URL}/api/product-collections/delete/${id}`,
        { withCredentials: true },
      );
      setCollections((prev) => prev.filter((c) => c._id !== id));
      toast.success("Collection deleted successfully");
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("Failed to delete collection");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_NODE_URL}/api/product-collections/toggle-active/${id}`,
        {},
        { withCredentials: true },
      );
      setCollections((prev) =>
        prev.map((c) => (c._id === id ? response.data.collection : c)),
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error toggling collection:", error);
      toast.error("Failed to toggle collection status");
    }
  };

  const handleOpenProductsModal = (collection) => {
    setSelectedCollection(collection);
    setSelectedProducts(collection.products.map((p) => p._id));
    setShowProductsModal(true);
  };

  const handleCloseProductsModal = () => {
    setShowProductsModal(false);
    setSelectedCollection(null);
    setSelectedProducts([]);
    setSearchQuery("");
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleSaveProducts = async () => {
    if (!selectedCollection) return;

    try {
      setIsSubmitting(true);
      const response = await axios.put(
        `${import.meta.env.VITE_NODE_URL}/api/product-collections/update/${selectedCollection._id}`,
        { products: selectedProducts },
        { withCredentials: true },
      );
      setCollections((prev) =>
        prev.map((c) =>
          c._id === selectedCollection._id ? response.data.collection : c,
        ),
      );
      toast.success("Products updated successfully");
      handleCloseProductsModal();
    } catch (error) {
      console.error("Error updating products:", error);
      toast.error("Failed to update products");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveProduct = async (collectionId, productId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_NODE_URL}/api/product-collections/remove-product/${collectionId}/${productId}`,
        { withCredentials: true },
      );
      setCollections((prev) =>
        prev.map((c) =>
          c._id === collectionId ? response.data.collection : c,
        ),
      );
      toast.success("Product removed from collection");
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Failed to remove product");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const displayStyleIcons = {
    grid: <LayoutGrid size={16} />,
    carousel: <Rows size={16} />,
    featured: <Star size={16} />,
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
                  Product Collections
                </h1>
                <p className="text-gray-500">
                  Create and manage custom product collections for your shop
                  page
                </p>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="bg-[#C9A24D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b08d42] transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus size={20} />
                New Collection
              </button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Tip:</strong> Collections appear at the top of the shop
                page before all products. Create collections like "Most Sold",
                "User Favourites", "New Arrivals" to highlight specific
                products.
              </p>
            </div>

            {/* Collections List */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader />
              </div>
            ) : collections.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Collections Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first collection to showcase featured products
                </p>
                <button
                  onClick={() => handleOpenModal()}
                  className="bg-[#C9A24D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b08d42] transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={20} />
                  Create Collection
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {collections.map((collection, index) => (
                  <motion.div
                    key={collection._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                      !collection.isActive ? "opacity-60" : ""
                    }`}
                  >
                    {/* Collection Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded-lg cursor-grab">
                            <GripVertical size={20} className="text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg text-gray-800">
                                {collection.name}
                              </h3>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  collection.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {collection.isActive ? "Active" : "Hidden"}
                              </span>
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
                                {displayStyleIcons[collection.displayStyle]}
                                {collection.displayStyle}
                              </span>
                            </div>
                            {collection.description && (
                              <p className="text-gray-500 text-sm mt-1">
                                {collection.description}
                              </p>
                            )}
                            <p className="text-gray-400 text-xs mt-2">
                              {collection.products.length} products
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenProductsModal(collection)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Manage Products"
                          >
                            <Plus size={18} />
                          </button>
                          <button
                            onClick={() => handleToggleActive(collection._id)}
                            className={`p-2 rounded-lg transition-colors ${
                              collection.isActive
                                ? "text-green-600 hover:bg-green-50"
                                : "text-gray-400 hover:bg-gray-50"
                            }`}
                            title={collection.isActive ? "Hide" : "Show"}
                          >
                            {collection.isActive ? (
                              <Eye size={18} />
                            ) : (
                              <EyeOff size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleOpenModal(collection)}
                            className="p-2 text-gold-accent hover:bg-gold-accent/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(collection._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Products Grid */}
                    {collection.products.length > 0 && (
                      <div className="p-6 bg-gray-50">
                        <div className="flex flex-wrap gap-3">
                          {collection.products.map((product) => (
                            <div
                              key={product._id}
                              className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 group"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
                                {product.name}
                              </span>
                              <button
                                onClick={() =>
                                  handleRemoveProduct(
                                    collection._id,
                                    product._id,
                                  )
                                }
                                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create/Edit Collection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#0F0F0F] font-playfair">
                  {editingCollection ? "Edit Collection" : "Create Collection"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Most Sold, User Favourites"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="A short description for this collection"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Display Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Style
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "grid", label: "Grid", icon: LayoutGrid },
                      { value: "carousel", label: "Carousel", icon: Rows },
                      { value: "featured", label: "Featured", icon: Star },
                    ].map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            displayStyle: style.value,
                          })
                        }
                        className={`flex-1 p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                          formData.displayStyle === style.value
                            ? "border-[#C9A24D] bg-[#C9A24D]/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <style.icon
                          size={20}
                          className={
                            formData.displayStyle === style.value
                              ? "text-[#C9A24D]"
                              : "text-gray-400"
                          }
                        />
                        <span
                          className={`text-sm ${
                            formData.displayStyle === style.value
                              ? "text-[#C9A24D] font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          {style.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-[#C9A24D] text-white rounded-lg hover:bg-[#b08d42] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingCollection
                        ? "Update"
                        : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Products Modal */}
      <AnimatePresence>
        {showProductsModal && selectedCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={handleCloseProductsModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#0F0F0F] font-playfair">
                  Manage Products - {selectedCollection.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Select products to add to this collection
                </p>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Products List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {filteredProducts.map((product) => {
                    const isSelected = selectedProducts.includes(product._id);
                    return (
                      <div
                        key={product._id}
                        onClick={() => toggleProductSelection(product._id)}
                        className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#C9A24D]/10 border border-[#C9A24D]"
                            : "bg-gray-50 border border-transparent hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-[#C9A24D] border-[#C9A24D]"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 truncate">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {product.category?.name} • ₹{product.price}
                          </p>
                        </div>
                        {product.isBestseller && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded font-medium">
                            Bestseller
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {selectedProducts.length} products selected
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseProductsModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProducts}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-[#C9A24D] text-white rounded-lg hover:bg-[#b08d42] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save Products"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductCollections;

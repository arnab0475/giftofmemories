import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Star,
  StarOff,
  Eye,
  EyeOff,
  FolderPlus,
  Layers,
} from "lucide-react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("products"); // "products" or "categories"

  // Form state for products
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    popularity: "",
    isBestseller: false,
    oldPrice: "",
    tag:"",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form state for categories
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    order: "",
  });
  const [categoryImageFile, setCategoryImageFile] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/product-categories/admin/get-categories`,
        { withCredentials: true },
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/shop/admin/get-products`,
        { withCredentials: true },
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: categories.length > 0 ? categories[0]._id : "",
      popularity: "",
      isBestseller: false,
      oldPrice: "",
      tag:"",
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingProduct(null);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      description: "",
      order: "",
    });
    setCategoryImageFile(null);
    setCategoryImagePreview(null);
    setEditingCategory(null);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category?._id || product.category,
        popularity: product.popularity?.toString() || "",
        isBestseller: product.isBestseller || false,
        oldPrice: product.oldPrice ? product.oldPrice.toString() : "",
        tag: product.tag || "new",
      });
      setImagePreview(product.image);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleOpenCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryFormData({
        name: category.name,
        description: category.description || "",
        order: category.order?.toString() || "",
      });
      setCategoryImagePreview(category.image);
    } else {
      resetCategoryForm();
    }
    setShowCategoryModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    resetCategoryForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Category CRUD operations
  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    if (!categoryFormData.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("name", categoryFormData.name);
      data.append("description", categoryFormData.description);
      data.append("order", categoryFormData.order || "0");

      if (categoryImageFile) {
        data.append("image", categoryImageFile);
      }

      if (editingCategory) {
        await axios.put(
          `${import.meta.env.VITE_NODE_URL}/api/product-categories/update-category/${editingCategory._id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );
        toast.success("Category updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/product-categories/add-category`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );
        toast.success("Category created successfully");
      }

      handleCloseCategoryModal();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? Products in this category will be affected.",
      )
    ) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_NODE_URL}/api/product-categories/delete-category/${id}`,
          { withCredentials: true },
        );
        toast.success("Category deleted successfully");
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
      }
    }
  };

  const handleToggleCategoryStatus = async (id) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_NODE_URL}/api/product-categories/toggle-status/${id}`,
        {},
        { withCredentials: true },
      );
      toast.success(response.data.message);
      setCategories((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isActive: !c.isActive } : c)),
      );
    } catch (error) {
      console.error("Error toggling category status:", error);
      toast.error("Failed to update category");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingProduct && !imageFile) {
      toast.error("Please select an image");
      return;
    }

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("name", formData.name);
data.append("description", formData.description);
data.append("price", formData.price);
data.append("oldPrice", formData.oldPrice || "");
data.append("tag", formData.tag || "");
data.append("category", formData.category);
data.append("popularity", formData.popularity || "0");
data.append("isBestseller", formData.isBestseller);
      if (imageFile) {
        data.append("image", imageFile);
      }

      if (editingProduct) {
        await axios.put(
          `${import.meta.env.VITE_NODE_URL}/api/shop/update-product/${
            editingProduct._id
          }`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/shop/add-product`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );
        toast.success("Product added successfully");
      }

      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_NODE_URL}/api/shop/delete-product/${id}`,
          { withCredentials: true },
        );
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  const handleToggleBestseller = async (id) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_NODE_URL}/api/shop/toggle-bestseller/${id}`,
        {},
        { withCredentials: true },
      );
      toast.success(response.data.message);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isBestseller: !p.isBestseller } : p,
        ),
      );
    } catch (error) {
      console.error("Error toggling bestseller:", error);
      toast.error("Failed to update product");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_NODE_URL}/api/shop/toggle-active/${id}`,
        {},
        { withCredentials: true },
      );
      toast.success(response.data.message);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !p.isActive } : p)),
      );
    } catch (error) {
      console.error("Error toggling active status:", error);
      toast.error("Failed to update product");
    }
  };
const filteredProducts = useMemo(() => {
  return products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      product.category?._id === categoryFilter ||
      product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });
}, [products, searchQuery, categoryFilter]);

  const getCategoryName = (product) => {
    if (product.category?.name) return product.category.name;
    const cat = categories.find((c) => c._id === product.category);
    return cat?.name || "Unknown";
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
      <Sidebar />

      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar />

        <main className="flex-1 p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1600px] mx-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="font-playfair text-3xl font-bold text-[#0F0F0F] mb-2">
                  Shop Management
                </h1>
                <p className="text-gray-500">
                  Manage your products, categories, and inventory.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleOpenCategoryModal()}
                  className="bg-white border border-[#C9A24D] text-[#C9A24D] px-6 py-3 rounded-lg font-medium hover:bg-[#C9A24D]/10 transition-colors flex items-center gap-2"
                >
                  <FolderPlus size={20} />
                  Add Category
                </button>
                <button
                  onClick={() => handleOpenModal()}
                  className="bg-[#C9A24D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b08d42] transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Plus size={20} />
                  Add Product
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  activeTab === "products"
                    ? "bg-[#C9A24D] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Layers size={18} />
                Products ({products.length})
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  activeTab === "categories"
                    ? "bg-[#C9A24D] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FolderPlus size={18} />
                Categories ({categories.length})
              </button>
            </div>

            {activeTab === "products" && (
              <>
                {/* Search and Filter */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <Search className="text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 outline-none text-gray-700 placeholder:text-gray-400"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 outline-none focus:border-[#C9A24D]"
                  >
                    <option value="All">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Products Grid */}
                {isLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative ${
                          !product.isActive ? "opacity-60" : ""
                        }`}
                      >
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                          {product.isBestseller && (
                            <span className="bg-[#C9A24D] text-white text-xs px-2 py-1 rounded font-medium">
                              Bestseller
                            </span>
                          )}
                          {!product.isActive && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                              Inactive
                            </span>
                          )}
                        </div>

                        {/* Image */}
                        <div className="h-48 overflow-hidden bg-gray-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="text-xs text-[#C9A24D] font-medium uppercase tracking-wider mb-1">
                            {getCategoryName(product)}
                          </div>
                          <h3 className="font-playfair text-lg font-bold text-[#0F0F0F] mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-xl font-bold text-[#0F0F0F]">
                              ₹{product.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400">
                              Pop: {product.popularity || 0}%
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleToggleBestseller(product._id)
                                }
                                className={`p-2 rounded-lg transition-colors ${
                                  product.isBestseller
                                    ? "bg-[#C9A24D]/10 text-[#C9A24D]"
                                    : "bg-gray-100 text-gray-500 hover:text-[#C9A24D]"
                                }`}
                                title={
                                  product.isBestseller
                                    ? "Remove from bestsellers"
                                    : "Add to bestsellers"
                                }
                              >
                                {product.isBestseller ? (
                                  <Star size={16} fill="currentColor" />
                                ) : (
                                  <StarOff size={16} />
                                )}
                              </button>
                              <button
                                onClick={() => handleToggleActive(product._id)}
                                className={`p-2 rounded-lg transition-colors ${
                                  product.isActive
                                    ? "bg-green-50 text-green-600"
                                    : "bg-red-50 text-red-500"
                                }`}
                                title={
                                  product.isActive
                                    ? "Deactivate product"
                                    : "Activate product"
                                }
                              >
                                {product.isActive ? (
                                  <Eye size={16} />
                                ) : (
                                  <EyeOff size={16} />
                                )}
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenModal(product)}
                                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:text-[#C9A24D] hover:bg-[#C9A24D]/10 transition-colors"
                                title="Edit product"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-2 rounded-lg bg-gray-100 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {filteredProducts.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-400">
                        No products found.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                      !category.isActive ? "opacity-60" : ""
                    }`}
                  >
                    {/* Category Image */}
                    <div className="h-32 overflow-hidden bg-gradient-to-br from-[#C9A24D]/20 to-[#C9A24D]/5 flex items-center justify-center">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FolderPlus size={48} className="text-[#C9A24D]/40" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-playfair text-lg font-bold text-[#0F0F0F]">
                          {category.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            category.isActive
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-400 mb-3">
                        Order: {category.order || 0}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <button
                          onClick={() =>
                            handleToggleCategoryStatus(category._id)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            category.isActive
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-500"
                          }`}
                          title={category.isActive ? "Deactivate" : "Activate"}
                        >
                          {category.isActive ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenCategoryModal(category)}
                            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:text-[#C9A24D] hover:bg-[#C9A24D]/10 transition-colors"
                            title="Edit category"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="p-2 rounded-lg bg-gray-100 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {categories.length === 0 && (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    No categories found. Create one to get started.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-playfair text-2xl font-bold text-[#0F0F0F]">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image {!editingProduct && "*"}
                  </label>
                  <div className="flex items-start gap-4">
                    {imagePreview && (
                      <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#C9A24D] transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="text-gray-500">
                        <Plus size={24} className="mx-auto mb-2" />
                        <p className="text-sm">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">
                          JPG, PNG, WEBP up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#C9A24D] transition-colors"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#C9A24D] transition-colors resize-none"
                    required
                  />
                </div>

                {/* Price and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#C9A24D] transition-colors"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Old Price (₹)
    </label>
    <input
      type="number"
      name="oldPrice"
      value={formData.oldPrice}
      onChange={handleInputChange}
      placeholder="0"
      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#C9A24D]"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Product Tag
    </label>
    <select
      name="tag"
      value={formData.tag}
      onChange={handleInputChange}
      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#C9A24D]"
    >
      <option value="">None</option>
      <option value="new">New</option>
      <option value="sale">Sale</option>
      <option value="popular">Popular</option>
    </select>
  </div>
</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#C9A24D] transition-colors"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Popularity and Bestseller */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Popularity (0-100)
                    </label>
                    <input
                      type="number"
                      name="popularity"
                      value={formData.popularity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#C9A24D] transition-colors"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer mt-6">
                      <input
                        type="checkbox"
                        name="isBestseller"
                        checked={formData.isBestseller}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded border-gray-300 text-[#C9A24D] focus:ring-[#C9A24D]"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Mark as Bestseller
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#C9A24D] text-white rounded-lg font-medium hover:bg-[#b08d42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size="sm" color="#ffffff" />
                        Saving...
                      </>
                    ) : editingProduct ? (
                      "Update Product"
                    ) : (
                      "Add Product"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseCategoryModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="font-playfair text-2xl font-bold text-[#0F0F0F]">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h2>
                <button
                  onClick={handleCloseCategoryModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCategorySubmit} className="p-6 space-y-5">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image (Optional)
                  </label>
                  <div className="flex items-start gap-4">
                    {categoryImagePreview && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={categoryImagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#C9A24D] transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategoryImageChange}
                        className="hidden"
                      />
                      <div className="text-gray-500">
                        <Plus size={20} className="mx-auto mb-1" />
                        <p className="text-sm">Upload image</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={categoryFormData.name}
                    onChange={handleCategoryInputChange}
                    placeholder="Enter category name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#C9A24D] transition-colors"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={categoryFormData.description}
                    onChange={handleCategoryInputChange}
                    placeholder="Enter category description"
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#C9A24D] transition-colors resize-none"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={categoryFormData.order}
                    onChange={handleCategoryInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#C9A24D] transition-colors"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Lower numbers appear first
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseCategoryModal}
                    className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#C9A24D] text-white rounded-lg font-medium hover:bg-[#b08d42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size="sm" color="#ffffff" />
                        Saving...
                      </>
                    ) : editingCategory ? (
                      "Update Category"
                    ) : (
                      "Create Category"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminShopPage;

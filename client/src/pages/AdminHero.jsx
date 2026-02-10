import { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { X, GripVertical, Plus, Image as ImageIcon } from "lucide-react";

const AdminHero = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
  });

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async ({ populateForm = true } = {}) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/hero/hero`,
      );
      setHero(res.data);
      const cleared = localStorage.getItem("heroFormCleared") === "true";
      if (res.data && populateForm && !cleared) {
        setForm({
          title: res.data.title || "",
          subtitle: res.data.subtitle || "",
          buttonText: res.data.buttonText || "",
          buttonLink: res.data.buttonLink || "",
        });
        setExistingImages(res.data.images || []);
        setPreviews(res.data.images || []);
      }
    } catch (err) {
      // no hero yet is okay
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      isNew: true,
      file,
    }));

    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev.filter((p) => typeof p === "string" || !p.isNew),
      ...prev.filter((p) => typeof p !== "string" && p.isNew),
      ...newPreviews,
    ]);

    e.target.value = null;
  };

  const handleRemoveImage = (index) => {
    const preview = previews[index];

    if (typeof preview === "string") {
      setExistingImages((prev) => prev.filter((img) => img !== preview));
    } else if (preview.isNew) {
      setNewFiles((prev) => prev.filter((f) => f !== preview.file));
      URL.revokeObjectURL(preview.url);
    }

    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPreviews = [...previews];
    const draggedItem = newPreviews[draggedIndex];
    newPreviews.splice(draggedIndex, 1);
    newPreviews.splice(index, 0, draggedItem);

    setPreviews(newPreviews);
    setDraggedIndex(index);

    const existingOnly = newPreviews.filter((p) => typeof p === "string");
    setExistingImages(existingOnly);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleClearAll = () => {
    previews.forEach((p) => {
      if (typeof p !== "string" && p.url) {
        URL.revokeObjectURL(p.url);
      }
    });

    setPreviews([]);
    setExistingImages([]);
    setNewFiles([]);
    setForm({ title: "", subtitle: "", buttonText: "", buttonLink: "" });
    localStorage.setItem("heroFormCleared", "true");
    toast.info("Form cleared. Use 'Edit Hero' to load the current hero.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("subtitle", form.subtitle);
      data.append("buttonText", form.buttonText);
      data.append("buttonLink", form.buttonLink);

      const existingToKeep = previews.filter((p) => typeof p === "string");
      data.append("existingImages", JSON.stringify(existingToKeep));

      newFiles.forEach((file) => {
        data.append("images", file);
      });

      if (hero && hero._id) {
        const res = await axios.put(
          `${import.meta.env.VITE_NODE_URL}/api/hero/admin/hero/${hero._id}`,
          data,
          { withCredentials: true },
        );
        setHero(res.data.hero);
        toast.success("Hero updated");
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/hero/admin/hero`,
          data,
          { withCredentials: true },
        );
        setHero(res.data.hero);
        toast.success("Hero created");
      }

      setForm({ title: "", subtitle: "", buttonText: "", buttonLink: "" });
      setNewFiles([]);
      setPreviews([]);
      setExistingImages([]);
      localStorage.setItem("heroFormCleared", "true");

      await fetchHero({ populateForm: false });
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const loadHeroIntoForm = () => {
    if (!hero) return;
    setForm({
      title: hero.title || "",
      subtitle: hero.subtitle || "",
      buttonText: hero.buttonText || "",
      buttonLink: hero.buttonLink || "",
    });
    setExistingImages(hero.images || []);
    setPreviews(hero.images || []);
    setNewFiles([]);
    localStorage.removeItem("heroFormCleared");
    toast.info("Loaded hero into form for editing");
  };

  return (
    <div className="flex min-h-screen bg-warm-ivory font-inter">
      <Sidebar />
      <div className="flex-1 ml-65 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-8">
          <div className="max-w-1200 mx-auto space-y-6">
            <h2 className="font-playfair text-3xl font-bold text-charcoal-black">
              Manage Hero Section
            </h2>

            <div className="bg-white p-6 rounded-[14px] shadow-sm border border-slate-gray/5">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="p-3 border rounded"
                    required
                  />
                  <input
                    name="buttonText"
                    value={form.buttonText}
                    onChange={handleChange}
                    placeholder="Button text (e.g. View Portfolio)"
                    className="p-3 border rounded"
                  />
                  <input
                    name="buttonLink"
                    value={form.buttonLink}
                    onChange={handleChange}
                    placeholder="Button link (URL)"
                    className="p-3 border rounded"
                  />
                  <textarea
                    name="subtitle"
                    value={form.subtitle}
                    onChange={handleChange}
                    placeholder="Subtitle / Description"
                    rows={3}
                    className="p-3 border rounded md:col-span-2"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-charcoal-black">
                      Hero Images (Slider)
                    </h3>
                    <span className="text-xs text-slate-gray/60">
                      Drag to reorder • Max 10MB per image
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {previews.map((preview, index) => {
                      const imageUrl =
                        typeof preview === "string" ? preview : preview.url;
                      const isNew =
                        typeof preview !== "string" && preview.isNew;

                      return (
                        <div
                          key={index}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`relative group aspect-[16/9] rounded-lg overflow-hidden border-2 cursor-move transition-all ${
                            draggedIndex === index
                              ? "border-gold-accent opacity-50"
                              : "border-slate-gray/10 hover:border-gold-accent/50"
                          }`}
                        >
                          <img
                            src={imageUrl}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute inset-0 bg-charcoal-black/0 group-hover:bg-charcoal-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="absolute top-2 left-2 p-1 bg-charcoal-black/50 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical size={14} />
                          </div>

                          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-charcoal-black/70 text-white text-xs rounded">
                            {index + 1}
                          </div>

                          {isNew && (
                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-gold-accent text-white text-xs rounded">
                              New
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <label className="aspect-[16/9] rounded-lg border-2 border-dashed border-slate-gray/30 flex flex-col items-center justify-center cursor-pointer hover:border-gold-accent hover:bg-gold-accent/5 transition-all">
                      <Plus size={24} className="text-slate-gray/50 mb-1" />
                      <span className="text-xs text-slate-gray/60">
                        Add Images
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {previews.length === 0 && (
                    <div className="text-center py-8 text-slate-gray/60">
                      <ImageIcon
                        size={48}
                        className="mx-auto mb-2 opacity-30"
                      />
                      <p className="text-sm">
                        No images selected. Add images to create a slider.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2 px-6 bg-charcoal-black text-gold-accent rounded font-medium hover:bg-charcoal-black/90 transition-colors"
                  >
                    {saving
                      ? "Saving..."
                      : hero
                        ? "Update Hero"
                        : "Create Hero"}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="py-2 px-4 bg-white border rounded text-sm hover:bg-slate-50"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-[14px] shadow-sm border border-slate-gray/5">
              <h3 className="font-semibold mb-4">Current Hero Preview</h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : !hero ? (
                <div className="text-sm text-slate-gray/60 py-4">
                  No hero configured yet.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{hero.title}</div>
                      <div className="text-sm text-slate-gray/70 mt-1">
                        {hero.subtitle}
                      </div>
                      {hero.buttonText && (
                        <div className="text-xs mt-2 text-slate-gray/60">
                          CTA: {hero.buttonText} → {hero.buttonLink}
                        </div>
                      )}
                      <div className="text-xs mt-2 text-gold-accent">
                        {hero.images?.length || 0} slide
                        {(hero.images?.length || 0) !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={loadHeroIntoForm}
                      className="py-2 px-4 bg-charcoal-black text-gold-accent rounded text-sm hover:bg-charcoal-black/90"
                    >
                      Edit Hero
                    </button>
                  </div>

                  {hero.images && hero.images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {hero.images.map((img, index) => (
                        <div
                          key={index}
                          className="aspect-[16/9] rounded overflow-hidden bg-muted-beige"
                        >
                          <img
                            src={img}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHero;

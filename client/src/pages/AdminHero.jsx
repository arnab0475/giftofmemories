import { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";

const AdminHero = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
  });

  useEffect(() => {
    fetchHero();
  }, []);

  // fetchHero: if populateForm=false it will update hero preview without populating the edit form
  const fetchHero = async ({ populateForm = true } = {}) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/hero/hero`
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
        setPreview(res.data.image || null);
      }
      // if populateForm is false we still update `hero` (used in the preview panel)
    } catch (err) {
      // no hero yet is okay
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      setPreview(hero?.image || null);
      setFileName(null);
    }
  };

  const handleClearImage = () => {
    // Reset selected file and preview in the edit form (clear selection)
    setPreview(null);
    setFileName(null);
    const inputEl = document.getElementById("hero-image-input");
    if (inputEl) inputEl.value = null;

    // Also clear the edit form entirely and remember preference so the form
    // won't be populated automatically on next load/login
    setForm({ title: "", subtitle: "", buttonText: "", buttonLink: "" });
    localStorage.setItem("heroFormCleared", "true");
    toast.info(
      "Form cleared. Use 'Edit Hero' to load the current hero into the form."
    );
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
      const fileInput = document.getElementById("hero-image-input");
      if (fileInput && fileInput.files[0])
        data.append("image", fileInput.files[0]);

      if (hero && hero._id) {
        const res = await axios.put(
          `${import.meta.env.VITE_NODE_URL}/api/hero/admin/hero/${hero._id}`,
          data,
          { withCredentials: true }
        );
        setHero(res.data.hero);
        toast.success("Hero updated");
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_NODE_URL}/api/hero/admin/hero`,
          data,
          { withCredentials: true }
        );
        setHero(res.data.hero);
        toast.success("Hero created");
      }

      // Clear the edit form and file state after successful save per request
      setForm({ title: "", subtitle: "", buttonText: "", buttonLink: "" });
      setFileName(null);
      setPreview(null);
      const fileInputEl = document.getElementById("hero-image-input");
      if (fileInputEl) fileInputEl.value = null;

      // Remember that the admin cleared/saved so the form doesn't auto-populate
      localStorage.setItem("heroFormCleared", "true");

      // Refresh hero preview but do not repopulate the edit form
      await fetchHero({ populateForm: false });
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
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
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
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
                  rows={4}
                  className="p-3 border rounded md:col-span-2"
                />

                <div className="md:col-span-2 flex gap-4 items-center">
                  <div className="flex-1">
                    <label
                      htmlFor="hero-image-input"
                      className="inline-flex items-center gap-3 py-2 px-4 bg-white border rounded cursor-pointer hover:bg-slate-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-charcoal-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6M8 8l4-4 4 4"
                        />
                      </svg>
                      <span className="text-sm">Upload image</span>
                    </label>
                    <input
                      id="hero-image-input"
                      className="hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                    />
                    <div className="text-sm text-slate-gray/60 mt-1">
                      Max 10MB. Formats: jpg, png, webp, gif
                    </div>
                    {fileName && (
                      <div className="text-xs text-slate-gray/60 mt-1">
                        Selected: {fileName}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-48 h-32 rounded overflow-hidden bg-muted-beige flex items-center justify-center border">
                      {preview ? (
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="p-2 text-xs text-slate-gray/60">
                          No image selected
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="mt-2 py-1 px-3 bg-white border rounded text-xs hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2 px-4 bg-charcoal-black text-gold-accent rounded"
                  >
                    {saving
                      ? "Saving..."
                      : hero
                      ? "Update Hero"
                      : "Create Hero"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-[14px] shadow-sm border border-slate-gray/5">
              <h3 className="font-semibold mb-3">Current Hero Preview</h3>
              {loading ? (
                <div>Loading...</div>
              ) : !hero ? (
                <div className="text-sm text-slate-gray/60">
                  No hero configured yet.
                </div>
              ) : (
                <div className="flex gap-4 items-center">
                  <div className="w-48 h-32 rounded overflow-hidden bg-muted-beige flex items-center justify-center border">
                    {hero.image ? (
                      <img
                        src={hero.image}
                        alt={hero.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-2 text-xs text-slate-gray/60">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold">{hero.title}</div>
                    <div className="text-sm text-slate-gray/70">
                      {hero.subtitle}
                    </div>
                    {hero.buttonText && (
                      <div className="text-xs mt-2">
                        CTA: {hero.buttonText} → {hero.buttonLink}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          // Load current hero into the edit form (allow admin to edit)
                          setForm({
                            title: hero.title || "",
                            subtitle: hero.subtitle || "",
                            buttonText: hero.buttonText || "",
                            buttonLink: hero.buttonLink || "",
                          });
                          setPreview(hero.image || null);
                          setFileName(null);
                          localStorage.removeItem("heroFormCleared");
                          toast.info("Loaded hero into the form for editing");
                        }}
                        className="py-1 px-3 bg-white border rounded text-sm hover:bg-slate-50"
                      >
                        Edit Hero
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          // Clear persistent preference so form will not auto-populate
                          localStorage.setItem("heroFormCleared", "true");
                          setForm({
                            title: "",
                            subtitle: "",
                            buttonText: "",
                            buttonLink: "",
                          });
                          setPreview(hero.image || null);
                          toast.info(
                            "Form cleared; hero will not auto-populate on next load"
                          );
                        }}
                        className="py-1 px-3 bg-white border rounded text-sm hover:bg-slate-50"
                      >
                        Clear Form
                      </button>
                    </div>
                  </div>
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

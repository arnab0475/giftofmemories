import { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import axios from "axios";
import { toast } from "react-toastify";

const AdminTestimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "",
    title: "",
    feedback: "",
  });
  const [saving, setSaving] = useState(false);

  // Edit
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/testimonial/testimonials`
      );
      setTestimonials(res.data);
    } catch (err) {
      setError("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_NODE_URL}/api/testimonial/add-testimonial`,
        form,
        { withCredentials: true }
      );
      setTestimonials((prev) => [res.data.testimonial, ...prev]);
      setForm({ name: "", title: "", feedback: "" });
      toast.success("Testimonial added");
    } catch (err) {
      toast.error(err.response?.data?.message || "Add failed");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (t) => {
    setEditing(t);
    setForm({
      name: t.name || "",
      title: t.title || "",
      feedback: t.feedback || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_NODE_URL}/api/testimonial/update-testimonial/${
          editing._id
        }`,
        form,
        { withCredentials: true }
      );
      setTestimonials((prev) =>
        prev.map((p) => (p._id === editing._id ? res.data.testimonial : p))
      );
      setEditing(null);
      setForm({ name: "", title: "", feedback: "" });
      toast.success("Testimonial updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_NODE_URL
        }/api/testimonial/delete-testimonial/${id}`,
        { withCredentials: true }
      );
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
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
              Manage Testimonials
            </h2>

            <div className="bg-white p-6 rounded-[14px] shadow-sm border border-slate-gray/5">
              <form
                onSubmit={editing ? handleUpdate : handleAdd}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Author name"
                  className="p-3 border rounded"
                  required
                />
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title / Role"
                  className="p-3 border rounded"
                />

                <textarea
                  name="feedback"
                  value={form.feedback}
                  onChange={handleChange}
                  placeholder="Feedback"
                  rows={3}
                  className="p-3 border rounded md:col-span-3"
                  required
                />

                <div className="md:col-span-3 flex gap-3">
                  {editing && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(null);
                        setForm({
                          name: "",
                          title: "",
                          feedback: "",
                        });
                      }}
                      className="py-2 px-4 bg-white border rounded"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="py-2 px-4 bg-charcoal-black text-gold-accent rounded"
                  >
                    {saving
                      ? "Saving..."
                      : editing
                      ? "Update"
                      : "Add Testimonial"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-[14px] shadow-sm border border-slate-gray/5">
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div className="text-red-600">{error}</div>
              ) : (
                <div className="space-y-3">
                  {testimonials.length === 0 ? (
                    <div className="text-sm text-slate-gray/60">
                      No testimonials yet.
                    </div>
                  ) : (
                    testimonials.map((t) => (
                      <div
                        key={t._id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded bg-muted-beige flex items-center justify-center">
                            {t.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">
                              {t.name}{" "}
                              <span className="text-xs text-slate-gray/60">
                                {t.title}
                              </span>
                            </div>
                            <div className="text-sm text-slate-gray/70">
                              {t.feedback}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(t)}
                            className="py-1 px-3 bg-white border rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(t._id)}
                            className="py-1 px-3 bg-red-600 text-white rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
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

export default AdminTestimonial;

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, RefreshCw } from "lucide-react";
import axios from "axios";
import Sidebar from "../components/admin/Sidebar";
import TopBar from "../components/admin/TopBar";
import { toast } from "react-toastify";

const AdminFAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_NODE_URL}/api/faqs/all`,
        { withCredentials: true },
      );
      setFaqs(res.data);
    } catch (err) {
      toast.error("Failed to fetch FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleChange = (idx, field, value) => {
    const updated = [...faqs];
    updated[idx][field] = value;
    setFaqs(updated);
  };

  const handleAdd = () => {
    setFaqs([...faqs, { question: "", answer: "", isActive: true }]);
  };

  const handleDelete = async (id, idx) => {
    if (id) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_NODE_URL}/api/faqs/delete/${id}`,
          { withCredentials: true },
        );
        toast.success("FAQ deleted");
      } catch {
        toast.error("Failed to delete FAQ");
      }
    }
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const faq of faqs) {
        if (faq._id) {
          await axios.put(
            `${import.meta.env.VITE_NODE_URL}/api/faqs/update/${faq._id}`,
            faq,
            { withCredentials: true },
          );
        } else if (faq.question && faq.answer) {
          await axios.post(
            `${import.meta.env.VITE_NODE_URL}/api/faqs/add`,
            faq,
            { withCredentials: true },
          );
        }
      }
      toast.success("FAQs saved");
      fetchFaqs();
    } catch {
      toast.error("Failed to save FAQs");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] font-inter">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopBar title="Manage FAQs" />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-playfair text-2xl font-bold mb-6">
              Common Questions (FAQ)
            </h2>
            {isLoading ? (
              <div className="text-center py-20">Loading...</div>
            ) : (
              <div className="space-y-6">
                {faqs.map((faq, idx) => (
                  <div
                    key={faq._id || idx}
                    className="bg-white rounded-lg p-4 border border-gray-200 relative flex flex-col gap-2"
                  >
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(faq._id, idx)}
                    >
                      <Trash2 size={18} />
                    </button>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) =>
                        handleChange(idx, "question", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <label className="block text-xs font-medium text-gray-600 mb-1 mt-2">
                      Answer
                    </label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) =>
                        handleChange(idx, "answer", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-gold-accent text-white rounded hover:bg-gold-accent/90 transition-colors"
                >
                  <Plus size={18} /> Add Question
                </button>
              </div>
            )}
            <div className="mt-8 flex gap-4 justify-end">
              <button
                onClick={fetchFaqs}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-gold-accent text-white rounded-lg hover:bg-gold-accent/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <Save className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save All
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminFAQPage;

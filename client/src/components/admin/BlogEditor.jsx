import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect, useState, useRef } from "react";
import { X, Save, Upload, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

const BlogEditor = ({ blog, onSave, onCancel }) => {
  const [imagePreview, setImagePreview] = useState(blog?.image || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content: blog?.content || "",
    // FIX 3: Injecting Tailwind typography classes directly into ProseMirror
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[350px] p-6 text-charcoal-black",
      },
    },
  });

  useEffect(() => {
    if (editor && blog) {
      if (editor.getHTML() !== blog.content) {
        editor.commands.setContent(blog.content);
      }
      if (blog.image !== imagePreview) {
        setImagePreview(blog.image);
      }
    }
  }, [blog, editor]);

  // FIX 1: Bulletproof Drag & Drop prevents accidental browser redirects
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);
    return () => {
      window.removeEventListener("dragover", preventDefault);
      window.removeEventListener("drop", preventDefault);
    };
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // FIX 2: Instant UI preview without blocking the main thread
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const date =
      blog?.date ||
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });

    formData.set("date", date);
    formData.set("content", editor.getHTML());

    if (
      !fileInputRef.current?.files?.length &&
      imagePreview &&
      typeof imagePreview === "string" &&
      imagePreview.startsWith("http")
    ) {
      formData.set("image", imagePreview);
    }

    onSave(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="bg-warm-ivory rounded-[2rem] shadow-2xl p-6 md:p-10 w-full max-w-5xl mx-auto max-h-[90vh] overflow-y-auto custom-scrollbar border border-charcoal-black/5"
    >
      <div className="flex justify-between items-center mb-8 border-b border-charcoal-black/10 pb-4">
        <h2 className="text-3xl font-playfair font-bold text-charcoal-black">
          {blog ? "Edit Journal Entry" : "Create Journal Entry"}
        </h2>
        <button
          onClick={onCancel}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-charcoal-black hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-[11px] font-bold text-charcoal-black uppercase tracking-widest">
              Post Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={blog?.title}
              required
              placeholder="A beautiful autumn wedding..."
              className="w-full px-5 py-4 bg-white border border-charcoal-black/10 rounded-xl focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-playfair text-xl text-charcoal-black placeholder:text-slate-gray/40"
            />
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-charcoal-black uppercase tracking-widest">
              Featured Photography
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer min-h-[220px] overflow-hidden ${
                dragActive
                  ? "border-gold-accent bg-gold-accent/5 scale-[1.02]"
                  : "border-charcoal-black/15 bg-white hover:border-gold-accent hover:bg-gold-accent/5"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />

              {imagePreview ? (
                <div className="relative w-full h-full flex flex-col items-center group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-sm transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-charcoal-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <p className="text-xs font-bold text-white uppercase tracking-widest bg-charcoal-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                      Click to Replace
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-gray">
                  <div className="bg-warm-ivory p-4 rounded-full mb-4 shadow-sm text-gold-accent">
                    <ImageIcon size={28} strokeWidth={1.5} />
                  </div>
                  <p className="text-sm font-bold text-charcoal-black mb-1">
                    Drag & Drop Image
                  </p>
                  <p className="text-xs font-inter text-slate-gray/60">
                    High-res JPG or PNG (max. 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-8">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-charcoal-black uppercase tracking-widest">
                Category
              </label>
              <select
                name="category"
                defaultValue={blog?.category || "Weddings"}
                className="w-full px-5 py-4 bg-white border border-charcoal-black/10 rounded-xl focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-sm text-charcoal-black cursor-pointer appearance-none"
              >
                <option value="Weddings">Weddings</option>
                <option value="Portraits">Portraits</option>
                <option value="Events">Events</option>
                <option value="Travel">Travel</option>
              </select>
            </div>

            <div className="space-y-2 flex-grow">
              <label className="block text-[11px] font-bold text-charcoal-black uppercase tracking-widest">
                Excerpt (Preview Text)
              </label>
              <textarea
                name="excerpt"
                defaultValue={blog?.excerpt}
                rows={4}
                required
                placeholder="A brief summary of this beautiful story..."
                className="w-full h-[120px] px-5 py-4 bg-white border border-charcoal-black/10 rounded-xl focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all font-inter text-sm text-charcoal-black placeholder:text-slate-gray/40 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-charcoal-black uppercase tracking-widest">
            Journal Content
          </label>
          {/* Custom Editor Wrapper */}
          <div className="border border-charcoal-black/10 rounded-xl overflow-hidden bg-white text-black shadow-sm blog-editor-params">
            <RichTextEditor editor={editor} className="border-0">
              <RichTextEditor.Toolbar sticky stickyOffset={0} className="bg-warm-ivory border-b border-charcoal-black/10 p-2">
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.ClearFormatting />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.Blockquote />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                  <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>

              <RichTextEditor.Content className="bg-white min-h-[400px]" />
            </RichTextEditor>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-charcoal-black/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 border border-charcoal-black/10 rounded-xl text-charcoal-black font-bold text-xs uppercase tracking-widest hover:bg-white hover:shadow-sm transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-4 bg-charcoal-black text-gold-accent rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gold-accent hover:text-charcoal-black transition-all shadow-lg hover:-translate-y-1 flex items-center gap-2"
          >
            <Save size={16} />
            {blog ? "Update Journal" : "Publish Journal"}
          </button>
        </div>
      </form>

      {/* Scoped Styles for Mantine Override */}
      <style>{`
        .blog-editor-params .mantine-RichTextEditor-content {
            background-color: white !important;
            cursor: text !important;
        }
        .blog-editor-params .ProseMirror p.is-editor-empty:first-child::before {
            color: #94a3b8;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
        }
      `}</style>
    </motion.div>
  );
};

export default BlogEditor;
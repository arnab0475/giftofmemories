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
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

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

    // Automatically generate date if not present
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-playfair font-bold text-gray-800">
          {blog ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={blog?.title}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Image
            </label>
            <div
              className={`relative border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center transition-colors cursor-pointer min-h-[150px] ${
                dragActive
                  ? "border-[#C9A24D] bg-[#C9A24D]/10"
                  : "border-gray-300 hover:border-[#C9A24D]"
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
                <div className="relative w-full h-full flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-[200px] object-cover rounded-md shadow-sm mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    Click or Drag to replace
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <div className="bg-gray-100 p-3 rounded-full mb-2">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    SVG, PNG, JPG or GIF (max. 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              defaultValue={blog?.category || "Weddings"}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
            >
              <option value="Weddings">Weddings</option>
              <option value="Portraits">Portraits</option>
              <option value="Events">Events</option>
              <option value="Travel">Travel</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Excerpt (Short Description)
            </label>
            <textarea
              name="excerpt"
              defaultValue={blog?.excerpt}
              rows={3}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <div className="border border-gray-300 rounded-md overflow-hidden bg-white text-black text-left blog-editor-params">
            <RichTextEditor editor={editor} style={{ minHeight: "300px" }}>
              <RichTextEditor.Toolbar sticky stickyOffset={0}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.Strikethrough />
                  <RichTextEditor.ClearFormatting />
                  <RichTextEditor.Highlight />
                  <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.H3 />
                  <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Blockquote />
                  <RichTextEditor.Hr />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                  <RichTextEditor.Subscript />
                  <RichTextEditor.Superscript />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Link />
                  <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.AlignLeft />
                  <RichTextEditor.AlignCenter />
                  <RichTextEditor.AlignJustify />
                  <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>

              <RichTextEditor.Content
                className="min-h-[350px] p-4 cursor-text bg-white"
                style={{ minHeight: "350px", cursor: "text" }}
              />
            </RichTextEditor>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#C9A24D] text-white rounded-md hover:bg-[#b08d42] transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            {blog ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </form>
      <style>{`
        .blog-editor-params .mantine-RichTextEditor-content {
            min-height: 350px !important;
            background-color: white !important;
            cursor: text !important;
        }
        .blog-editor-params .ProseMirror {
            min-height: 350px !important;
            padding: 1rem !important;
            outline: none !important;
        }
        .mantine-RichTextEditor-root {
            z-index: 1;
            position: relative;
        }
      `}</style>
    </motion.div>
  );
};

export default BlogEditor;

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Share2, Check, CalendarDays } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingScreen from "../components/LoadingScreen";

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/blogs/${id}`
        );
        setPost(response.data);
      } catch (err) {
        console.error("Failed to fetch blog post", err);
        setError("Failed to load story.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
    // Scroll to top on load smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (!post || error) {
    return (
      <div className="min-h-screen bg-warm-ivory flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 bg-charcoal-black/5 rounded-full flex items-center justify-center mb-6">
          <Share2 size={32} className="text-slate-gray/50" />
        </div>
        <h2 className="font-playfair text-3xl md:text-4xl mb-3 text-charcoal-black font-bold">
          Story Not Found
        </h2>
        <p className="font-inter text-slate-gray mb-8 max-w-md">
          {error || "The article you are looking for has been moved or no longer exists."}
        </p>
        <Link
          to="/blog"
          className="px-8 py-3.5 bg-charcoal-black text-gold-accent uppercase tracking-widest text-[10px] font-bold rounded-xl hover:bg-gold-accent hover:text-charcoal-black transition-all shadow-lg"
        >
          Return to Journal
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-warm-ivory/30 overflow-x-hidden">
      
      {/* ---------------- EDITORIAL HERO IMAGE ---------------- */}
      <div className="h-[45vh] md:h-[60vh] min-h-[350px] w-full relative overflow-hidden">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {/* Elegant gradient overlay for text contrast if needed, mostly for aesthetics here */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/40 via-transparent to-charcoal-black/60" />
      </div>

      {/* ---------------- MAIN CONTENT WRAPPER ---------------- */}
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl -mt-20 md:-mt-32 relative z-10 pb-24">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white p-6 sm:p-10 md:p-16 shadow-2xl rounded-[2rem] md:rounded-[3rem] border border-charcoal-black/5"
        >
          
          {/* META HEADER */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-12 border-b border-charcoal-black/5 pb-6">
            <Link
              to="/blog"
              className="group flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-gray hover:text-gold-accent transition-colors w-fit"
            >
              <div className="w-8 h-8 rounded-full bg-warm-ivory flex items-center justify-center group-hover:bg-gold-accent/10 transition-colors">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
              Back to Journal
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-gray">
              <span className="bg-gold-accent/10 text-gold-accent px-3 py-1.5 rounded-lg">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> {post.date || "Recent"}
              </span>
            </div>
          </div>

          {/* ARTICLE TITLE */}
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-charcoal-black mb-8 md:mb-12 leading-[1.15] font-bold">
            {post.title}
          </h1>

          {/* ARTICLE HTML CONTENT */}
          {/* FIX: break-words and overflow-wrap-anywhere guarantees mobile responsiveness */}
          <div
            className="
              prose prose-sm sm:prose-base md:prose-lg max-w-none font-inter text-charcoal-black/80 
              prose-headings:font-playfair prose-headings:text-charcoal-black prose-headings:font-bold 
              prose-a:text-gold-accent hover:prose-a:text-gold-accent/80 prose-a:transition-colors
              prose-img:rounded-2xl prose-img:shadow-md prose-img:w-full prose-img:my-8
              prose-blockquote:border-l-gold-accent prose-blockquote:bg-warm-ivory/30 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
              break-words overflow-wrap-anywhere
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ---------------- SHARE FOOTER ---------------- */}
          <div className="mt-16 md:mt-20 pt-8 border-t border-charcoal-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="block font-playfair text-xl md:text-2xl text-charcoal-black font-bold mb-1">
                Share this story
              </span>
              <p className="text-xs text-slate-gray font-inter">Inspired by this post? Pass it along.</p>
            </div>
            
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  toast.success("Link copied to clipboard!");
                  setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                  toast.error("Failed to copy link");
                }
              }}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                copied
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-white border border-charcoal-black/10 text-charcoal-black hover:bg-warm-ivory shadow-sm"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Link Copied
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-gold-accent" /> Copy Link
                </>
              )}
            </button>
          </div>
          
        </motion.div>
      </div>

    </article>
  );
};

export default BlogPostPage;
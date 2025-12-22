import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";

const BlogPostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/api/blogs/${id}`
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
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <LoadingScreen />;

  if (!post) {
    return (
      <div className="min-h-screen bg-warm-ivory flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-playfair text-3xl mb-4 text-charcoal-black">
          Post Not Found
        </h2>
        <p className="font-inter text-gray-500 mb-6">
          The article you are looking for does not exist.
        </p>
        <Link
          to="/blog"
          className="px-6 py-2 bg-charcoal-black text-warm-ivory uppercase tracking-widest text-sm hover:bg-gold-accent hover:text-charcoal-black transition-colors"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-warm-ivory">
      {/* Article Header Image */}
      <div className="h-[50vh] min-h-[400px] w-full relative overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="container mx-auto px-6 max-w-4xl -mt-24 relative z-10">
        {/* Article Meta Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 shadow-lg rounded-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-6">
            <Link
              to="/blog"
              className="group flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400 hover:text-gold-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              <span className="text-gold-accent">{post.category}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {post.date}
              </span>
            </div>
          </div>

          <h1 className="font-playfair text-3xl md:text-5xl text-charcoal-black mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none font-inter text-charcoal-black/80 prose-headings:font-playfair prose-headings:text-charcoal-black prose-a:text-gold-accent hover:prose-a:text-gold-accent/80"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <span className="font-playfair text-lg text-charcoal-black italic">
              Share this story
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="p-3 rounded-full hover:bg-gray-100 text-charcoal-black transition-colors"
              title="Copy Link"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="h-20" />
    </article>
  );
};

export default BlogPostPage;

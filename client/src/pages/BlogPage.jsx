import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";

// Static categories for now, or fetch if dynamic later
const categories = [
  "All Posts",
  "Weddings",
  "Portraits",
  "Events",
  "Inspiration",
];

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("VITE_NODE_URL/api/blogs");
        setPosts(response.data);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
        setError("Failed to load stories.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts =
    activeCategory === "All Posts"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  // Featured post logic: Pick the latest "Featured Story" or just the first post
  const featuredPost =
    posts.find((p) => p.category === "Featured Story") || posts[0];

  // Filter out the featured post from the main grid if displaying it separately
  const gridPosts = filteredPosts.filter((p) => p._id !== featuredPost?._id);

  if (loading) return <LoadingScreen />;
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-warm-ivory">
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <motion.div
          initial="initial"
          whileHover="hover"
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          <motion.img
            variants={{
              initial: { scale: 1, opacity: 0.8 },
              hover: {
                scale: 1.1,
                opacity: 1,
                transition: { duration: 0.5, ease: "easeInOut" },
              },
            }}
            src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=2000"
            alt="Photography Services"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black/60 to-charcoal-black/80" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-playfair text-4xl md:text-5xl lg:text-6xl text-warm-ivory mb-4 font-bold tracking-tight"
            >
              Stories from the Lens
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-inter text-lg text-muted-beige mb-6 font-light"
            >
              Photography tips, behind-the-scenes moments, and inspiration for
              your next shoot.
            </motion.p>

            {/* Breadcrumbs */}
            <div className="flex items-center justify-center space-x-2 text-sm font-inter uppercase tracking-widest text-warm-ivory/60">
              <Link to="/" className="hover:text-gold-accent transition-colors">
                Gift of memories
              </Link>
              <span className="text-gold-accent">•</span>
              <span className="text-warm-ivory">Blogs</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 font-inter text-sm uppercase tracking-wide ${
                  activeCategory === category
                    ? "bg-gold-accent border-gold-accent text-white"
                    : "border-charcoal-black/20 text-charcoal-black/60 hover:border-gold-accent hover:text-gold-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-20">
        {/* Featured Story */}
        {activeCategory === "All Posts" && featuredPost && (
          <Link to={`/blog/${featuredPost._id}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row group cursor-pointer"
            >
              <div className="md:w-1/2 h-[300px] md:h-auto overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-gold-accent text-xs font-bold uppercase tracking-widest">
                    ★ {featuredPost.category}
                  </span>
                </div>
                <h2 className="font-playfair text-3xl md:text-4xl text-charcoal-black mb-4 group-hover:text-gold-accent transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="font-inter text-charcoal-black/70 mb-8 leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center text-charcoal-black font-medium group-hover:text-gold-accent transition-colors">
                  <span className="uppercase tracking-widest text-sm border-b border-charcoal-black group-hover:border-gold-accent pb-1">
                    Read Full Article
                  </span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeCategory === "All Posts" ? gridPosts : filteredPosts).map(
            (post, index) => (
              <Link key={post._id} to={`/blog/${post._id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider text-charcoal-black rounded-sm">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-gray-400 mb-3 font-inter uppercase tracking-wide">
                      {post.date}
                    </div>
                    <h3 className="font-playfair text-xl text-charcoal-black mb-3 group-hover:text-gold-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-inter text-sm text-gray-500 mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-charcoal-black font-medium text-sm group-hover:text-gold-accent transition-colors">
                      <span className="border-b border-charcoal-black/30 group-hover:border-gold-accent pb-0.5">
                        Read Story
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <section className="bg-charcoal-black py-20 px-6">
        <div className="container mx-auto text-center max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-4xl text-warm-ivory mb-6"
          >
            Join Our Creative Community
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-inter text-gray-400 mb-8 font-light"
          >
            Get the latest photography tips, workshop announcements, and club
            news delivered to your inbox.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-white/5 border border-white/10 px-6 py-3 text-warm-ivory placeholder:text-gray-500 focus:outline-none focus:border-gold-accent transition-colors rounded-sm"
            />
            <button
              type="submit"
              className="bg-gold-accent text-charcoal-black px-8 py-3 font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300 rounded-sm"
            >
              Subscribe
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;

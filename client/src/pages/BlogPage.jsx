import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
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
  const [heroData, setHeroData] = useState({
    title: "Stories from the Lens",
    description: "Photography tips, behind-the-scenes moments, and inspiration for your next shoot.",
    breadcrumb: "Gift of memories • Journal",
    backgroundImage: "",
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_NODE_URL}/api/page-hero/get/blog`);
        if (response.data) setHeroData(response.data);
      } catch (error) {
        console.error("Error fetching blog hero:", error);
      }
    };
    fetchHeroData();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_NODE_URL}/api/blogs`);
        setPosts(response.data);
      } catch (err) {
        setError("Failed to load journal entries.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = activeCategory === "All Posts"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  // Featured post logic: Pick the latest "Featured Story" or just the first post
  const featuredPost = posts.find((p) => p.category === "Featured Story") || posts[0];
  const gridPosts = filteredPosts.filter((p) => p._id !== featuredPost?._id);

  if (loading) return <LoadingScreen />;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 font-inter font-bold">{error}</div>;

  const breadcrumbParts = heroData.breadcrumb?.split("•") || ["Gift of memories", "Journal"];

  return (
    <div className="min-h-screen bg-warm-ivory/30">
      
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative h-[45vh] md:h-[55vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <motion.div initial="initial" animate="initial" whileHover="hover" className="absolute inset-0 w-full h-full">
          <motion.img
            variants={{
              initial: { scale: 1.05 },
              hover: { scale: 1.1, transition: { duration: 8, ease: "linear" } },
            }}
            src={heroData.backgroundImage || "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=100&w=2880"}
            alt="Photography Journal"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-charcoal-black/70" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16 md:mt-0">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center space-x-2 text-[10px] md:text-xs font-inter uppercase tracking-widest text-warm-ivory/70 mb-4 md:mb-6">
              <Link to="/" className="hover:text-gold-accent transition-colors">
                {breadcrumbParts[0]?.trim()}
              </Link>
              <span className="text-gold-accent">•</span>
              <span className="text-warm-ivory">
                {breadcrumbParts[1]?.trim()}
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-playfair text-4xl md:text-5xl lg:text-6xl text-warm-ivory mb-4 md:mb-6 font-bold tracking-tight leading-tight"
            >
              {heroData.title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-inter text-sm md:text-lg text-warm-ivory/80 max-w-2xl mx-auto font-light leading-relaxed"
            >
              {heroData.description}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ---------------- FILTER TABS ---------------- */}
      <section className="sticky top-20 md:top-24 z-40 bg-warm-ivory/80 backdrop-blur-xl border-b border-charcoal-black/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex overflow-x-auto custom-scrollbar pb-2 md:pb-0 gap-2 md:gap-4 md:justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full transition-all duration-300 font-inter text-[10px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-charcoal-black border-charcoal-black text-gold-accent shadow-md"
                    : "bg-white border border-charcoal-black/10 text-slate-gray hover:border-gold-accent hover:text-charcoal-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        
        {/* ---------------- FEATURED POST ---------------- */}
        {activeCategory === "All Posts" && featuredPost && (
          <Link to={`/blog/${featuredPost._id}`} className="block mb-16 md:mb-24 group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-md flex flex-col lg:flex-row border border-charcoal-black/5 transition-all duration-500 hover:shadow-xl"
            >
              {/* Featured Image - Responsive Height */}
              <div className="lg:w-3/5 h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden relative">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Featured Content */}
              <div className="lg:w-2/5 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-gold-accent/10 text-gold-accent px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                    Featured Article
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-gray flex items-center gap-1.5">
                    <CalendarDays size={12} /> {featuredPost.date || "Recent"}
                  </span>
                </div>
                
                <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal-black mb-6 leading-tight group-hover:text-gold-accent transition-colors duration-300">
                  {featuredPost.title}
                </h2>
                
                <p className="font-inter text-slate-gray mb-10 leading-relaxed text-sm md:text-base line-clamp-3 md:line-clamp-4">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center text-charcoal-black font-bold uppercase tracking-widest text-[11px] mt-auto">
                  <span className="border-b-2 border-gold-accent pb-1 group-hover:pr-2 transition-all">
                    Read the Journal
                  </span>
                  <ArrowRight className="ml-2 w-4 h-4 text-gold-accent transform group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        {/* ---------------- STANDARD BLOG GRID ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {(activeCategory === "All Posts" ? gridPosts : filteredPosts).map(
            (post, index) => (
              <Link key={post._id} to={`/blog/${post._id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-charcoal-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
                >
                  {/* Grid Image */}
                  <div className="h-56 md:h-64 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-charcoal-black rounded-lg shadow-sm">
                      {post.category}
                    </div>
                  </div>
                  
                  {/* Grid Content */}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[10px] text-slate-gray mb-4 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><CalendarDays size={12} /> {post.date || "Recent"}</span>
                      {post.readTime && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gold-accent" />
                          <span className="flex items-center gap-1.5"><Clock size={12} /> {post.readTime}</span>
                        </>
                      )}
                    </div>
                    
                    <h3 className="font-playfair text-xl md:text-2xl font-bold text-charcoal-black mb-3 leading-tight group-hover:text-gold-accent transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="font-inter text-xs md:text-sm text-slate-gray mb-6 line-clamp-3 leading-relaxed flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center text-charcoal-black font-bold uppercase tracking-widest text-[10px] mt-auto">
                      <span className="border-b border-charcoal-black/30 group-hover:border-gold-accent pb-1 transition-colors">
                        Read Story
                      </span>
                      <ArrowRight className="ml-1.5 w-3.5 h-3.5 text-gold-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            )
          )}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[2rem] border border-dashed border-charcoal-black/10">
            <h3 className="font-playfair text-2xl text-charcoal-black font-bold mb-2">No Stories Found</h3>
            <p className="text-slate-gray">Check back soon for new articles in the "{activeCategory}" category.</p>
            <button 
              onClick={() => setActiveCategory("All Posts")}
              className="mt-6 px-6 py-3 bg-charcoal-black text-gold-accent text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gold-accent hover:text-charcoal-black transition-colors"
            >
              View All Posts
            </button>
          </div>
        )}
      </main>

      {/* ---------------- NEWSLETTER SECTION ---------------- */}
      <section className="bg-charcoal-black py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_#C9A24D_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto text-center max-w-2xl relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-warm-ivory mb-6"
          >
            Join Our Creative Journal
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-inter text-sm md:text-base text-warm-ivory/60 mb-10 font-light leading-relaxed max-w-lg mx-auto"
          >
            Get the latest photography tips, workshop announcements, and exclusive studio news delivered directly to your inbox.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed successfully!"); }}
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-warm-ivory placeholder:text-warm-ivory/30 focus:outline-none focus:border-gold-accent focus:ring-1 focus:ring-gold-accent transition-all rounded-xl text-sm"
            />
            <button
              type="submit"
              className="bg-gold-accent text-charcoal-black px-8 py-4 font-bold text-[11px] uppercase tracking-widest hover:bg-white transition-colors duration-300 rounded-xl shadow-lg"
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
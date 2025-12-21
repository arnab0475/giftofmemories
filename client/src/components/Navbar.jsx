import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { servicesData } from "../data/servicesData";
import { useRef } from "react";
import logo from "../assets/images/logo-negative-gom.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  const location = useLocation();
  const isServiceDetails =
    location.pathname.startsWith("/services/") &&
    location.pathname !== "/services";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search Logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = servicesData.filter(
      (service) =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/gallery" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search - you can navigate to a search results page or filter content
      console.log("Searching for:", searchQuery);
      // Example: navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-warm-ivory/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
      style={
        !isScrolled && !isServiceDetails
          ? { textShadow: "0 1px 8px rgba(0,0,0,0.25)" }
          : {}
      }
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className={`font-playfair text-2xl md:text-3xl font-bold tracking-tighter transition-colors duration-300 flex items-center gap-3 ${
            !isScrolled && !isServiceDetails
              ? "text-warm-ivory"
              : "text-charcoal-black"
          }`}
        >
          <img
            src={logo}
            alt="Gift of Memories"
            className="h-10 md:h-12 w-auto object-contain"
          />
          <span className="leading-none">
            Gift of Memories<span className="text-gold-accent">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`font-inter text-sm uppercase tracking-widest transition-colors duration-300 ${
                location.pathname === link.path
                  ? "text-gold-accent"
                  : !isScrolled && !isServiceDetails
                  ? "text-warm-ivory/90 hover:text-gold-accent"
                  : "text-charcoal-black/80 hover:text-gold-accent"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Search Bar */}
          <div className="relative" ref={searchRef}>
            {isSearchOpen ? (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "300px" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center bg-white/10 backdrop-blur-md rounded-full border border-gold-accent/50 overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-2 bg-transparent focus:outline-none text-sm placeholder-gray-400 ${
                    !isScrolled && !isServiceDetails
                      ? "text-warm-ivory"
                      : "text-charcoal-black"
                  }`}
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="px-3 text-gold-accent hover:text-gold-accent/80"
                >
                  <X size={18} />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`transition-colors duration-300 ${
                  !isScrolled && !isServiceDetails
                    ? "text-warm-ivory/90 hover:text-gold-accent"
                    : "text-charcoal-black/80 hover:text-gold-accent"
                }`}
              >
                <Search size={22} />
              </button>
            )}

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {isSearchOpen && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-4 w-80 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100"
                >
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      <h3 className="px-4 py-2 text-xs font-inter uppercase tracking-widest text-gray-400 border-b border-gray-100 mb-1">
                        Services Found
                      </h3>
                      {searchResults.map((service) => (
                        <Link
                          key={service.id}
                          to={`/services/${service.id}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors group"
                        >
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-12 h-12 object-cover rounded-md mr-3 group-hover:opacity-80 transition-opacity"
                          />
                          <div>
                            <p className="font-playfair font-medium text-charcoal-black group-hover:text-gold-accent transition-colors">
                              {service.title}
                            </p>
                            <p className="text-xs text-gray-500 font-inter truncate w-48">
                              {service.category}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500 font-inter text-sm">
                      No services found matching "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/contact"
            className={`px-6 py-2.5 font-inter text-sm uppercase tracking-widest transition-colors duration-300 ${
              !isScrolled && !isServiceDetails
                ? "bg-gold-accent text-charcoal-black hover:bg-warm-ivory hover:text-gold-accent border border-warm-ivory"
                : "bg-charcoal-black text-warm-ivory hover:bg-gold-accent hover:text-charcoal-black"
            }`}
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center md:hidden gap-4">
          {/* Mobile Search Icon */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)} // Simple toggle for now, ideally opens a search modal
            className={`transition-colors duration-300 ${
              !isScrolled && !isServiceDetails
                ? "text-warm-ivory/90 hover:text-gold-accent"
                : "text-charcoal-black/80 hover:text-gold-accent"
            }`}
          >
            <Search size={24} />
          </button>

          <button
            className={`text-charcoal-black focus:outline-none ${
              !isScrolled && !isServiceDetails
                ? "text-warm-ivory"
                : "text-charcoal-black"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-warm-ivory flex flex-col items-center justify-center space-y-8 overflow-hidden"
          >
            {/* Mobile Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center rounded-full overflow-hidden bg-charcoal-black/5 border border-charcoal-black/10 focus-within:border-gold-accent/50 w-4/5 max-w-xs"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-3 bg-transparent text-base font-inter text-charcoal-black placeholder:text-charcoal-black/50 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-3 text-charcoal-black/60 hover:text-gold-accent transition-colors"
              >
                <Search size={20} />
              </button>
            </form>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-playfair text-3xl text-charcoal-black hover:text-gold-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="mt-4 px-8 py-3 bg-charcoal-black text-warm-ivory font-inter text-lg uppercase tracking-widest"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Overlay separate from menu if needed, or integrated. 
           For now, let's keep it simple: if search is open on mobile, maybe show a full screen or top bar search. 
           But since I put the search icon next to the menu, I should probably handle mobile search UI too. 
           Let's refine the mobile part in a subsequent step if it gets too complex here. 
           Actually, the easiest way for mobile is to just show an input when clicking the icon in the navbar itself or in the menu.
           Let's just use the same `isSearchOpen` state but maybe render differently for mobile?
           
           Wait, I used the same ref and state. On mobile, `hidden md:flex` hides the desktop search.
           The `Mobile Search Icon` I added above will toggle it. 
           I need a place to show the input on mobile.
           Let's add a mobile specific search bar below the logo/menu/search row when active.
       */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 w-full bg-white p-4 shadow-lg border-t border-gray-100"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gold-accent text-charcoal-black"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Results */}
            {searchQuery && (
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-xs font-inter uppercase tracking-widest text-gray-400 mb-2">
                      Matches
                    </h3>
                    {searchResults.map((service) => (
                      <Link
                        key={service.id}
                        to={`/services/${service.id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setIsMobileMenuOpen(false); // also close menu if open
                          setSearchQuery("");
                        }}
                        className="flex items-center p-2 mb-2 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-10 h-10 object-cover rounded-md mr-3"
                        />
                        <div>
                          <p className="font-playfair font-medium text-charcoal-black text-sm">
                            {service.title}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No results for "{searchQuery}"
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

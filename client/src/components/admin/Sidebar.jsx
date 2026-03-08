import {
  LayoutDashboard,
  Layers,
  Image,
  Users,
  Bell,
  MessageSquare,
  Settings,
  Aperture,
  TvMinimalPlay,
  Bot,
  MessageCircle,
  FileText,
  ShoppingBag,
  Star,
  BookOpen,
  Calendar,
  Video,
  Package,
  LogOut,
  X // Added for mobile close
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// FIX 1: Added isOpen and onClose props for mobile responsiveness
const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/dashboard" && location.pathname.startsWith(path));

  // FIX 2: Abstracted the logout logic out of the JSX
  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_NODE_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/admin-portal-secret");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuGroups = [
    {
      title: "Dashboard",
      items: [{ icon: LayoutDashboard, label: "Overview", path: "/dashboard" }],
    },
    {
      title: "Bookings",
      items: [{ icon: Calendar, label: "Bookings", path: "/admin-enquiries" }],
    },
    {
      title: "Management",
      items: [
        { icon: Layers, label: "Services", path: "/admin-services" },
        { icon: Image, label: "Gallery", path: "/admin-gallery" },
        { icon: ShoppingBag, label: "Shop", path: "/admin-shop" },
        { icon: Package, label: "Product Collections", path: "/admin-product-collections" },
        { icon: FileText, label: "Blogs", path: "/admin-blogs" },
        { icon: BookOpen, label: "About Page", path: "/admin-about" },
        { icon: Users, label: "Users", path: "/admin-users" },
        { icon: Star, label: "Testimonials", path: "/admin-testimonials" },
        { icon: TvMinimalPlay, label: "Hero Banner", path: "/admin-hero" },
        { icon: Bell, label: "Popups", path: "/admin-popups" },
        { icon: Settings, label: "Homepage Settings", path: "/admin-homepage-settings" },
        { icon: Image, label: "Page Heroes", path: "/admin-page-heroes" },
        { icon: Layers, label: "Homepage Gallery", path: "/admin-homepage-gallery" },
        { icon: Video, label: "Page Videos", path: "/admin-page-videos" },
        { icon: MessageSquare, label: "FAQs", path: "/admin-faqs" },
      ],
    },
    {
      title: "Automation",
      items: [
        { icon: Bot, label: "Chatbot", path: "/admin-chatbot" },
        { icon: MessageCircle, label: "WhatsApp Reminders", path: "/admin-bookings" },
      ],
    },
    {
      title: "Data",
      items: [{ icon: FileText, label: "Reports", path: "/admin-reports" }],
    },
  ];

  return (
    <>
      {/* Mobile Overlay Background */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-charcoal-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* FIX 3: Replaced Hex codes with Semantic Tailwind Variables */}
      <aside 
        className={`w-[260px] bg-charcoal-black flex-shrink-0 fixed h-full flex flex-col overflow-y-auto border-r border-white/5 font-inter z-50 transition-transform duration-300 ease-in-out no-scrollbar ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 pb-2 flex justify-between items-center sticky top-0 bg-charcoal-black/95 backdrop-blur-sm z-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Aperture className="text-gold-accent" size={24} strokeWidth={1.5} />
              <h1 className="font-playfair text-xl text-warm-ivory font-semibold tracking-wide">
                Gift of Memories
              </h1>
            </div>
            <p className="text-slate-gray text-[10px] font-bold pl-9 uppercase tracking-[0.2em]">
              Admin Workspace
            </p>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="md:hidden text-slate-gray hover:text-warm-ivory transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-6 px-4 space-y-8">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.title !== "Dashboard" && (
                <h3 className="text-slate-gray/60 text-[10px] font-bold uppercase tracking-[0.2em] px-4 mb-4">
                  {group.title}
                </h3>
              )}

              <div className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      onClick={() => window.innerWidth < 768 && onClose?.()} // Auto-close on mobile click
                      className="block relative group"
                    >
                      {active && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-gold-accent rounded-r-full shadow-[0_0_10px_rgba(201,162,77,0.5)]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}

                      <div
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all duration-300 ${
                          active
                            ? "text-gold-accent bg-white/5"
                            : "text-slate-gray hover:text-warm-ivory hover:bg-white/5 hover:pl-5"
                        }`}
                      >
                        <item.icon
                          size={18}
                          strokeWidth={active ? 2 : 1.5}
                          className={`${
                            active
                              ? "text-gold-accent"
                              : "text-slate-gray group-hover:text-warm-ivory"
                          }`}
                        />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sticky Logout Button at Bottom */}
        <div className="p-4 mt-auto sticky bottom-0 bg-charcoal-black border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all duration-300 text-red-400 hover:bg-red-400/10 hover:text-red-300 text-left"
          >
            <LogOut size={18} strokeWidth={1.5} />
            Secure Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
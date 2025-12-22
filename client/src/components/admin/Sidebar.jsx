import {
  LayoutDashboard,
  Layers,
  Image,
  Users,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Aperture,
  TvMinimalPlay,
  Bot,
  MessageCircle,
  FileText,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) =>
    location.pathname === path ||
    (path !== "/dashboard" && location.pathname.startsWith(path));

  const menuGroups = [
    {
      title: "Dashboard",
      items: [{ icon: LayoutDashboard, label: "Overview", path: "/dashboard" }],
    },
    {
      title: "Management",
      items: [
        { icon: Layers, label: "Services", path: "/admin-services" },
        { icon: Image, label: "Gallery", path: "/admin-gallery" },
        { icon: FileText, label: "Blogs", path: "/admin-blogs" },
        { icon: Users, label: "Testimonials", path: "/admin-testimonials" },
        { icon: TvMinimalPlay, label: "Hero Banner", path: "/admin-hero" },
        { icon: Bell, label: "Popups", path: "/admin-popups" },
      ],
    },
    {
      title: "Automation",
      items: [
        { icon: Bot, label: "Chatbot", path: "/admin-chatbot" },
        {
          icon: MessageCircle,
          label: "WhatsApp Reminders",
          path: "/admin-whatsapp",
        },
      ],
    },
    {
      title: "Data",
      items: [
        { icon: MessageSquare, label: "Enquiries", path: "/admin-enquiries" },
        { icon: FileText, label: "Reports", path: "/admin-reports" },
      ],
    },
    {
      title: "System",
      items: [
        { icon: Settings, label: "Settings", path: "/admin-settings" },
        {
          icon: LogOut,
          label: "Logout",
          path: "/admin-portal-secret",
          isDanger: true,
        },
      ],
    },
  ];

  return (
    <aside className="w-[260px] bg-[#0F0F0F] flex-shrink-0 fixed h-full flex flex-col overflow-y-auto border-r border-[#2B2B2B]/20 font-inter z-50 transition-all duration-300 no-scrollbar">
      <div className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <Aperture className="text-[#C9A24D]" size={24} strokeWidth={1.5} />
          <h1 className="font-playfair text-xl text-[#FAF9F6] font-semibold tracking-wide">
            Gift of Memories
          </h1>
        </div>
        <p className="text-[#2B2B2B] text-xs font-medium pl-9 uppercase tracking-wider">
          Admin Panel
        </p>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-6 px-4 space-y-8">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.title !== "Dashboard" && (
              <h3 className="text-[#2B2B2B] text-[11px] font-bold uppercase tracking-widest px-4 mb-3">
                {group.title}
              </h3>
            )}

            <div className="space-y-1">
              {group.items.map((item, itemIndex) => {
                const active = isActive(item.path);

                if (item.label === "Logout") {
                  return (
                    <button
                      key={itemIndex}
                      onClick={async () => {
                        try {
                          await fetch(
                            "http://localhost:4000/api/admin/logout",
                            {
                              method: "POST",
                              credentials: "include",
                            }
                          );
                          navigate("/admin-portal-secret");
                        } catch (error) {
                          console.error("Logout failed:", error);
                        }
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200
                        text-[#E74C3C] hover:bg-[#E74C3C]/10 text-left cursor-pointer
                      `}
                    >
                      <item.icon
                        size={18}
                        strokeWidth={1.5}
                        className="text-[#E74C3C]"
                      />
                      {item.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={itemIndex}
                    to={item.path}
                    className="block relative group"
                  >
                    {active && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#C9A24D] rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}

                    <div
                      className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200
                      ${
                        active
                          ? "text-[#C9A24D] bg-[#1A1A1A]"
                          : "text-[#EDE6DB]/80 hover:text-[#FAF9F6] hover:bg-[#2B2B2B]/30 hover:pl-5"
                      }
                    `}
                    >
                      <item.icon
                        size={18}
                        strokeWidth={1.5}
                        className={`${
                          active
                            ? "text-[#C9A24D]"
                            : "text-[#7A7A7A] group-hover:text-[#EDE6DB]"
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
    </aside>
  );
};

export default Sidebar;

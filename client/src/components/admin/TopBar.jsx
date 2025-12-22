import {
  ChevronDown,
  User,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const [admin, setAdmin] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_NODE_URL}/api/admin/verify`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data?.admin) {
          setAdmin(data.admin);
        }
      } catch (err) {
        // ignore
      }
    };
    fetchAdmin();
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_NODE_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/admin-portal-secret");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="h-16 bg-warm-ivory border-b border-muted-beige flex items-center justify-between px-8 sticky top-0 z-40">
      <div>
        <h2 className="font-playfair text-xl font-semibold text-charcoal-black">
          Dashboard Overview
        </h2>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((s) => !s)}
          className="flex items-center gap-3 cursor-pointer group hover:bg-muted-beige/50 p-2 rounded-lg transition-colors"
          aria-haspopup="menu"
          aria-expanded={showMenu}
        >
          <div className="w-8 h-8 rounded-full bg-[#C9A24D] flex items-center justify-center text-white shadow-sm overflow-hidden">
            <User size={16} />
          </div>

          <div className="flex flex-col text-right hidden md:block">
            <span className="text-[13px] font-medium text-charcoal-black leading-none">
              {admin?.name || admin?.email || "Admin User"}
            </span>
          </div>

          <ChevronDown
            size={14}
            className="text-slate-gray/50 group-hover:text-[#C9A24D] transition-colors"
          />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-lg z-50 overflow-hidden">
            <div className="p-3 border-b">
              <div className="text-xs text-slate-gray/60">Signed in as</div>
              <div className="font-medium text-sm">
                {admin?.email || admin?.name}
              </div>
            </div>

            <button
              onClick={() => {
                setShowMenu(false);
                navigate("/admin-settings");
              }}
              className="w-full text-left p-3 hover:bg-slate-50 flex items-center gap-2"
            >
              <SettingsIcon size={16} className="text-slate-gray/60" />
              <span className="text-sm">Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left p-3 hover:bg-slate-50 flex items-center gap-2 text-error-red"
            >
              <LogOut size={16} className="text-error-red" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;

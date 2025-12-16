import { ChevronDown, User } from "lucide-react";

const TopBar = () => {
  return (
    <header className="h-[64px] bg-[#FAF9F6] border-b border-[#EDE6DB] flex items-center justify-between px-8 sticky top-0 z-40">
      <div>
        <h2 className="font-playfair text-xl font-semibold text-[#0F0F0F]">
          Dashboard Overview
        </h2>
      </div>

      <div className="flex items-center gap-3 cursor-pointer group hover:bg-[#EDE6DB]/50 p-2 rounded-lg transition-colors">
        <div className="w-8 h-8 rounded-full bg-[#C9A24D] flex items-center justify-center text-white shadow-sm overflow-hidden">
          <User size={16} />
        </div>

        <div className="flex flex-col text-right hidden md:block">
          <span className="text-[13px] font-medium text-[#0F0F0F] leading-none">
            Admin User
          </span>
        </div>

        <ChevronDown
          size={14}
          className="text-[#2B2B2B]/50 group-hover:text-[#C9A24D] transition-colors"
        />
      </div>
    </header>
  );
};

export default TopBar;

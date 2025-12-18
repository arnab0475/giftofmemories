"use client";
import React from "react";
import { MessageCircle, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { IconBrandWhatsapp } from "@tabler/icons-react";

const FloatingChatButtons = () => {
  const whatsappNumber = "911234567890";
  const whatsappMessage = encodeURIComponent(
    "Hi, I'm interested in your photography services!"
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-center">
      
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 bg-charcoal-black text-gold-accent rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow border border-gold-accent/60 cursor-pointer"
        onClick={() => console.log("Toggle Chatbot")}
        aria-label="Open Chatbot"
      >
        <Bot size={24} strokeWidth={1.5} />
      </motion.button>

      {/* WhatsApp Button */}
      <motion.a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Chat on WhatsApp"
      >
        <IconBrandWhatsapp size={30} strokeWidth={2} />
      </motion.a>
    </div>
  );
};

export default FloatingChatButtons;

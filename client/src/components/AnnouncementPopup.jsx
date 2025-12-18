"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import axios from "axios";

const AnnouncementPopup = () => {
  const [popupData, setPopupData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_NODE_URL}/api/pop/popup`
        );
        const data = response.data;

        if (data && data._id) {
          // Check if this specific popup has been seen in this session
          const seenPopup = sessionStorage.getItem(`popup_seen_${data._id}`);

          if (!data.image && !data.message) {
            data.message =
              "Welcome! This is a placeholder for your announcement. Please update it in the Admin Panel.";
          }

          setPopupData(data);
          // Wait for the specified delay before showing
          setTimeout(() => {
            console.log("Showing popup now");
            setIsVisible(true);
          }, data.delay || 3000);
          // }
        }
      } catch (error) {
        console.error("Failed to fetch popup:", error);
      }
    };

    fetchPopup();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    if (popupData?._id) {
      sessionStorage.setItem(`popup_seen_${popupData._id}`, "true");
    }
  };

  if (!isVisible || !popupData) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-[600px] overflow-hidden rounded-xl shadow-2xl"
          >
            {/* Close Button - positioned absolutely on top of everything */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white/90 hover:text-white transition-all duration-300 z-50 border border-white/10"
              aria-label="Close popup"
            >
              <X size={20} />
            </button>

            {/* Clickable Container if link exists, otherwise just a div */}
            {popupData.link ? (
              <a
                href={popupData.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative cursor-pointer"
              >
                <PopupContent data={popupData} />
              </a>
            ) : (
              <div className="relative">
                <PopupContent data={popupData} />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const PopupContent = ({ data }) => (
  <>
    {data.image ? (
      <img
        src={data.image}
        alt="Announcement"
        className="w-full h-auto max-h-[80vh] object-cover"
      />
    ) : (
      // Fallback if no image, keep it looking nice
      <div className="w-full h-64 bg-warm-ivory flex items-center justify-center">
        <p className="text-gray-400">No Image</p>
      </div>
    )}

    {/* Text Overlay - Only shows if there is a message */}
    {data.message && (
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-8 px-8">
        <p className="text-white font-playfair text-xl md:text-2xl font-medium leading-relaxed tracking-tight drop-shadow-md">
          {data.message}
        </p>

        {/* Visual indicator that it's clickable (if linked) */}
        {data.link && (
          <div className="mt-4 flex items-center gap-2 text-gold-accent text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span>Learn More</span>
            <ExternalLink size={14} />
          </div>
        )}
      </div>
    )}
  </>
);

export default AnnouncementPopup;

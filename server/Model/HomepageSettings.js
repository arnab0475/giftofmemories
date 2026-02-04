import mongoose from "mongoose";

const HomepageSettingsSchema = new mongoose.Schema(
  {
    showProducts: {
      type: Boolean,
      default: true,
    },
    showServices: {
      type: Boolean,
      default: true,
    },
    showGallery: {
      type: Boolean,
      default: true,
    },
    showTestimonials: {
      type: Boolean,
      default: true,
    },
    showScrollGallery: {
      type: Boolean,
      default: true,
    },
    showStackedGallery: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const HomepageSettings = mongoose.model(
  "HomepageSettings",
  HomepageSettingsSchema,
);

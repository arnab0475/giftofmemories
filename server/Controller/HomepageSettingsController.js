import { HomepageSettings } from "../Model/HomepageSettings.js";

// Get homepage settings (public)
export const getHomepageSettings = async (req, res) => {
  try {
    let settings = await HomepageSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await HomepageSettings.create({
        showProducts: true,
        showServices: true,
        showGallery: true,
        showTestimonials: true,
        showScrollGallery: true,
        showStackedGallery: true,
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update homepage settings (admin only)
export const updateHomepageSettings = async (req, res) => {
  try {
    const {
      showProducts,
      showServices,
      showGallery,
      showTestimonials,
      showScrollGallery,
      showStackedGallery,
    } = req.body;

    let settings = await HomepageSettings.findOne();

    if (!settings) {
      settings = new HomepageSettings({
        showProducts,
        showServices,
        showGallery,
        showTestimonials,
        showScrollGallery,
        showStackedGallery,
      });
    } else {
      if (typeof showProducts === "boolean")
        settings.showProducts = showProducts;
      if (typeof showServices === "boolean")
        settings.showServices = showServices;
      if (typeof showGallery === "boolean") settings.showGallery = showGallery;
      if (typeof showTestimonials === "boolean")
        settings.showTestimonials = showTestimonials;
      if (typeof showScrollGallery === "boolean")
        settings.showScrollGallery = showScrollGallery;
      if (typeof showStackedGallery === "boolean")
        settings.showStackedGallery = showStackedGallery;
    }

    await settings.save();

    res.status(200).json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Toggle a specific section visibility
export const toggleSectionVisibility = async (req, res) => {
  try {
    const { section } = req.params;

    const validSections = [
      "showProducts",
      "showServices",
      "showGallery",
      "showTestimonials",
      "showScrollGallery",
      "showStackedGallery",
    ];

    if (!validSections.includes(section)) {
      return res.status(400).json({ message: "Invalid section name" });
    }

    let settings = await HomepageSettings.findOne();

    if (!settings) {
      settings = new HomepageSettings();
    }

    settings[section] = !settings[section];
    await settings.save();

    res.status(200).json({
      message: `${section} visibility toggled successfully`,
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

import { Hero } from "../Model/Hero.js";
import cloudinary from "../Config/cloudinary.js";
import streamifier from "streamifier";

export const addHero = async (req, res) => {
  try {
    const { title, subtitle, buttonText, buttonLink } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    let imageUrl = null;

    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "hero",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      const result = await uploadPromise;
      imageUrl = result.secure_url;
    }

    const newHero = new Hero({
      image: imageUrl,
      title,
      subtitle,
      buttonText,
      buttonLink,
    });

    await newHero.save();
    res.status(201).json({
      message: "Hero section created successfully",
      hero: newHero,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getHero = async (req, res) => {
  try {
    const hero = await Hero.find().sort({ createdAt: -1 }).limit(1);

    if (!hero || hero.length === 0) {
      return res.status(404).json({ message: "No hero section found" });
    }

    res.status(200).json(hero[0]);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateHero = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, buttonText, buttonLink } = req.body;

    const updateData = { title, subtitle, buttonText, buttonLink };
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "hero",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      const result = await uploadPromise;
      const oldHero = await Hero.findById(id);
      if (oldHero && oldHero.image) {
        const urlParts = oldHero.image.split("/");
        const publicIdWithExtension = urlParts.slice(-2).join("/");
        const publicId = publicIdWithExtension.split(".")[0];

        await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
      }

      updateData.image = result.secure_url;
    }

    const updatedHero = await Hero.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedHero) {
      return res.status(404).json({ message: "Hero section not found" });
    }

    res.status(200).json({
      message: "Hero section updated successfully",
      hero: updatedHero,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

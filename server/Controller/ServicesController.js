import { Service } from "../Model/Service.js";
import cloudinary from "../Config/cloudinary.js";
import streamifier from "streamifier";

export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const addService = async (req, res) => {
  try {
    const { title, category, description, price, shortDescription, details } =
      req.body;

    if (!title || !category || !price) {
      return res
        .status(400)
        .json({ message: "Title, category, and price are required" });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "services",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });

      imageUrls = await Promise.all(uploadPromises);
    }

    const newService = new Service({
      title,
      category,
      shortDescription,
      description,
      price,
      images: imageUrls,
      details: details ? JSON.parse(details) : {},
    });

    await newService.save();
    res.status(201).json({
      message: "Service added successfully",
      service: newService,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, price, shortDescription, details } =
      req.body;

    const updateData = {
      title,
      category,
      description,
      price,
      shortDescription,
    };

    if (details) {
      updateData.details = JSON.parse(details);
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "services",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });

      const newImageUrls = await Promise.all(uploadPromises);

      // Optionally delete old images here if replacing
      // tailored for now to just append or replace if logic demands,
      // but simplistic replacement of array is what was here.
      // The previous logic deleted ALL old images if ANY new one was uploaded.

      const oldService = await Service.findById(id);
      if (oldService && oldService.images && oldService.images.length > 0) {
        const deletePromises = oldService.images.map((imageUrl) => {
          const urlParts = imageUrl.split("/");
          const publicIdWithExtension = urlParts.slice(-2).join("/");
          const publicId = publicIdWithExtension.split(".")[0];
          return cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
        });

        await Promise.all(deletePromises);
      }

      updateData.images = newImageUrls;
    }

    const updatedService = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    if (deletedService.images && deletedService.images.length > 0) {
      const deletePromises = deletedService.images.map((imageUrl) => {
        const urlParts = imageUrl.split("/");
        const publicIdWithExtension = urlParts.slice(-2).join("/");
        const publicId = publicIdWithExtension.split(".")[0];

        return cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
      });

      await Promise.all(deletePromises);
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

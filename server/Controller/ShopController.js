import { Shop } from "../Model/Shop.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
export const getAllProducts = async (req, res) => {
  try {
    const products = await Shop.find({ isActive: true }).sort({
      createdAt: -1,
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Shop.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Shop.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Shop.find({ category, isActive: true }).sort({
      createdAt: -1,
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getBestsellerProducts = async (req, res) => {
  try {
    const products = await Shop.find({ isBestseller: true, isActive: true })
      .sort({ popularity: -1 })
      .limit(6);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add a new product
export const addProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const { name, description, price, category, popularity, isBestseller } =
      req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Upload image to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "shop",
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

    const newProduct = new Shop({
      name,
      description,
      price: Number(price),
      category,
      image: result.secure_url,
      popularity: popularity ? Number(popularity) : 0,
      isBestseller: isBestseller === "true" || isBestseller === true,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      popularity,
      isBestseller,
      isActive,
    } = req.body;

    const product = await Shop.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateData = {};

    // Handle image upload if new file is provided
    if (req.file) {
      // Upload new image to Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "shop",
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

      // Delete old image from Cloudinary
      if (product.image) {
        try {
          const urlParts = product.image.split("/");
          const publicIdWithExtension = urlParts.slice(-2).join("/");
          const publicId = publicIdWithExtension.split(".")[0];
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
        } catch (deleteError) {
          console.log("Error deleting old image:", deleteError.message);
        }
      }

      updateData.image = result.secure_url;
    }

    // Update other fields if provided
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (category) updateData.category = category;
    if (popularity !== undefined) updateData.popularity = Number(popularity);
    if (isBestseller !== undefined) {
      updateData.isBestseller =
        isBestseller === "true" || isBestseller === true;
    }
    if (isActive !== undefined) {
      updateData.isActive = isActive === "true" || isActive === true;
    }

    const updatedProduct = await Shop.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Shop.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete image from Cloudinary
    if (product.image) {
      try {
        const urlParts = product.image.split("/");
        const publicIdWithExtension = urlParts.slice(-2).join("/");
        const publicId = publicIdWithExtension.split(".")[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      } catch (deleteError) {
        console.log("Error deleting image:", deleteError.message);
      }
    }

    await Shop.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Toggle bestseller status
export const toggleBestseller = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Shop.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isBestseller = !product.isBestseller;
    await product.save();

    res.status(200).json({
      message: `Product ${
        product.isBestseller ? "marked as" : "removed from"
      } bestseller`,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Toggle product active status
export const toggleActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Shop.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      message: `Product ${product.isActive ? "activated" : "deactivated"}`,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

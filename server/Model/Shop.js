import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "Photo Prints",
        "Albums",
        "Frames",
        "Digital Products",
        "Merchandise",
      ],
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    popularity: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Shop = mongoose.model("Shop", ShopSchema);

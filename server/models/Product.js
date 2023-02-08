import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    brand: { type: String, required: true },
    color: { type: String, required: true },
    category: { type: String, required: true },
    sold: { type: Number, default: 0 },
    images: { type: Array, default: [] },
    ratings: [
      {
        star: { type: Number, default: 0 },
        comment: { type: String, default: "" },
        postedBy: { type: mongoose.Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);

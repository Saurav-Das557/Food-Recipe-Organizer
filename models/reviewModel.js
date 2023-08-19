import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: "users",
    required: true,
  },
  recipe: {
    type: mongoose.ObjectId,
    ref: "Meal",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("review", reviewSchema);

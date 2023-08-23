import express from "express";
import { isAdmin, requireSignIn } from "../middleWares/authMiddleWare.js";
import {
  createReviewController,
  deleteReviewController,
  getReviewController,
} from "../controllers/reviewController.js";

const router = express.Router();

// create review
router.post("/create-review/:recipeId", requireSignIn, createReviewController);

//get review
router.get("/get-review/:recipeId", getReviewController);

// delete review
router.delete("/reviews/:reviewId", requireSignIn, isAdmin, deleteReviewController);

export default router;

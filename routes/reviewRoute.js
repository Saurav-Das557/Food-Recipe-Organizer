import express from "express";
import { isAdmin, requireSignIn } from "../middleWares/authMiddleWare.js";
import {
  createReviewController,
  getReviewController,
} from "../controllers/reviewController.js";

const router = express.Router();

// create review
router.post("/create-review/:recipeId", requireSignIn, createReviewController);

//get review
router.get("/get-review/:recipeId", getReviewController);

export default router;

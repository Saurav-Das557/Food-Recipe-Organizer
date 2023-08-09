import express from "express";
import { isAdmin, requireSignIn } from "../middleWares/authMiddleWare.js";
import {
  createMealController,
  getRecipeController,
  getSingleRecipeController,
  recipePhotoController,
} from "../controllers/mealController.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
//create recipe
router.post(
  "/create-meal",
  requireSignIn,
  isAdmin,
  formidable(),
  createMealController
);

//get recipes
router.get("/get-meal", getRecipeController);

//get single recipe
router.get("/get-meal/:slug", getSingleRecipeController);

//get recipe photo
router.get("/meal-photo/:rid", recipePhotoController);

export default router;

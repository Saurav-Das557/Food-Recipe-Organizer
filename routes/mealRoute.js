import express from "express";
import { isAdmin, requireSignIn } from "../middleWares/authMiddleWare.js";
import {
  createMealController,
  deleteRecipeController,
  getRecipeController,
  getSingleRecipeController,
  recipePhotoController,
  updateMealController,
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

//update recipe
router.put(
  "/update-meal/:rid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateMealController
);

//get recipes
router.get("/get-meal", getRecipeController);

//get single recipe
router.get("/get-meal/:slug", getSingleRecipeController);

//get recipe photo
router.get("/meal-photo/:rid", recipePhotoController);

//delete recipe photo
router.get("/delete-meal/:rid", deleteRecipeController);

export default router;

import express from "express";
import { isAdmin, requireSignIn } from "../middleWares/authMiddleWare.js";
import {
  createMealController,
  deleteRecipeController,
  getRecipeController,
  getSingleRecipeController,
  recipeCountController,
  recipeFilterController,
  recipeListController,
  recipePhotoController,
  searchRecipeController,
  similarRecipeController,
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
router.delete("/delete-meal/:rid", deleteRecipeController);

//filter recipe
router.post("/recipe-filter", recipeFilterController);

// recipe count
router.get("/recipe-count", recipeCountController);

// recipe per page
router.get("/recipe-list/:page", recipeListController);

// search recipe
router.get("/search-recipe/:keyword", searchRecipeController);

// similar recipe
router.get("/search-recipe", searchRecipeController);
router.get("/similar-recipe/:rid/:cid", similarRecipeController);

export default router;

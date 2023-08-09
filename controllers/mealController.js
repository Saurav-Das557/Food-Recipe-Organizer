import slugify from "slugify";
import recipeModel from "../models/recipeModel.js";
import fs from "fs";
import axios from "axios";
import request from "request";

export const createMealController = async (req, res) => {
  try {
    const { idMeal, strMeal, slug, strCategory, strInstructions } = req.fields;
    const { strMealThumb } = req.files;
    console.log(strMealThumb);
    // validation
    if (!idMeal) {
      return res.send({ message: "Recipe ID is required" });
    }
    if (!strMeal) {
      return res.send({ message: "Recipe Name is required" });
    }
    if (!strCategory) {
      return res.send({ message: "Recipe Category is required" });
    }
    if (!strInstructions) {
      return res.send({ message: "Recipe Instruction is required" });
    }
    if (strMealThumb && strMealThumb.size > 10000000) {
      return res.send({
        message: "Recipe Image is required and should be less than 10mb",
      });
    }
    // check duplicate
    const existingMealID = await recipeModel.findOne({
      idMeal,
    });
    const existingMealName = await recipeModel.findOne({
      strMeal,
    });
    // checking meal ID
    if (existingMealID) {
      return res.status(200).send({
        success: false,
        message: "Recipe ID is already there. Find it.",
      });
    }
    if (existingMealName) {
      return res.status(200).send({
        success: false,
        message: "Recipe Name is already there. Try another name.",
      });
    }
    const recipes = new recipeModel({ ...req.fields, slug: slugify(strMeal) });
    console.log(recipes);
    if (strMealThumb) {
      recipes.strMealThumb.data = fs.readFileSync(strMealThumb.path);
      recipes.strMealThumb.contentType = strMealThumb.type;
    }
    await recipes.save();
    res.status(201).send({
      success: true,
      message: "Recipe created successfully",
      recipes,
    });
  } catch (error) {
    console.log(error),
      res.status(500).send({
        success: false,
        message: "Failed to create recipe successfully",
      });
  }
};

// get recipe
export const getRecipeController = async (req, res) => {
  try {
    const recipes = await recipeModel
      .find({})
      .select("-strMealThumb")
      .select("strCategory")
      .populate("strCategory")
      .limit(15)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalCount: recipes.length,
      message: "All recipes",
      recipes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting recipes",
      error: error.message,
    });
  }
};

//get single recipe
export const getSingleRecipeController = async (req, res) => {
  try {
    const recipe = await recipeModel
      .findOne({ slug: req.params.slug })
      .select("-strMealThumb")
      .populate("strCategory");
    res.status(200).send({
      success: true,
      message: "Single Recipe Fetched",
      recipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while trying to get single recipe",
      error,
    });
  }
};


export const recipePhotoController = async (req, res) => {
  try {
    const recipe = await recipeModel.findById(req.params.rid).select("strMealThumb");

    if (!recipe.strMealThumb) {
      return res.status(404).send({
        success: false,
        message: "Image URL or data not found in the recipe",
      });
    }

    if (isBufferImage(recipe.strMealThumb)) {
      const contentType = recipe.strMealThumb.contentType;
      const imageData = recipe.strMealThumb.data;

      res.set("Content-Type", contentType);
      return res.status(200).send(imageData);
    } else if (isURLString(recipe.strMealThumb)) {
      const imageUrl = recipe.strMealThumb;
      const response = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      if (response.data) {
        const contentType = response.headers["content-type"];
        res.set("Content-Type", contentType);
        return res.status(200).send(response.data);
      } else {
        return res.status(404).send({
          success: false,
          message: "Image not found",
        });
      }
    } else {
      return res.status(404).send({
        success: false,
        message: "Invalid image data or URL in the recipe",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

function isBufferImage(image) {
  return image.data && image.contentType;
}

function isURLString(str) {
  const urlPattern = /^(https?:\/\/)?(www\.)?([^\s.]+\.\S{2,}|localhost[\:?\d]*)\S*$/i;
  return urlPattern.test(str);
}


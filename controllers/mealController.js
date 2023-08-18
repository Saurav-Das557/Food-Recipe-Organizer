import slugify from "slugify";
import recipeModel from "../models/recipeModel.js";
import fs from "fs";
import axios from "axios";

export const createMealController = async (req, res) => {
  try {
    const { idMeal, strMeal, slug, strCategory, strInstructions } = req.fields;
    const { strMealThumb } = req.files;
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

// get photo
export const recipePhotoController = async (req, res) => {
  try {
    const recipe = await recipeModel
      .findById(req.params.rid)
      .select("strMealThumb");

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
  const urlPattern =
    /^(https?:\/\/)?(www\.)?([^\s.]+\.\S{2,}|localhost[\:?\d]*)\S*$/i;
  return urlPattern.test(str);
}

// delete recipe
export const deleteRecipeController = async (req, res) => {
  try {
    const recipe = await recipeModel
      .findByIdAndDelete(req.params.rid)
      .select("-strMealThumb");
    res.status(200).send({
      success: true,
      message: "Recipe deleted successfully",
      recipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting recipe",
      error,
    });
  }
};

// update recipe
export const updateMealController = async (req, res) => {
  try {
    const { strCategory, strMeal } = req.fields;
    const { strMealThumb } = req.files;

    // Check if recipe with given ID exists
    const existingRecipe = await recipeModel.findById(req.params.rid);

    if (!existingRecipe) {
      return res.send({ message: "Recipe with the given ID not found" });
    }

    // Prepare the fields to update
    const updatedFields = {};

    if (!strCategory && !existingRecipe.strCategory) {
      return res.send({ message: "Recipe Category is required" });
    } else if (strCategory) {
      updatedFields.strCategory = strCategory;
    }

    if (strMeal) {
      updatedFields.strMeal = strMeal;
      updatedFields.slug = slugify(strMeal); // Update slug if strMeal is changed
    }

    if (req.fields.strInstructions) {
      updatedFields.strInstructions = req.fields.strInstructions;
    }

    if (strMealThumb && strMealThumb.size > 10000000) {
      return res.send({
        message: "Recipe Image should be less than 10mb",
      });
    } else if (strMealThumb) {
      updatedFields.strMealThumb = {
        data: fs.readFileSync(strMealThumb.path),
        contentType: strMealThumb.type,
      };
    }

    // Update the recipe with the updated fields
    const updatedRecipe = await recipeModel.findByIdAndUpdate(
      req.params.rid,
      updatedFields,
      { new: true }
    );

    res.status(201).send({
      success: true,
      message: "Recipe updated successfully",
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to update recipe",
    });
  }
};

// filter recipe controller
export const recipeFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.strCategory = checked;
    if (radio.length) args.strArea = radio[0];
    const recipes = await recipeModel.find(args);
    res.status(200).send({
      success: true,
      recipes,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering recipe",
      error,
    });
  }
};

// recipe count
export const recipeCountController = async (req, res) => {
  try {
    const total = await recipeModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error counting recipes",
      error,
    });
  }
};

export const recipeListController = async (req, res) => {
  try {
    const perPage = 9;
    const page = req.params.page ? req.params.page : 1;
    const recipes = await recipeModel
      .find({})
      .select("-strMealThumb")
      .skip((page - 1) * perPage)
      .limit(perPage);
    // .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      recipes,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in showing recipe list",
      error,
    });
  }
};

// search recipe
export const searchRecipeController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await recipeModel
      .find({
        $or: [
          { strMeal: { $regex: keyword, $options: "i" } },
          { strInstructions: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-strMealThumb");
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while searching recipe",
      error,
    });
  }
};

// similar recipe controller
export const similarRecipeController = async (req, res) => {
  try {
    const { rid, cid } = req.params;
    const recipes = await recipeModel
      .find({
        strCategory: cid,
        _id: { $ne: rid },
      })
      .select("-strMealThumb")
      .limit(6)
      .populate("strCategory");
    res.status(200).send({
      success: true,
      recipes,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while generating similar recipes",
      error,
    });
  }
};

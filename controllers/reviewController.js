import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";

export const createReviewController = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is already available in req.user
    const { rating, text } = req.body;
    // Assuming you have the recipe ID from the URL parameter
    const recipeId = req.params.recipeId;

    // Create the review
    const review = new reviewModel({
      user: userId,
      recipe: recipeId, // Use the captured recipe ID
      rating,
      text,
    });
    console.log(review);

    await review.save();

    res.status(201).send({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Failed to create review",
    });
  }
};

// get review controller
export const getReviewController = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;

    // Query the database to retrieve reviews for the specified recipe ID
    const reviews = await reviewModel
      .find({ recipe: recipeId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting the reviews",
      error,
    });
  }
};

// delete review
export const deleteReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id; // Assuming user ID is available in req.user
    console.log(userId);
    // Retrieve user's role from the database
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user is an admin
    if (user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await reviewModel.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while deleting review",
      error,
    });
  }
};

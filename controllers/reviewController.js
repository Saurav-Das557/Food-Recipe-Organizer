import reviewModel from "../models/reviewModel.js";

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

    // Validation
    // if (!rating) {
    //   return res.status(400).send({ message: "Rating is required" });
    // }
    // if (!text) {
    //   return res.status(400).send({ message: "Review text is required" });
    // }

    // // Assuming you have the signed-in user's ID available in req.user._id
    // const userId = req.user._id;

    // // Assuming you retrieve the recipe ID from the URL or route parameters
    // const recipeId = req.params.recipeId; // Adjust this according to your actual parameter name

    // Create the review
    // const review = new reviewModel({
    //   rating,
    //   text,
    // });
    // console.log(review);

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
    const reviews = await reviewModel.find({ recipe: recipeId });

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

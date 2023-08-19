import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import ReviewForm from "../components/Form/reviewForm";
import toast from "react-hot-toast";
import { useFavorite } from "../context/favorites";

const RecipeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 2rem;
`;

const ImageContainer = styled.div`
  flex: 1;
`;

const TextContainer = styled.div`
  flex: 1;
  padding: 1.5rem;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
`;

const RecipeDetailsContainer = styled.div`
  margin-top: 1rem;
`;

const IngredientList = styled.ul`
  list-style-type: disc;
  padding-left: 1.5rem;
`;

const RecipeDetails = () => {
  const [fav, setFav] = useFavorite();
  const params = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({});
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);

  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  const getReviews = async (recipeId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/review/get-review/${recipeId}`
      );
      setReviews(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (params?.slug) {
      getRecipe(); // Fetch the recipe details and reviews
    }
  }, [params?.slug]);

  const submitReview = async (reviewData) => {
    try {
      // Send the review data to the backend API
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/review/create-review/${recipe._id}`,
        reviewData
      );
      if (response.data.success) {
        // Refresh the list of reviews after successful submission
        getReviews(recipe._id); // Fetch reviews for the current recipe
        setShowReviewForm(false); // Hide the review form
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  const getRecipe = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/meal/get-meal/${params.slug}`
      );
      setRecipe(data?.recipe);
      getSimilarRecipes(data?.recipe._id, data?.recipe.strCategory._id);
      getReviews(data?.recipe._id); // Fetch reviews for the current recipe
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarRecipes = async (rid, cid) => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/meal/similar-recipe/${rid}/${cid}`
      );
      setSimilarRecipes(data?.recipes);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <RecipeContainer className="row container mt-2">
        <ImageContainer className="col-md-6">
          <img
            src={`${process.env.REACT_APP_API}/api/v1/meal/meal-photo/${recipe._id}`}
            className="card-img-top"
            alt={recipe._strMeal}
          />
        </ImageContainer>
        <TextContainer className="col-md-6">
          <h1>Recipe Details</h1>
          <h6>Name: {recipe.strMeal}</h6>
          <h6>Area: {recipe.strArea}</h6>
          <h6>Category: {recipe.strCategory?.name}</h6>
          <h6>Instruction: {recipe.strInstructions}</h6>

          <RecipeDetailsContainer>
            <h6>Ingredients:</h6>
            <IngredientList>
              {Array.from({ length: 20 }, (_, index) => {
                const ingredient = recipe[`strIngredient${index + 1}`];
                const measure = recipe[`strMeasure${index + 1}`];
                if (ingredient) {
                  const ingredientDescription = measure
                    ? `${measure} ${ingredient}`
                    : ingredient;
                  return <li key={index}>{ingredientDescription}</li>;
                }
                return null;
              })}
            </IngredientList>
          </RecipeDetailsContainer>
          {recipe.strYoutube && <h6>Youtube Link: {recipe.strYoutube}</h6>}
          {recipe.strSource && (
            <h6>Source of this Recipe: {recipe.strSource}</h6>
          )}
          <button class="btn btn-secondary ms-1" >Add to favorites</button>
        </TextContainer>
      </RecipeContainer>
      <hr />
      <h3 className="mb-3">Comment and Review Section</h3>
      <div className="review-section mb-3">
        <div className="row">
          <button className="btn btn-primary mb-5" onClick={toggleReviewForm}>
            Write a Review
          </button>
          {showReviewForm && <ReviewForm handleSubmit={submitReview} />}
        </div>
        <div className="row">
          <h6 className="reviews-heading">Reviews</h6>

          {reviews.map((review) => {
            const createdAt = new Date(review.createdAt);
            const currentTime = new Date();
            const timeDifference = (currentTime - createdAt) / 1000; // Time difference in seconds

            let timeAgo;
            if (timeDifference < 60) {
              timeAgo = `posted ${Math.floor(timeDifference)} seconds ago`;
            } else if (timeDifference < 3600) {
              timeAgo = `posted ${Math.floor(timeDifference / 60)} minutes ago`;
            } else if (timeDifference < 86400) {
              timeAgo = `posted ${Math.floor(timeDifference / 3600)} hours ago`;
            } else {
              timeAgo = `posted ${Math.floor(timeDifference / 86400)} days ago`;
            }

            return (
              <div key={review._id} className="review">
                <p>
                  <span
                    style={{
                      color: "blue",
                      fontWeight: "bold",
                      fontSize: "23px",
                    }}
                  >
                    Rating:
                  </span>{" "}
                  {review.rating} out of 10
                </p>
                <p>
                  <span
                    style={{
                      color: "blue",
                      fontWeight: "bold",
                      fontSize: "23px",
                    }}
                  >
                    Comment:
                  </span>{" "}
                  {review.text}
                </p>

                <p className="review-time">{timeAgo}</p>
                <hr />
              </div>
            );
          })}
        </div>
      </div>

      <div className="row">
        <h6>Similar Recipes</h6>
        {similarRecipes.length < 1 && (
          <p className="text-center">No Similar Recipes found</p>
        )}
        <div className="d-flex flex-wrap">
          {similarRecipes?.map((r) => (
            <div className="custom-card m-2" style={{ width: "18rem" }}>
              <img
                src={`${process.env.REACT_APP_API}/api/v1/meal/meal-photo/${r._id}`}
                className="card-img-top"
                alt={r.strMeal}
              />
              <div className="card-body">
                <h5 className="card-title">{r.strMeal}</h5>
                <p className="card-text">
                  {r.strInstructions.substring(0, 30)}
                </p>
                <button
                  class="btn btn-primary ms-1"
                  onClick={() => navigate(`/recipe/${r.slug}`)}
                >
                  See Details
                </button>
                <button
                  class="btn btn-secondary ms-1"
                  onClick={() => {
                    setFav([...fav, r]);
                    localStorage.setItem(
                      "favourites",
                      JSON.stringify([...fav, r])
                    );
                    toast.success("Recipe added to favorites");
                  }}
                >
                  Add to favorites
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetails;

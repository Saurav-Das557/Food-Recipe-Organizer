import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import ReviewForm from "../components/Form/reviewForm";
import toast from "react-hot-toast";
import { useFavorite } from "../context/favorites";
import { useAuth } from "../context/Auth";

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
  const [auth] = useAuth();
  const [fav, setFav] = useFavorite();
  const params = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({});
  const [similarRecipes, setSimilarRecipes] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([]);

  // function sleep(milliseconds) {
  //   const date = Date.now();
  //   let currentDate = null;
  //   do {
  //     currentDate = Date.now();
  //   } while (currentDate - date < milliseconds);
  // }

  // const fetchCurrentUser = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.REACT_APP_API}/api/v1/auth/get-info`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${auth.token}`,
  //         },
  //       }
  //     );
  //     return response.data.user;
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   const getUserDetails = async () => {
  //       const user = await fetchCurrentUser();
  //       setCurrentUser(user);
  //   };
  //   getUserDetails();
  // }, []);

  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  const navigateToLogin = () => {
    navigate("/login");
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

  // delete review
  const deleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/review/reviews/${reviewId}`
      );

      if (response.data.success) {
        // Refresh the list of reviews after successful deletion
        getReviews(recipe._id); // Fetch reviews for the current recipe
        toast.success("Review deleted successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
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

  useEffect(() => {
    if (params?.slug) {
      getRecipe(); // Fetch the recipe details and reviews
    }
  }, [params?.slug]);

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

  const handleAddToFavorites = () => {
    const isAlreadyFavorited = fav.some((item) => item?._id === recipe?._id);

    if (isAlreadyFavorited) {
      toast("Already in you favorites!", {
        icon: "👏",
      });
    } else {
      setFav([...fav, recipe]);
      if (auth?.user && auth?.user.id) {
        localStorage.setItem(
          `favourites_${auth?.user.id}`,
          JSON.stringify([...fav, recipe])
        );
      } else {
        localStorage.setItem("favourites", JSON.stringify([...fav, recipe]));
      }
      toast.success("Recipe added to favorites");
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
          {recipe.strYoutube && (
            <h6 className="mb-4">Youtube Link: {recipe.strYoutube}</h6>
          )}
          {recipe.strSource && (
            <h6 className="mb-4">Source of this Recipe: {recipe.strSource}</h6>
          )}
          <button class="btn btn-secondary ms-1" onClick={handleAddToFavorites}>
            Add to favorites
          </button>
        </TextContainer>
      </RecipeContainer>
      <hr />
      <h3 className="mb-3">Comment and Review Section</h3>
      <div className="review-section mb-3">
        <div className="row">
          {auth.user ? (
            <button className="btn btn-primary mb-5" onClick={toggleReviewForm}>
              Write a Review
            </button>
          ) : (
            <button className="btn btn-danger mb-5" onClick={navigateToLogin}>
              Login to Write a Review
            </button>
          )}
          {/* <button className="btn btn-primary mb-5" onClick={toggleReviewForm}>
            Write a Review
          </button> */}
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
                    <h3 style={{ color: "#004d40", fontStyle: "italic", textDecoration: "underline" }}>
                      {review?.user?.name}'s review
                    </h3>
                    Rating:
                  </span>{" "}
                  {review.rating} out of 5
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
                {auth?.user &&
                  (auth?.user?.role === 1 ||
                    auth?.user?.id === review?.user?._id) && (
                    <button
                      className="btn btn-danger ms-1"
                      onClick={() => deleteReview(review._id)}
                    >
                      Delete
                    </button>
                  )}

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
                  {r.strInstructions.substring(0, 30)}...
                </p>
                <button
                  class="btn btn-primary ms-1 m-2"
                  onClick={() => navigate(`/recipe/${r.slug}`)}
                >
                  See Details
                </button>
                <button
                  class="btn btn-secondary ms-1"
                  onClick={() => {
                    const isAlreadyFavorited = fav.some(
                      (recipe) => recipe?._id === r._id
                    );

                    if (isAlreadyFavorited) {
                      toast("Already in you favorites!", {
                        icon: "👏",
                      });
                    } else {
                      setFav([...fav, r]);
                      localStorage.setItem(
                        `favourites_${auth?.user.id}`,
                        JSON.stringify([...fav, r])
                      );
                      toast.success("Recipe added to favorites");
                    }
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

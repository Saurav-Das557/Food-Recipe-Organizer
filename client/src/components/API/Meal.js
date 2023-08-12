import React, { useState, useEffect } from "react";

const Meal = ({ meal }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchMealInformation = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${meal.id}/information?apiKey=${process.env.REACT_APP_API_KEY}&includeNutrition=false`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch meal information");
        }

        const data = await response.json();
        setImageUrl(data.image);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMealInformation();
  }, [meal.id]);

  return (
    <article className="meal-card">
      <h1 className="meal-title">{meal.title}</h1>
      <img className="meal-image" src={imageUrl} alt="recipe" />
      <ul className="meal-info">
        <li>Preparation time: {meal.readyInMinutes} minutes</li>
        <li>Number of servings: {meal.servings}</li>
      </ul>
      <a className="recipe-link" href={meal.sourceUrl} target="_blank">
        Go to Recipe
      </a>
    </article>
  );
};

export default Meal;

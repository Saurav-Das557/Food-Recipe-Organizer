import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Link } from "react-router-dom";
import "../../styles/recipes.css";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  // get all recipes
  const getAllRecipes = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/meal/get-meal`
      );
      setRecipes(data.recipes);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    getAllRecipes();
  }, []);
  return (
    <Layout title={"Dashboard - Recipe"}>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Recipes</h1>
          <div className="d-flex flex-wrap custom-card-container">
            {recipes?.map((r) => (
              <Link
                key={r._id}
                to={`/dashboard/admin/recipes/${r.slug}`}
                className="custom-card m-2"
              >
                <div className="custom-card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/meal/meal-photo/${r._id}`}
                    className="card-img-top"
                    alt={r.strMeal}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{r.strMeal}</h5>
                    <p className="card-text">{r.strInstructions}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Recipes;

import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import SearchInput from "../components/Form/SearchInput";

const MealSearch = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();
  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Resuts</h1>
          <SearchInput />
          <h6>
            {values?.results.length < 1
              ? "No Recipes Found"
              : `Found ${values?.results.length} Recipes`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((r) => (
              <div className="card m-2" style={{ width: "18rem" }}>
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
                    class="btn btn-primary ms-1"
                    onClick={() => navigate(`/recipe/${r.slug}`)}
                  >
                    More Details
                  </button>
                  <button class="btn btn-secondary ms-1">
                    Add to Favorites
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MealSearch;

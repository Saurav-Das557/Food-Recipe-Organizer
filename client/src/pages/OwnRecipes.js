import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Areas } from "../components/Areas";
import SearchInput from "../components/Form/SearchInput";
import { Navigate, useNavigate } from "react-router-dom";
import { useFavorite } from "../context/favorites";
import toast from "react-hot-toast";
import { useAuth } from "../context/Auth";

const OwnRecipes = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [fav, setFav] = useFavorite();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get recipes
  const getAllRecipes = async (currentPage = 1) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/meal/recipe-list/${currentPage}`
      );
      if (currentPage === 1) {
        setRecipes(data.recipes);
      } else {
        setRecipes((prev) => [...prev, ...data.recipes]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    // When no filters are applied, use pagination
    if (checked.length === 0 && radio.length === 0) {
      getAllRecipes(page);
    }
  }, [page]);

  useEffect(() => {
    if (checked.length > 0 || radio.length > 0) {
      filterRecipes();
    } else {
      getAllRecipes(1);
    }
  }, [checked, radio]);

  //get Total Count
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/meal/recipe-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
    // eslint-disable-next-line
  }, [page]);

  // load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/meal/recipe-list/${page}`
      );
      setLoading(false);
      setRecipes([...recipes, ...data?.recipes]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  // get filtered recipes
  const filterRecipes = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/meal/recipe-filter`,
        { checked, radio }
      );
      setRecipes(data?.recipes);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"Recipes"}>
      <div className="ownRecipe">
        <div className="row mt-3">
          <div className="col-md-3">
            <h4 className="text-center">Filter by Category</h4>
            <div className="d-flex flex-column">
              {categories?.map((c) => (
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                >
                  {c.name}
                </Checkbox>
              ))}
            </div>
            {/* Area filter */}
            <h4 className="text-center mt-4">Filter by Area</h4>
            <div className="d-flex flex-column">
              <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                {Areas?.map((a) => (
                  <div key={a._id}>
                    <Radio value={a.array}>{a.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className="d-flex flex-column m-2">
              <button
                className="btn btn-danger"
                onClick={() => window.location.reload()}
              >
                Reset Filters
              </button>
            </div>
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Recipes</h1>
            <SearchInput />
            <div className="d-flex flex-wrap">
              {recipes?.map((r) => (
                <div
                  className="custom-recipe-card m-2"
                  style={{ width: "18rem" }}
                >
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
            <div className="m-2 p-3 d-flex justify-content-center">
              {recipes &&
                recipes.length < total &&
                !checked.length &&
                !radio.length && (
                  <button
                    className="btn btn-warning text-center"
                    style={{ transform: "translateX(-75%)" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  >
                    {loading ? "Loading ..." : "Load More..."}
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OwnRecipes;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";

const { Option } = Select;

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [idMeal, setidMeal] = useState("");
  const [strMeal, setstrMeal] = useState("");
  const [strMealThumb, setstrMealThumb] = useState("");
  const [strCategory, setstrCategory] = useState("");
  const [strArea, setstrArea] = useState("");
  const [strInstructions, setstrInstructions] = useState("");
  const [strYoutube, setstrYoutube] = useState("");
  const [strIngredientCount, setStrIngredientCount] = useState(0);
  const [ingredients, setIngredients] = useState([]);

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
      toast.error("Something went wrong in getting catgeory");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
  const handleIngredientCountChange = (value) => {
    setStrIngredientCount(parseInt(value));
    setIngredients([]);
  };

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  const renderIngredientInputs = () => {
    return Array.from({ length: strIngredientCount }, (_, index) => (
      <div className="mb-3" key={index}>
        <input
          type="text"
          placeholder={`Ingredient ${index + 1}`}
          className="form-control"
          value={ingredients[index] || ""}
          onChange={(e) => handleIngredientChange(index, e.target.value)}
        />
      </div>
    ));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const recipeData = new FormData();
      recipeData.append("idMeal", idMeal);
      recipeData.append("strMeal", strMeal);
      recipeData.append("strCategory", strCategory);
      if (strMealThumb) {
        recipeData.append("strMealThumb", strMealThumb);
      }
      if (strArea) {
        recipeData.append("strArea", strArea);
      }
      recipeData.append("strInstructions", strInstructions);
      if (strYoutube) {
        recipeData.append("strYoutube", strYoutube);
      }
      // Append each ingredient if it's not empty
      ingredients.forEach((ingredient, index) => {
        if (ingredient) {
          recipeData.append(`strIngredient${index + 1}`, ingredient);
        }
      });

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/meal/create-meal`,
        recipeData
      );
      console.log(data);
      if (data?.success) {
        toast.success("Recipe created successfully");
        navigate("/dashboard/admin/products");
        // Reset all the form fields here
      } else {
        toast.error("Recipe creation failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard - Create Recipe"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Recipe</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a Category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setstrCategory(value);
                }}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {strMealThumb ? strMealThumb.name : "Upload Image"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setstrMealThumb(e.target.files[0])}
                    hidden
                  />
                </label>
                {strMealThumb && (
                  <button
                    className="btn btn-danger mt-2"
                    onClick={() => setstrMealThumb(null)}
                  >
                    Remove Photo
                  </button>
                )}
              </div>
              <div className="mb-3">
                {strMealThumb && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(strMealThumb)}
                      alt="Recipe_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={idMeal}
                  placeholder="Write the food ID"
                  className="form-control"
                  onChange={(e) => setidMeal(e.target.value)}
                  required
                ></input>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={strMeal}
                  placeholder="Write the Recipe Name"
                  className="form-control"
                  onChange={(e) => setstrMeal(e.target.value)}
                ></input>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={strArea}
                  placeholder="Write the origin of this recipe (Optional) "
                  className="form-control"
                  onChange={(e) => setstrArea(e.target.value)}
                ></input>
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={strInstructions}
                  placeholder="Recipe Instructions"
                  className="form-control"
                  onChange={(e) => setstrInstructions(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={strYoutube}
                  placeholder="Provide any video link on this recipe (Optional)"
                  className="form-control"
                  onChange={(e) => setstrYoutube(e.target.value)}
                ></input>
              </div>

              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Ingredient Count"
                  size="large"
                  className="form-select mb-3"
                  onChange={handleIngredientCountChange}
                >
                  {[0, 1, 2, 3, 4, 5].map((count) => (
                    <Option key={count} value={count}>
                      {`${count} Ingredients`}
                    </Option>
                  ))}
                  {/* <Option key={0} value={0}>
                    0 Ingredients
                  </Option> */}
                </Select>
                {strIngredientCount > 0 && renderIngredientInputs()}
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  Create Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRecipe;

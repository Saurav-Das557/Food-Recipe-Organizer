import React from "react";
import Layout from "../components/Layout/Layout";
import { useFavorite } from "../context/favorites";
import { useAuth } from "../context/Auth";
import { Navigate, useNavigate } from "react-router-dom";

const FavoritePage = () => {
  const [auth, setAuth] = useAuth();
  const [fav, setFav] = useFavorite();
  const navigate = useNavigate();

  // remove item
  const removeFavItem = (rid) => {
    try {
      let myFav = [...fav];
      let index = myFav.findIndex((recipe) => recipe._id === rid);
      myFav.splice(index, 1);
      setFav(myFav);
      localStorage.setItem("favourites", JSON.stringify(myFav));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {`Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center mb-3">
              {fav?.length
                ? `You have ${fav.length} favorite recipes ${
                    auth?.token ? "" : "please login to checkout"
                  }`
                : " Your Favorites is Empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            {fav?.map((r) => (
              <div className="row mb-2 p-3 card flex-row">
                <div className="col-md-4">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/meal/meal-photo/${r._id}`}
                    className="card-img-top"
                    alt={r.name}
                    width="100%"
                    height={"350px"}
                  />
                </div>
                <div className="col-md-8">
                  <div className="cus-card">
                    <div className="card-body">
                      <h5 className="card-title">{r.strMeal}</h5>
                      <p className="card-text">
                        {r.strInstructions.substring(0, 300)}...
                      </p>
                      <button
                        className="btn btn-danger remove-button"
                        onClick={() => removeFavItem(r._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()} </h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Plase Login to checkout
                  </button>
                )}
              </div>
            )}
          </div> */}
        </div>
      </div>
    </Layout>
  );
};

export default FavoritePage;

import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateRecipe from "./pages/Admin/CreateRecipe";
import Users from "./pages/Admin/Users";
import Profile from "./pages/user/Profile";
import UserCreateRecipe from "./pages/user/UserCreateRecipe";
import MealPlan from "./pages/mealPlan";
import { AnimatePresence } from "framer-motion";
import Cuisine from "./pages/Cuisine";
import Searched from "./pages/Searched";
import Recipe from "./pages/Recipe";
import Recipes from "./pages/Admin/Recipes";
import UpdateRecipe from "./pages/Admin/UpdateRecipe";
import OwnRecipes from "./pages/OwnRecipes";
import MealSearch from "./pages/MealSearch";
import RecipeDetails from "./pages/RecipeDetails";
import FavoritePage from "./pages/FavoritePage";
import { useAuth } from "./context/Auth";

function App() {
  const [auth] = useAuth()
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipe/:slug" element={<RecipeDetails />} />
          <Route path="/search" element={<MealSearch />} />
          <Route path="/favorites" element={<FavoritePage key={auth?.user?.id}/>} />
          <Route path="/cuisine/:type" element={<Cuisine />} />
          <Route path="/searched/:search" element={<Searched />} />
          <Route path="/recipe-api/:name" element={<Recipe />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="user" element={<Dashboard />} />
            <Route path="user/profile" element={<Profile />} />
            <Route path="user/create-recipe" element={<UserCreateRecipe />} />
          </Route>
          <Route path="/dashboard" element={<AdminRoute />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/create-category" element={<CreateCategory />} />
            <Route path="admin/create-recipe" element={<CreateRecipe />} />
            <Route path="admin/recipes" element={<Recipes />} />
            <Route path="admin/recipes/:slug" element={<UpdateRecipe />} />
            <Route path="admin/users" element={<Users />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/mealplan" element={<MealPlan />} />
          <Route path="/recipes" element={<OwnRecipes />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Pagenotfound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;

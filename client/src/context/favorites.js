import { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "./Auth";

const FavoriteContext = createContext();
const FavoriteProvider = ({ children }) => {
  const [auth] = useAuth()
  const [fav, setFav] = useState([]);

  const userId = auth.user ? auth.user.id : null;


  useEffect(() => {
    if (userId) {
      const userFavs = localStorage.getItem(`favourites_${userId}`);
      setFav(userFavs ? JSON.parse(userFavs) : []);
    } else {
      setFav([]);  // Reset to empty if there's no user ID
    }
  }, [userId]);
  
  return (
    <FavoriteContext.Provider value={[fav, setFav]}>
      {children}
    </FavoriteContext.Provider>
  );
};

// custom hook
const useFavorite = () => useContext(FavoriteContext);

export { useFavorite, FavoriteProvider };

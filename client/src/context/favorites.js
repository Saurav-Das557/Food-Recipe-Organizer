import { useState, useContext, createContext, useEffect } from "react";

const FavoriteContext = createContext();
const FavoriteProvider = ({ children }) => {
  const [fav, setFav] = useState([]);

  useEffect(() => {
    let existingFavItem = localStorage.getItem("favourites");
    if (existingFavItem) setFav(JSON.parse(existingFavItem));
  }, []);

  return (
    <FavoriteContext.Provider value={[fav, setFav]}>
      {children}
    </FavoriteContext.Provider>
  );
};

// custom hook
const useFavorite = () => useContext(FavoriteContext);

export { useFavorite, FavoriteProvider };

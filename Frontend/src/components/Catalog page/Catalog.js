import React, { useContext, useEffect, useState } from "react";
import TopBar from "./TopBar";
import ProductList from "./ProductList";
import { fetchAllProducts, fetchProductsFromCategory } from "../../util";
import { UserContext } from "../Contexts/UserContext";
import { Fab } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from '@mui/icons-material/DarkMode';

const Catalog = ({ toggleTheme, themeMode }) => {
  const [productsArray, setProductsArray] = useState([]);
  const [productsInCart, setProductsInCart] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const { userInfo, activeCart, debouncedGetCart, loggedIn } =
    useContext(UserContext);

  useEffect(() => {
    if (loggedIn) {
      debouncedGetCart();
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedCategory) {
        const allProductsArray = await fetchAllProducts();
        setProductsArray(allProductsArray);
      } else {
        const productsArray = await fetchProductsFromCategory(selectedCategory);
        setProductsArray(productsArray);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    if (!activeCart) return;
    setProductsInCart(activeCart.total_units);
  }, [activeCart]);

  return (
    <>
      <TopBar
        productsInCart={productsInCart}
        filter={{ selectedCategory, setSelectedCategory }}
        userInfo={userInfo}
        cartId={activeCart ? activeCart.id : null}
        debouncedGetCart={debouncedGetCart}
      />
      <ProductList
        productsInCart={productsInCart}
        setProductsInCart={setProductsInCart}
        productsArray={productsArray}
        cartId={activeCart ? activeCart.id : null}
      />
      <Fab
        color="primary"
        aria-label="toggle theme"
        onClick={toggleTheme}
        sx={{
          position: "fixed",
          bottom: "3%",
          right: "2%",
          zIndex: 1200, // Ensures the FAB is above other components
        }}
      >
        {themeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </Fab>
    </>
  );
};

export default Catalog;

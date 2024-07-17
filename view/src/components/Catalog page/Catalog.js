import React, { useContext, useEffect, useState } from "react";
import TopBar from "./TopBar";
import ProductList from "./ProductList";
import {  fetchAllProducts, fetchProductsFromCategory } from "../../util";
import { UserContext } from "../Contexts/UserContext";

const Catalog = () => {
  const [productsArray, setProductsArray] = useState([]);
  const [productsInCart, setProductsInCart] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const {userInfo, activeCart, getCart} = useContext(UserContext);

  useEffect(() => {
    getCart();
  }, [])

  useEffect(() => {
    console.log(`cate id : ${selectedCategory}`);
    const fetchProducts = async () => {
      if (!selectedCategory) {
        const allProductsArray = await fetchAllProducts();
        setProductsArray(allProductsArray);
      } else {
        const productsArray = await fetchProductsFromCategory(selectedCategory);
        setProductsArray(productsArray);
        console.log(productsArray);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    if (!activeCart) return
    setProductsInCart(activeCart.total_units)
  }, [activeCart]);

  return (
    <>
      <TopBar 
        productsInCart={productsInCart} 
        filter={{selectedCategory, setSelectedCategory}} 
        userInfo={userInfo} 
        cartId={activeCart ? activeCart.id : null}
        getCart={getCart}
      />
      <ProductList
        productsInCart={productsInCart}
        setProductsInCart={setProductsInCart}
        productsArray={productsArray}
        cartId={activeCart ? activeCart.id : null}
      />
    </>
  );
};

export default Catalog;

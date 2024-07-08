import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import ProductList from "./ProductList";
import { fetchAllProducts, fetchProductsFromCategory } from "../../util";

const Catalog = () => {
  const [productsArray, setProductsArray] = useState([]);
  const [productsInCart, setProductsInCart] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);

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

  return (
    <>
      <TopBar productsInCart={productsInCart} filter={{selectedCategory, setSelectedCategory}} />
      <ProductList
        productsInCart={productsInCart}
        setProductsInCart={setProductsInCart}
        productsArray={productsArray}
      />
    </>
  );
};

export default Catalog;

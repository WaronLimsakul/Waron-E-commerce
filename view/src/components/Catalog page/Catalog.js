import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import ProductList from "./ProductList";
import { createCartInCatalog, fetchAllProducts, fetchProductsFromCategory, fetchUser, getCartInCatalog } from "../../util";

const Catalog = () => {
  const [productsArray, setProductsArray] = useState([]);
  const [productsInCart, setProductsInCart] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [activeCart, setActiveCart] = useState(null);

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
    const getUser = async () => {
      const fetchedUser = await fetchUser();
      console.log(fetchedUser);
      setUserInfo(fetchedUser);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!userInfo) return
    const getCart = async () => {
      try {let cart = await getCartInCatalog(userInfo.id);
      if (!cart) {
         cart = await createCartInCatalog(userInfo.id);
      }
      setActiveCart(cart);
      setProductsInCart(cart.total_units);} 
      catch (e) {
        console.error("error fetching or creating cart", e);
      }
    };
    getCart()
  }, [userInfo]);


  return (
    <>
      <TopBar productsInCart={productsInCart} filter={{selectedCategory, setSelectedCategory}} userInfo={userInfo} cartId={activeCart ? activeCart.id : null}/>
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

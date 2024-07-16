import React, { createContext, useState, useEffect } from "react";
import { createCartInCatalog, fetchUser, getCartInCatalog } from "../util";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [activeCart, setActiveCart] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const fetchedUser = await fetchUser();
      setUserInfo(fetchedUser);
    };
    getUser();
  }, []);

  const getCart = async () => {
    try {
      let fetchedCart = await getCartInCatalog(userInfo.id);
      if (!fetchedCart) {
        fetchedCart = await createCartInCatalog();
      }
      setActiveCart(fetchedCart);
    } catch (e) {
      console.error("Error fetching or creating cart", e);
    }
  };
  
  useEffect(() => {
    if (!userInfo) return;
    getCart();
  }, [userInfo]);

  return (
    <UserContext.Provider value={{userInfo, activeCart, getCart}}>{children}</UserContext.Provider>
  );
};

export {UserContext, UserProvider};

import React, { createContext, useState, useEffect, useCallback } from "react";
import { createCartInCatalog, fetchUser, getCartInCatalog } from "../../util";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [activeCart, setActiveCart] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [fetchingCart, setFetchingCart] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const fetchedUser = await fetchUser();
      if (!fetchedUser) return
      setUserInfo(fetchedUser);
      setLoggedIn(true);
    };
    getUser();
  }, []);


  const debouncedGetCart = useCallback(async () => {
    if (!loggedIn || fetchingCart) return;

    setFetchingCart(true);
    try {
      let fetchedCart = await getCartInCatalog(userInfo.id);
      if (!fetchedCart) {
        fetchedCart = await createCartInCatalog();
      }
      setActiveCart(fetchedCart);
    } catch (e) {
      console.error("Error fetching or creating cart", e);
    } finally {
      setFetchingCart(false);
    }
  }, [loggedIn, fetchingCart, userInfo]);
  
  useEffect(() => {
    if (loggedIn && userInfo) {
      debouncedGetCart();
    }
  }, [userInfo]);

  return (
    <UserContext.Provider value={{userInfo, activeCart, loggedIn, debouncedGetCart}}>{children}</UserContext.Provider>
  );
};

export {UserContext, UserProvider};

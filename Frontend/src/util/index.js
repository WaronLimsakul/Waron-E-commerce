
export const handleRegister = async (username, password) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // if key-value have the same name, do this
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result.message;
    } else {
      return null
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const handleLogin = async (username, password) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    if (response.ok) {
      return { message: result.message, authenticate: true }; // Login success!
    } else {
      return { message: result.message, authenticate: false };
    }
  } catch (error) {
    console.error("Error", error);
  }
};

export const handleGoogleLogin = () => {
  window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
};

export const fetchAllProducts = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/products`,
      {
        method: "GET",
      }
    );
    return response.json();
  } catch (err) {
    console.error(err);
  }
};

export const fetchUser = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const result = await response.json();
      return { username: result.username, id: result.id };
    } else {
      console.error("Failed to fetch user", response.statusText);
      return 
    }
  } catch (e) {
    console.error(e);
    return 
  }
};

export const fetchProductsFromCategory = async (id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/products?categoryId=${id}`,
      {
        method: "GET",
      }
    );
    return response.json();
  } catch (err) {
    console.error(err);
  }
};

export const handleLogout = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/logout`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      return
    } else {
      throw new Error("log out fail");
    }
  } catch (e) {
    console.error(e);
  }
};

export const getCartInCatalog = async (id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/accounts/${id}/cart`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      const cart = await response.json();
      return cart;
    } else if (response.status === 404) {
      return null;
    } else {
      console.err("fail to get cart");
    }
  } catch (error) {
    console.error(error);
  }
};

export const createCartInCatalog = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/cart`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      const newCart = await response.json();
      console.log("create new cart");
      return newCart;
    } else {
      console.error("failed to create cart");
    }
  } catch (e) {
    console.error(e);
  }
};

export const addItemToCart = async (cartId, productId, quantity) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/cart/${cartId}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      }
    );
    if (response.ok) {
      const result = await response.json();
      return result.detail;
    } else {
      console.error("failed to add Item");
    }
  } catch (e) {
    console.error(e);
  }
};

export const getCartDetail = async (cartId) => {
  // fetch from new route that will join producst and products_carts
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/accounts/${cartId}/cart/detail`,
      { method: "GET", credentials: "include" }
    );
    if (response.ok) {
      const cartDetail = await response.json();
      return cartDetail;
    } else {
      console.error(response.error);
    }
  } catch (e) {
    console.error(e);
  }
};

export const removeItem = async (cartId, productId) => {
  try {
    
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/cart/${cartId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      }
    );
    if (response.ok) {
      return response.cart;
    } else {
      console.error("failed removing item");
    }
  } catch (e) {
    console.error(e);
  }
};

export const getOrderHistory = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/orders`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      const ordersResult = await response.json();
      return ordersResult;
    } else {
      console.error("failed to fetch order history");
    }
  } catch (err) {
    console.error(err);
  }
};

export const updateAccount = async (accountId, formValues) => {
  try {
    const { fullName, email, dateOfBirth, address } = formValues;
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/accounts/${accountId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          date_of_birth: dateOfBirth,
          address: address,
        }),
      }
    );
    if (response.ok) {
      return await response.json(); // message , detail
    } else {
      console.error("fail to update account at utility");
    }
  } catch (err) {
    console.error(err);
  }
};

export const fetchAccountDetail = async (id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/accounts/${id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      console.error(response.error);
    }
  } catch (err) {
    console.error(err);
  }
};

export const handleRegister = async (username, password) => {
  try {
    console.log(process.env.REACT_APP_BACKEND_URL);
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
      console.log(result.message); //
    } else {
      throw new Error("Register failed!");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const handleLogin = async (username, password) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (response.ok) {
      console.log(result.message);
      console.log(result.user);
      return { message: result.message, authenticate: true }; // Login success!
    } else {
      console.log(result.message);
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

export const fetchUsername = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const result = await response.json();
      return result["username"];
    } else {
      console.error("Failed to fetch user", response.statusText);
    }
  } catch (e) {
    console.error(e);
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

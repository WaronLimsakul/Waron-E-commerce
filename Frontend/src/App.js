import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Catalog from "./components/Catalog page/Catalog";
import Checkout from "./components/Checkout";
import { UserProvider } from "./components/Contexts/UserContext";
import Account from "./components/Account";
import { SessionProvider } from "./components/Contexts/SessionContext";

function App({ toggleTheme, themeMode }) {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/catalog"
            element={
              <UserProvider>
                <Catalog toggleTheme={toggleTheme} themeMode={themeMode}/>
              </UserProvider>
            }
          />
          <Route
            path="/checkout"
            element={
              <UserProvider>
                <Checkout />
              </UserProvider>
            }
          />
          <Route
            path="/account"
            element={
              <UserProvider>
                <Account />
              </UserProvider>
            }
          />
        </Routes>
      </Router>
    </SessionProvider>
  );
}

export default App;

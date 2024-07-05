const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/queries");
const accounts = require("./db/accounts");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();

////////////////////////////////////////////////////////// session and server configuration
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true })); // work

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "foS5gMf6Y6",
    cookie: { maxAge: 1000 * 60 * 10, secure: false, sameSite: "none" },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(accounts.login);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(accounts.deserializeAccountById);

////////////////////////////////////////////////////////// login - register -logout
app.post("/login", (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed' });
      }
      res.json({ message: 'Login successful' });
    });
  })(req, res, next);
});

app.post("/register", async (req, res) => {
  try {
    const newAccount = await accounts.createAccount(req.body);
    res.status(201).json({ message: "register success", newAccount });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("error logging out");
    }
    res.send("logout successful");
  });
});

////////////////////////////////////////////////////////// endpoint part

////////////////// accounts
app.get("/accounts", db.getAllAccounts);
app.get(
  "/accounts/:id",
  accounts.checkAuthenticated,
  accounts.isOwner,
  db.getAccountById
);
app.put(
  "/accounts/:id",
  accounts.checkAuthenticated,
  accounts.isOwner,
  db.updateAccountById
);

////////////////// products
app.get("/products", (req, res, next) => {
  const { categoryId } = req.query;
  if (categoryId) {
    db.getProductByCategoryId(req, res, next);
  } else {
    db.getAllProducts(req, res, next);
  }
});
app.get("/products/:id", db.getProductById);

////////////////// carts
app.get(
  "/accounts/:id/cart",
  accounts.checkAuthenticated,
  accounts.isOwner,
  db.getCart
);
app.post("/cart", accounts.checkAuthenticated, db.createCart);
app.post(
  "/cart/:id",
  accounts.checkAuthenticated,
  accounts.isOwnerOfCart,
  db.updateCart
);

//////////////////checkout = carts + orders
app.post("/cart/:id/checkout", accounts.checkAuthenticated, db.checkout);

////////////////// orders
app.get("/orders", accounts.checkAuthenticated, db.getOrderHistory); //should be order history
app.get(
  "/orders/:id",
  accounts.checkAuthenticated,
  accounts.isOwner,
  db.getOrderById
);

////////////////////////////////////////////////////////// activate server
app.listen(3001, () => {
  console.log("listen to server 3001");
});

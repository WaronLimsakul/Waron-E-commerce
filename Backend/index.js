const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/queries");
const accounts = require("./db/accounts");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const { body, validationResult } = require("express-validator");
const pgSession = require("connect-pg-simple")(session);
const { Pool } = require("pg");

////////////////////////////////////////////////////////// session and server configuration
const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());

app.enable("trust proxy");

app.use(
    cors({
        credentials: true,
        origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_2],
        exposedHeaders: ["Set-Cookie"],
    }),
); // work

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    ssl: {
        rejectUnauthorized: false,
    },
});

app.use(
    // check this setting
    session({
        store: new pgSession({ pool: pool }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        name: "session-cookie",
        cookie: {
            maxAge: 1000 * 60 * 30,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            domain:
                process.env.NODE_ENV === "production"
                    ? ".waron-limsakul.com"
                    : undefined,
        }, //when samesite: none => must secure : true
    }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(accounts.login);
passport.serializeUser((user, done) => {
    try {
        done(null, user.id);
    } catch (error) {
        done(error);
    }
});
passport.deserializeUser(accounts.deserializeAccountById);
passport.use(accounts.GoogleLogin);

////////////////////////////////////////////////////////// login - register -logout
app.post(
    "/login",
    [
        body("username").notEmpty().trim().escape(),
        body("password").notEmpty().trim().escape(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            if (!user) {
                return res.status(400).json({ message: info.message });
            }
            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({ message: "Login failed" });
                }
                res.json({ message: "Login successful" }); // still not deserialize yet
                console.log("Session after login:", req.session);
            });
        })(req, res, next);
    },
);

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${process.env.FRONTEND_URL}/login`,
    }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/catalog`);
    },
);

app.post("/register", async (req, res) => {
    try {
        const newAccount = await accounts.createAccount(req.body);
        res.status(200).json({ message: "register success", newAccount });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send("error logging out");
        }
        res.json({ message: "logout success" });
    });
});

app.get("/user", accounts.checkAuthenticated, (req, res) => {
    res.json({ username: req.user.username, id: req.user.id });
});

app.post("/extend-session", accounts.checkAuthenticated, (req, res) => {
    // Extend the session expiration time
    req.session.cookie.maxAge = 1000 * 60 * 30; // Reset to 30 minutes
    res.json({ success: true });
});

////////////////////////////////////////////////////////// endpoint part

////////////////// accounts
app.get("/accounts", db.getAllAccounts);
app.get(
    "/accounts/:id",
    accounts.checkAuthenticated,
    accounts.isOwner,
    db.getAccountById,
);
app.put(
    "/accounts/:id",
    accounts.checkAuthenticated,
    accounts.isOwner,
    [
        body("full_name").notEmpty().trim(),
        body("date_of_birth").notEmpty(),
        body("address").notEmpty().trim(),
        body("email").notEmpty().isEmail().normalizeEmail(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    db.updateAccountById,
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
    db.getCart,
);
app.get(
    "/accounts/:id/cart/detail", //id in this case means cart id
    accounts.checkAuthenticated,
    accounts.isOwnerOfCart,
    db.getCartDetail,
);
app.post("/cart", accounts.checkAuthenticated, db.createCart);
app.post(
    "/cart/:id",
    accounts.checkAuthenticated,
    accounts.isOwnerOfCart,
    db.updateCart,
);
app.delete(
    "/cart/:id",
    accounts.checkAuthenticated,
    accounts.isOwnerOfCart,
    db.removeItem,
); //cart id (body contain product id then)

//////////////////checkout = carts + orders
app.post(
    "/cart/:id/checkout",
    accounts.checkAuthenticated,
    accounts.isOwnerOfCart,
    db.checkout,
);
app.post(
    "/cart/:id/confirm-order",
    accounts.checkAuthenticated,
    accounts.isOwnerOfCart,
    db.confirmOrder,
);

////////////////// orders
app.get("/orders", accounts.checkAuthenticated, db.getOrderHistory); //should be order history
app.get(
    "/orders/:id",
    accounts.checkAuthenticated,
    accounts.isOwner,
    db.getOrderById,
);

////////////////////////////////////////////////////////// activate server
app.listen(PORT, () => {
    console.log("listen to server on port", PORT);
});

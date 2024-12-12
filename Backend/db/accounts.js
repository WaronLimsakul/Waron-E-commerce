const Pool = require("pg").Pool;
require("dotenv").config();

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
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const GoogleLogin = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const { id, emails } = profile;
            const googleEmail = emails[0].value;

            let user = await pool.query(
                "SELECT * FROM accounts WHERE google_id = $1 OR google_email = $2",
                [id, googleEmail],
            );
            if (user.rows.length === 0) {
                user = await pool.query(
                    "INSERT INTO accounts (google_id, google_email) VALUES ($1 ,$2) RETURNING *",
                    [id, googleEmail],
                );
                userDetail = await pool.query(
                    "INSERT INTO accounts_detail (email) VALUES ($1)",
                    [googleEmail],
                ); // google
            } else {
                user = user.rows[0];
            }
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    },
);

const createAccount = async (account) => {
    const { username, password } = account;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const results = await pool.query(
            "INSERT INTO accounts (username, password) VALUES ($1, $2) RETURNING id, username",
            [username, hashedPassword],
        );
        const newAccount = results.rows[0];
        const accountDetail = await pool.query(
            "INSERT INTO accounts_detail (account_id, full_name) VALUES ($1, $2)",
            [newAccount.id, username],
        );
        return newAccount;
    } catch (err) {
        console.error("Error creating account", err);
        throw err;
    }
};

const login = new localStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
        try {
            const result = await pool.query(
                "SELECT * FROM accounts WHERE username = $1",
                [username],
            );
            if (result.rows.length === 0)
                return done(null, false, { message: "Incorrect Username." });

            const user = result.rows[0];
            const isMatched = await bcrypt.compare(password, user.password);
            if (!isMatched) {
                return done(null, false, { message: "Incorrect Password" });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    },
);

const deserializeAccountById = async (id, done) => {
    try {
        const result = await pool.query("SELECT * FROM accounts WHERE id = $1", [
            id,
        ]);
        if (result.rows.length == 0) {
            done(new Error("User not found"));
        }
        done(null, result.rows[0]);
    } catch (err) {
        done(err);
    }
};

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        // User is authenticated, proceed to the next middleware
        return next();
    } else {
        // User is not authenticated, return a 401 Unauthorized response
        res.status(401).json({ error: "Unauthorized" });
    }
};

const isOwner = (req, res, next) => {
    const requestedUserId = parseInt(req.params.id);
    const authenticatedUserId = parseInt(req.user.id);

    if (requestedUserId !== authenticatedUserId) {
        return res.status(401).json({ error: "You're not him" });
    }
    next();
};

const isOwnerOfCart = async (req, res, next) => {
    const cartId = parseInt(req.params.id);
    try {
        const user = await pool.query("SELECT * FROM carts WHERE id = $1", [
            cartId,
        ]);
        const cartOwnerId = user.rows[0].account_id;
        const authenticatedUserId = parseInt(req.user.id);

        if (cartOwnerId !== authenticatedUserId) {
            return res.status(401).json({ error: "You're not the cart's owner" });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
};

module.exports = {
    createAccount,
    login,
    deserializeAccountById,
    checkAuthenticated,
    isOwner,
    isOwnerOfCart,
    GoogleLogin,
};

const Pool = require("pg").Pool;
require("dotenv").config();

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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

////////////////////////////////////////////////// Accounts
const getAllAccounts = (req, res) => {
    pool.query(
        "SELECT id, username FROM accounts ORDER BY id",
        (err, results) => {
            if (err) {
                throw err;
            }
            res.status(200).json(results.rows);
        },
    );
};
const getAccountById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(
        "SELECT * FROM accounts_detail WHERE account_id = $1",
        [id],
        (err, results) => {
            if (err) {
                console.error("Error fetching account by ID", err);
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            res.status(200).json(results.rows[0]);
        },
    );
};
const updateAccountById = async (req, res) => {
    const id = parseInt(req.params.id);
    const { full_name, email, date_of_birth, address } = req.body;
    try {
        if (full_name) {
            await pool.query(
                "UPDATE accounts_detail SET full_name = $1 WHERE account_id = $2",
                [full_name, id],
            );
        }
        if (email) {
            await pool.query(
                "UPDATE accounts_detail SET email = $1 WHERE account_id = $2",
                [email, id],
            );
        }
        if (date_of_birth) {
            await pool.query(
                "UPDATE accounts_detail SET date_of_birth = $1 WHERE account_id = $2",
                [date_of_birth, id],
            );
        }
        if (address) {
            await pool.query(
                "UPDATE accounts_detail SET address = $1 WHERE account_id = $2",
                [address, id],
            );
        }
        const updatedAccount = await pool.query(
            "SELECT * FROM accounts_detail WHERE account_id = $1",
            [id],
        );
        res
            .status(200)
            .json({ message: "update success!", detail: updatedAccount.rows[0] });
    } catch (err) {
        res.status(500).send("error updating accounts");
    }
};

////////////////////////////////////////////////// Products
const getAllProducts = (req, res) => {
    pool.query("SELECT * FROM products ORDER BY id", (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).json(results.rows);
    });
};

const getProductById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query("SELECT * FROM products WHERE id = $1", [id], (err, results) => {
        if (err) {
            console.error("Error fetching product by ID", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.status(200).json(results.rows);
    });
};

const getProductByCategoryId = (req, res) => {
    const { categoryId } = req.query;
    pool.query(
        "SELECT * FROM products WHERE category_id = $1",
        [categoryId],
        (err, results) => {
            if (err) {
                console.error("Error fetching product by category", err);
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            res.status(200).json(results.rows);
        },
    );
};

////////////////////////////////////////////////// Help calculate total price
const calculateTotalPrice = async (cartId) => {
    try {
        const result = await pool.query(
            `SELECT SUM(pc.quantity * p.price) AS total_price
      FROM products_carts pc 
      JOIN products p ON pc.product_id = p.id 
      WHERE pc.cart_id = $1`,
            [cartId],
        );
        if (result.rows.length > 0) {
            return result.rows[0].total_price;
        } else {
            return 0;
        }
    } catch (err) {
        console.error(err);
    }
};

////////////////////////////////////////////////// Carts
const getCart = async (req, res) => {
    const accountId = parseInt(req.params.id);
    try {
        const cart = await pool.query(
            "SELECT * FROM carts WHERE account_id = $1 AND checked_out = false",
            [accountId],
        );
        if (cart.rows.length == 0) {
            return res
                .status(404)
                .json({ message: "cart not found", statusCode: 404 });
        }
        res.json(cart.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getCartDetail = async (req, res) => {
    const cartId = req.params.id;
    try {
        const cartDetail = await pool.query(
            `
      WITH carts_products AS (
        SELECT product_id, quantity, total_price 
        FROM carts JOIN products_carts ON products_carts.cart_id = carts.id 
        WHERE id = $1
      ) 
      SELECT product_id,	quantity,	total_price, name,	price 
      FROM carts_products 
      JOIN products 
      ON carts_products.product_id = products.id;`,
            [cartId],
        );
        // if (cartDetail.rows.length === 0) {
        //   res.status(404).json({message: "cart's detail not found"})
        // }
        res.status(200).json(cartDetail.rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "internal server error" });
    }
};

const createCart = async (req, res) => {
    //assume that the user is authenticated
    const userId = req.user.id;
    try {
        const existingCart = await pool.query(
            "SELECT * FROM carts WHERE account_id = $1 AND checked_out = false",
            [userId],
        );
        if (existingCart.rows.rength > 0) {
            return res.redirect(`/accounts/${userId}/cart`);
        }
        const newCart = await pool.query(
            "INSERT INTO carts (account_id, created_at, updated_at) VALUES ($1, NOW(), NOW()) RETURNING *",
            [userId],
        );
        res.status(201).json(newCart.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
        throw err;
    }
};

const updateCart = async (req, res) => {
    const cartId = parseInt(req.params.id); // NO, how they suppose to know the cart id?
    const { productId, quantity } = req.body;

    try {
        const existingProduct = await pool.query(
            "SELECT * FROM products_carts WHERE cart_id = $1 AND product_id = $2",
            [cartId, productId],
        );
        if (existingProduct.rows.length > 0) {
            const updatedCart = await pool.query(
                "UPDATE products_carts SET quantity = quantity + $1, updated_at = NOW() WHERE cart_id = $2 AND product_id = $3 RETURNING *",
                [quantity, cartId, productId],
            );
            const totalUnits = await pool.query(
                "SELECT SUM(quantity) AS total_units FROM products_carts WHERE cart_id = $1",
                [cartId],
            );
            const totalPrice = await calculateTotalPrice(cartId);
            const cartNow = await pool.query(
                "UPDATE carts SET total_price = $1, total_units = $2 WHERE id = $3 RETURNING id, updated_at, total_price, total_units",
                [totalPrice, totalUnits.rows[0].total_units, cartId],
            );
            return res
                .status(200)
                .json({ cart: cartNow.rows[0], detail: updatedCart.rows[0] });
        }
        const newProduct = await pool.query(
            "INSERT INTO products_carts (cart_id, product_id, quantity, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *",
            [cartId, productId, quantity],
        );
        const totalPrice = await calculateTotalPrice(cartId);
        const totalUnits = await pool.query(
            "SELECT SUM(quantity) AS total_units FROM products_carts WHERE cart_id = $1",
            [cartId],
        );
        const cartNow = await pool.query(
            "UPDATE carts SET total_price = $1, total_units = $2 WHERE id = $3 RETURNING id, updated_at, total_price, total_units",
            [totalPrice, totalUnits.rows[0].total_units, cartId],
        );
        res.status(201).json({ cart: cartNow.rows[0], detail: newProduct.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        throw err;
    }
};

const removeItem = async (req, res) => {
    // carts updated at, total price, total units
    // products_carts delete a whole row
    try {
        const cartId = parseInt(req.params.id);
        const { productId } = req.body;
        const deletedProduct = await pool.query(
            "DELETE FROM products_carts WHERE product_id = $1 AND cart_id = $2 RETURNING quantity",
            [productId, cartId],
        );
        if (deletedProduct.rows.length === 0) {
            res.status(404).json({ message: "cart or product not found" });
        }
        const deletedQuantity = deletedProduct.rows[0].quantity; //not sure
        const newTotalPrice = await calculateTotalPrice(cartId);
        const cartNow = await pool.query(
            "UPDATE carts SET updated_at = NOW(), total_price = $1, total_units = total_units - $2 WHERE id = $3 AND checked_out = false RETURNING *",
            [newTotalPrice, deletedQuantity, cartId],
        );
        res.status(200).json({ cart: cartNow.rows[0] }); //if 204, you can't send json response
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed removing item: internal server error");
    }
};

////////////////////////////////////////////////// Checkout

const checkout = async (req, res) => {
    const cartId = parseInt(req.params.id);
    const accountId = parseInt(req.user.id);
    const { amount, paymentIntentId } = req.body;
    try {
        // check if cart exist + has products
        const cart = await pool.query(
            "SELECT * FROM carts WHERE id = $1 AND account_id = $2 AND checked_out = false",
            [cartId, accountId],
        );
        if (cart.rows.length == 0) {
            return res
                .status(404)
                .json({ error: "Cart not found or already checked out" });
        }
        const cartProducts = await pool.query(
            "SELECT * FROM products_carts WHERE cart_id = $1",
            [cartId],
        );
        if (cartProducts.rows.length == 0) {
            return res.status(404).send({ error: "Items not found" });
        }

        // check if there is already payment intent
        let paymentIntent;
        if (paymentIntentId) {
            paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        }

        // if there is no or lacks method, create new one
        if (!paymentIntent || paymentIntent.status !== "requires_payment_method") {
            paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: "usd",
                automatic_payment_methods: {
                    enabled: true,
                },
            });
        }

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const confirmOrder = async (req, res) => {
    const cartId = parseInt(req.params.id);
    const accountId = parseInt(req.user.id);
    const { paymentIntentId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        // confirm payment
        if (paymentIntent.status !== "succeeded") {
            return res.status(500).json({ error: "Payment failed" });
        }

        // get the cart and products in it
        const cart = await pool.query(
            "SELECT * FROM carts WHERE id = $1 AND account_id = $2 AND checked_out = false",
            [cartId, accountId],
        );
        const cartProducts = await pool.query(
            "SELECT * FROM products_carts WHERE cart_id = $1",
            [cartId],
        );

        const orderResult = await pool.query(
            `INSERT INTO orders (account_id, order_date, total_price, status) 
    VALUES ($1, CURRENT_DATE, $2, $3) RETURNING *`,
            [accountId, cart.rows[0].total_price, "completed"],
        );
        const newOrder = orderResult.rows[0];

        // tick checked_out cart
        await pool.query(`UPDATE carts SET checked_out = true WHERE id = $1`, [
            cartId,
        ]);

        // send products in cart to order
        for (const product of cartProducts.rows) {
            await pool.query(
                `INSERT INTO products_orders (product_id, order_id, quantity, account_id) VALUES ($1, $2, $3, $4)`,
                [product.product_id, newOrder.id, product.quantity, accountId],
            );
        }
        res.status(200).json({ message: "Order created successfully", newOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Internal server error ${err}` });
    }
};

////////////////////////////////////////////////// Orders
const getAllOrders = (req, res) => {
    pool.query("SELECT * FROM orders ORDER BY id", (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).json(results.rows);
    });
};

const getOrderById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query("SELECT * FROM orders WHERE id = $1", [id], (err, results) => {
        if (err) {
            console.error("Error fetching order by ID", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        res.status(200).json(results.rows);
    });
};

const getOrderHistory = async (req, res) => {
    // not complete, not telling products or amount
    const accountId = parseInt(req.user.id);
    try {
        const orderResult = await pool.query(
            `WITH history AS (SELECT order_id, order_date, po.account_id, product_id, quantity 
        FROM orders 
        JOIN products_orders po 
        ON orders.id = po.order_id AND orders.account_id = po.account_id
        WHERE po.account_id = $1)
        SELECT order_id, order_date, history.account_id, product_id, quantity, name
        FROM history
        JOIN products 
        ON products.id = history.product_id`,
            [accountId],
        );
        if (orderResult.rows.length == 0) {
            // also test
            return res.send("No order found");
        }
        const orderHistory = orderResult.rows;
        res.json(orderHistory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "internal server error" });
    }
};

////////////////////////////////////////////////// exports
module.exports = {
    getAllProducts,
    getProductById,
    getProductByCategoryId,
    getAccountById,
    getAllAccounts,
    updateAccountById,
    getCart,
    getCartDetail,
    createCart,
    updateCart,
    removeItem,
    getOrderById,
    getAllOrders,
    getOrderHistory,
    checkout,
    confirmOrder,
};

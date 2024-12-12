--
-- PostgreSQL database dump
--

-- Dumped from database version 12.19
-- Dumped by pg_dump version 12.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--ALTER TABLE public.accounts_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id integer DEFAULT nextval('public.accounts_id_seq'::regclass) NOT NULL,
    username character varying,
    password character varying,
    google_id character varying(255),
    google_email character varying(255)
);


--ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: accounts_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts_detail (
    account_id integer DEFAULT nextval('public.accounts_id_seq'::regclass) NOT NULL,
    full_name character varying,
    date_of_birth date,
    address character varying,
    email character varying
);


--ALTER TABLE public.accounts_detail OWNER TO postgres;

--
-- Name: accounts_detail_account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accounts_detail_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--ALTER TABLE public.accounts_detail_account_id_seq OWNER TO postgres;

--
-- Name: accounts_detail_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accounts_detail_account_id_seq OWNED BY public.accounts_detail.account_id;


--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--ALTER TABLE public.carts_id_seq OWNER TO postgres;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id integer DEFAULT nextval('public.carts_id_seq'::regclass) NOT NULL,
    account_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    checked_out boolean DEFAULT false NOT NULL,
    total_price numeric DEFAULT '0'::numeric NOT NULL,
    total_units integer DEFAULT 0 NOT NULL
);


--ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying NOT NULL
);


--ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer DEFAULT nextval('public.orders_id_seq'::regclass) NOT NULL,
    order_date date,
    total_price numeric,
    status character varying,
    account_id integer
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer DEFAULT nextval('public.products_id_seq'::regclass) NOT NULL,
    name character varying NOT NULL,
    price numeric NOT NULL,
    stock integer,
    description character varying(200),
    category_id integer,
    picture_url text
);


--ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_carts (
    product_id integer NOT NULL,
    cart_id integer NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.products_carts OWNER TO postgres;

--
-- Name: products_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_orders (
    product_id integer NOT NULL,
    order_id integer NOT NULL,
    quantity integer NOT NULL,
    account_id integer NOT NULL
);


--ALTER TABLE public.products_orders OWNER TO postgres;

-- New table for storing session.
CREATE TABLE public.session (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSON NOT NULL,
    expire TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL
);

--ALTER TABLE public.random OWNER TO postgres;

--
-- Name: random_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.random_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--ALTER TABLE public.random_id_seq OWNER TO postgres;

CREATE TABLE "session" (
  "sid" VARCHAR NOT NULL COLLATE "default",
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL,
  PRIMARY KEY ("sid")
) WITH (OIDS=FALSE);


--
-- Name: random_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.random_id_seq OWNED BY public.random.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: random id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.random ALTER COLUMN id SET DEFAULT nextval('public.random_id_seq'::regclass);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_username_key UNIQUE (username);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products_carts products_carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_carts
    ADD CONSTRAINT products_carts_pkey PRIMARY KEY (product_id, cart_id);


--
-- Name: products_orders products_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_orders
    ADD CONSTRAINT products_orders_pkey PRIMARY KEY (product_id, order_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: random random_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.random
    ADD CONSTRAINT random_pkey PRIMARY KEY (id);


--
-- Name: accounts_detail accounts_detail_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts_detail
    ADD CONSTRAINT accounts_detail_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: carts carts_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: orders orders_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: products_carts products_carts_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_carts
    ADD CONSTRAINT products_carts_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: products_carts products_carts_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_carts
    ADD CONSTRAINT products_carts_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: products_orders products_orders_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_orders
    ADD CONSTRAINT products_orders_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: products_orders products_orders_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_orders
    ADD CONSTRAINT products_orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


ALTER TABLE public.accounts_id_seq OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.accounts OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.accounts_detail OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.accounts_detail_account_id_seq OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.carts_id_seq OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.carts OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.categories OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.categories_id_seq OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.orders_id_seq OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.orders OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.products_id_seq OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.products OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.products_carts OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.products_orders OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.random OWNER TO "WaronEC_DB_owner";
ALTER TABLE public.random_id_seq OWNER TO "WaronEC_DB_owner";

-- Insert data into the categories table
INSERT INTO categories (id, name) VALUES
(1, 'Grocery'),
(2, 'Pet'),
(3, 'Electronics'),
(4, 'Fashion'),
(5, 'Home & Kitchen'),
(6, 'Beauty & Personal Care'),
(7, 'Sports & Outdoors'),
(8, 'Toys & Games'),
(9, 'Health & Wellness'),
(10, 'Automotive');

-- Insert data into the products table
INSERT INTO products (id, name, price, stock, description, category_id, picture_url) VALUES
(1, 'sofa', 120.00, 5, 'Comfortable and stylish sofa with plush cushions and durable fabric. Perfect for any living room.', 5, 'https://i.pinimg.com/736x/ef/8c/23/ef8c23bb773239fb665f9dcfff8a6517.jpg'),
(2, 'T-shirt', 10.00, 100, 'Comfortable and stylish t-shirt made from high-quality fabric. Available in various colors and sizes.', 4, 'https://www.shoei-europe.com/shop/media/image/1f/b5/61/X-Logo-T-Shirt-White-1.png'),
(3, 'X-Box', 500.00, 15, 'Latest model X-Box gaming console with high-definition graphics and an extensive library of games.', 3, 'https://i5.walmartimages.com/asr/9f8c06f5-7953-426d-9b68-ab914839cef4.5f15be430800ce4d7c3bb5694d4ab798.jpeg'),
(4, 'PSP', 300.00, 20, 'Portable gaming system with a vibrant display and a wide variety of game titles.', 3, 'https://m.media-amazon.com/images/I/615gWr9r13L._SL1500_.jpg'),
(5, 'horse', 5000.00, 2, 'Well-trained horse suitable for riding and competitions. Excellent temperament and health.', 2, 'https://cdn.britannica.com/96/1296-050-4A65097D/gelding-bay-coat.jpg'),
(7, 'Apple', 1.00, 100, 'Crisp and delicious apples, perfect for a healthy snack. Rich in fiber and vitamins.', 1, 'https://images.pexels.com/photos/206959/pexels-photo-206959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(8, 'Banana', 0.50, 200, 'Fresh bananas, ideal for smoothies, snacks, and desserts. High in potassium and vitamins.', 1, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(9, 'Dog Food', 20.00, 50, 'Premium dog food with balanced nutrients for adult dogs. Supports overall health and vitality.', 2, 'https://images.pexels.com/photos/8434637/pexels-photo-8434637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(10, 'Cat Toy', 5.00, 150, 'Interactive cat toy to keep your feline friend entertained. Durable and safe for all cats.', 2, 'https://images.pexels.com/photos/6853522/pexels-photo-6853522.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(11, 'Smartphone', 699.99, 30, 'Latest model smartphone with high-resolution display, powerful processor, and long-lasting battery.', 3, 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(12, 'Laptop', 999.99, 20, 'High-performance laptop with fast processing speed, ample storage, and sleek design. Perfect for work and play.', 3, 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(13, 'Black T-Shirt', 15.00, 100, 'Classic black t-shirt made from high-quality cotton. Comfortable and versatile for everyday wear.', 4, 'https://images.pexels.com/photos/17767213/pexels-photo-17767213/free-photo-of-man-sitting-on-an-outdoor-bench-with-a-smart-phone-in-hands.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(14, 'Jeans', 40.00, 60, 'Stylish and durable jeans with a comfortable fit. Perfect for casual and semi-formal occasions.', 4, 'https://images.pexels.com/photos/4505458/pexels-photo-4505458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(15, 'Blender', 50.00, 40, 'Powerful blender with multiple speed settings. Ideal for smoothies, soups, and sauces.', 5, 'https://images.pexels.com/photos/7937012/pexels-photo-7937012.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(16, 'Cookware Set', 100.00, 30, 'Complete cookware set including pots, pans, and utensils. Non-stick and dishwasher safe.', 5, 'https://www.ikea.com/th/en/images/products/ikea-365-9-piece-cookware-set-stainless-steel__1006153_pe825739_s5.jpg?f=s'),
(17, 'Shampoo', 10.00, 80, 'Nourishing shampoo for all hair types. Leaves hair clean, soft, and manageable.', 6, 'https://images.pexels.com/photos/4465121/pexels-photo-4465121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'),
(18, 'Face Cream', 25.00, 70, 'Hydrating face cream that provides long-lasting moisture. Suitable for all skin types.', 6, 'https://5.imimg.com/data5/SELLER/Default/2023/12/370222177/QX/JK/HT/54980860/fairness-cream.jpg'),
(19, 'Yoga Mat', 20.00, 50, 'High-density yoga mat with a non-slip surface. Provides excellent support and cushioning for yoga and exercise.', 7, 'https://www.health.com/thmb/5qSPC2oVoqx5uUz-fnLLgIQ5cXU=/5472x0/filters:no_upscale():max_bytes(150000):strip_icc()/yoga-mat-test-group-nick-kova-photo-18-b468766266e14c358d482f1259b3d439.jpg'),
(20, 'Tent', 150.00, 20, 'Spacious and weather-resistant tent for camping. Easy to set up and suitable for all seasons.', 7, 'https://www.coreequipment.com/cdn/shop/products/40119_hero_1.jpg?v=1569964201'),
(21, 'Action Figure', 15.00, 100, 'Detailed action figure with multiple points of articulation. Great for collectors and kids alike.', 8, 'https://www.bigw.com.au/medias/sys_master/images/images/hf6/hd3/45131154194462.jpg'),
(22, 'Board Game', 30.00, 40, 'Engaging board game for family and friends. Fun and challenging gameplay for hours of entertainment.', 8, 'https://m.media-amazon.com/images/I/81+UteUnvHL._AC_SL1500_.jpg'),
(23, 'Vitamins', 20.00, 100, 'Daily multivitamin supplements to support overall health and wellness. Packed with essential nutrients.', 9, 'https://images.ctfassets.net/ydyvnem5zkxh/19V3f9XaJlkP44zrKJ7OR6/ceb029479d5b862e8466f6586d5823ad/Product_Multivitamin.png?w=1000&h=750&q=50&fm=png'),
(24, 'Treadmill', 500.00, 10, 'High-quality treadmill with adjustable speed and incline. Ideal for home workouts.', 9, 'https://images-cdn.ubuy.com.sa/643e9c34d1bf6230947ee9d2-home-foldable-treadmill-with-incline.jpg'),
(25, 'Car Wax', 15.00, 50, 'High-quality car wax for a brilliant shine and long-lasting protection. Easy to apply and buff.', 10, 'https://i5.walmartimages.com/seo/Hs-Ultra-Gloss-29-916-Car-Wax-Carnuba-Long-Lasting-with-PTFE-Resins-16-oz_612e7206-437c-4df1-8d9b-0b3a2c3e7cf1.2b1ef2f97195cc0f315436bf9e70af1f.jpeg');

--
-- PostgreSQL database dump complete
--


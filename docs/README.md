# Waron E-Commerce Web Application

## Project Description

This project is an e-commerce web application designed to provide a seamless online shopping experience. The application includes features such as user authentication, product catalog, shopping cart, order history, and payment processing using Stripe. The application is built using modern web development technologies, including React for the front-end and Node.js/Express for the back-end.

## Features

- User Authentication (Google OAuth and traditional username/password login)
- Product Catalog with detailed descriptions
- Shopping Cart functionality
- Order History tracking
- Secure Payment Processing with Stripe
- Responsive design with default dark theme and green accents (It also has a light mode)
- Robust server-side validation and security measures
- Theme switching floating button from light and dark mode

## Technologies Used

- **Front-end:**

  - React: JS library. To be precise, the project is built with create-react-app.
  - Material-UI: A popular React UI framework
  - React Router: For handling routing in the application

- **Back-end:**

  - Node.js: For running JS server.
  - Express: A fast, unopinionated, minimalist web framework for Node.js
  - PostgreSQL: A powerful, open-source relational database
  - Passport.js: Authentication middleware for Node.js

- **Payment Processing:**

  - Stripe: A suite of payment APIs that powers commerce for businesses of all sizes

- **Security:**
  - Helmet: Helps secure Express apps by setting various HTTP headers
  - express-validator: A library for validating and sanitizing user input

## Deployment

- **Hosting Platform:**

  - Render: The web application is deployed and hosted on Render, providing a reliable and scalable infrastructure.

- **Database Hosting:**

  - Neon: Waron-e-commerce data now migrated to neon (they offered free database hosting).

- **Live App:**

  - [Waron E-Commerce Client](https://waron-e-commerce-client.waron-limsakul.com/): Explore the live client-side of the e-commerce application.

- **Please Note:**
  - This application uses a free instance type of Render hosting service. As a result. The server may take up to 50 seconds in order to spin up from inactivity.
  - The payment process in this application is simulated for learning purposes. No actual transactions are processed. This feature is intended to demonstrate integration with Stripe and simulate payment workflows for educational and development purposes only.

## Usage

- **Register and Login:**

  - Users can register with an email and password or use Google OAuth for authentication.
  - The login form includes an eye icon to toggle password visibility.

- **Product Catalog:**

  - Browse the product catalog, click on product cards to view details in a pop-up.

- **Shopping Cart:**

  - Add products to the shopping cart, view cart contents, and proceed to checkout.

- **Order History:**
  - View order history with detailed product information.

## Privacy Policy

### Information Collection and Use

We collect and use the following information for authentication purposes when you sign in using Google OAuth:

- Google ID
- Email address

### Data Security

We employ industry-standard measures to protect your information. This includes encryption and secure storage practices.

### Third-Party Disclosure

Your Google ID and email address are shared with Google solely for authentication purposes.

### User Rights

You have the right to access, update, and delete your information stored within our application.

### Contact Us

If you have any questions or concerns about our privacy practices, please contact me at poonro@gmail.com.

---

This privacy policy was last updated on 07/18/2024.

## Contributing

We welcome contributions to improve this project. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Stripe](https://stripe.com/)
- [Material-UI](https://mui.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Render](https://render.com/)
- [Neon](https://console.neon.tech/)

---

Thank you for using my e-commerce application. Hope you have a good experience.

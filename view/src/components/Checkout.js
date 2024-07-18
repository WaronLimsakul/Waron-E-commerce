import { loadStripe } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState, useEffect, useContext } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { UserContext } from "./Contexts/UserContext";
import countries from "../util/countries";
import { useNavigate } from "react-router-dom";
import Unauthorized from "./Unauthorized";


const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { activeCart, debouncedGetCart, loggedIn } = useContext(UserContext);

  useEffect(() => {
    if (!activeCart || !loggedIn) {
      return;
    }
    setTotalPrice(activeCart.total_price);
  }, [activeCart, loggedIn]);

  
  useEffect(() => {
    if (loggedIn) {
      debouncedGetCart();
    }
  }, [ ]);

  if (!activeCart && !loggedIn)
    return (
      <Unauthorized />
    );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !activeCart) {
      return;
    }
    setIsProcessing(true);

    let currentClientSecret = clientSecret;

    if (!clientSecret || paymentStatus !== "succeeded") {
      try {
        // 1. Create payment intent if not exists
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/cart/${activeCart.id}/checkout`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: 100 * totalPrice, // amount in cents
              paymentIntentId,
            }),
          }
        );

        const result = await response.json();
        setClientSecret(result.clientSecret);
        setPaymentIntentId(result.paymentIntentId);

        currentClientSecret = result.clientSecret;

        // Check if the new clientSecret is set before proceeding
        if (!result.clientSecret) {
          setErrorMessage(
            "Failed to create payment intent. Please try again"
          );
          setIsProcessing(false);
          return;
        }
      } catch (err) {
        setErrorMessage("Failed to create payment intent. Please try again");
        setIsProcessing(false);
        return;
      }
    }

    // 2. Confirm card payment
    const cardNumberElement = elements.getElement(CardNumberElement);
    const paymentResult = await stripe.confirmCardPayment(currentClientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: {
          name: name,
          email: email,
          address: {
            line1: address,
            city: city,
            state: state,
            postal_code: zip,
            country: country?.code,
          },
        },
      },
    });

    if (paymentResult.error) {
      setErrorMessage(paymentResult.error.message);
      setIsProcessing(false);
      return;
    } else if (paymentResult.paymentIntent.status === "succeeded") {
      setPaymentIntentId(paymentResult.paymentIntent.id);
      setPaymentStatus(paymentResult.paymentIntent.status);
    }

    // 3. Submit Order Post payment
    const orderResponse = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/cart/${activeCart.id}/confirm-order`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentResult.paymentIntent.id,
        }),
      }
    );

    if (orderResponse.ok) {
      setErrorMessage("");
      alert("Payment successful and order created!");
      navigate("/catalog");
    } else {
      setErrorMessage(`Order creation failed, please try again`);
    }
    setIsProcessing(false);
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Checkout, total price : {totalPrice}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              style={{ width: "100%" }}
              label="City"
              variant="outlined"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              style={{ width: "100%" }}
              label="State"
              variant="outlined"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              style={{ width: "100%" }}
              label="Zip"
              variant="outlined"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.label}
              value={country}
              onChange={(event, newValue) => setCountry(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  variant="outlined"
                  required
                />
              )}
            />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <CardNumberElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <CardExpiryElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <CardCvcElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Box>
        {errorMessage && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={!stripe || isProcessing || totalPrice === "0"}
        >
          {isProcessing ? "Processing..." : "Pay"}
        </Button>
      </Box>
    </Container>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;

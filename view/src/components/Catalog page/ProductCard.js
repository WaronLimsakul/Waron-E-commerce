import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const ProductCard = (props) => {
  const { id, name, price, description, picture_url } = props.productInfo;
  const setProductsInCart = props.setProductsInCart;
  const productsInCart = props.productsInCart;
  const [quantity, setQuantity] = useState(0);
  const handleAddToCart = () => {
    if (quantity > 0) {
      setProductsInCart(productsInCart + quantity);
      setQuantity(0);
    }
  };
  return (
    <>
      {/* <Grid item sm={6} md={4} lg={3}> */}
      <Card sx={{ maxWidth: 350, minHeight:'220px' }}>
        <Box sx={{ height: {xs: '150px', sm: '240px'}, overflow: "hidden" }}>
          <CardMedia
            component="img"
            sx={{ height: "100%", objectFit: "cover" }}
            image={picture_url}
            title={name}
          />
        </Box>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }}
            >
              {name}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
            >
              ${price}{" "}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            {description}
          </Typography>
        </CardContent>
        <CardActions
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "1%",
            marginLeft: "2%",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <ButtonGroup
            size="small"
            sx={{ marginBottom: { xs: "0.5rem", sm: "0" } }}
          >
            <Button
              variant="contained"
              onClick={() => {
                if (quantity > 0) {
                  setQuantity(quantity - 1);
                }
              }}
              sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
            >
              <b>-</b>
            </Button>
            <Button
              variant="outlined"
              disabled
              style={{
                color: "white",
                fontSize: { xs: "0.7rem", sm: "0.875rem" },
              }}
            >
              {quantity}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setQuantity(quantity + 1);
              }}
              sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
            >
              <b>+</b>
            </Button>
          </ButtonGroup>
          <Button
            variant="contained"
            size="small"
            onClick={handleAddToCart}
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.875rem" },
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 1, sm: 0 },
            }}
          >
            Add to cart
          </Button>
        </CardActions>
      </Card>
      {/* </Grid> */}
    </>
  );
};

export default ProductCard;

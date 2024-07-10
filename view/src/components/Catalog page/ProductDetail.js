import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  DialogActions,
  Button,
  ButtonGroup,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

const ProductDetail = ({
  open,
  onClose,
  product,
  setProductsInCart,
  productsInCart,
}) => {
  const [quantity, setQuantity] = useState(0);
  if (!product) return null;
  const { name, price, description, picture_url } = product;
  const handleAddToCart = () => {
    if (quantity > 0) {
      setProductsInCart(productsInCart + quantity);
      setQuantity(0);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{name} <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton></DialogTitle>
      <DialogContent>
        <Box
          component="img"
          sx={{ width: "100%", height: "auto" }}
          alt={name}
          src={picture_url}
        />
        <Typography variant="h6" gutterBottom>
          ${price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </DialogContent>
      <DialogActions
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          marginBottom: "2%",
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
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetail;

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
import CloseIcon from "@mui/icons-material/Close";
import { addItemToCart } from "../../util";
import { useNavigate } from "react-router-dom";

const ProductDetail = ({
  open,
  onClose,
  product,
  setProductsInCart,
  productsInCart,
  // userid , cartid, quantity
  cartId,
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
  if (!product) return null;
  const { id, name, price, description, picture_url } = product;
  const handleAddToCart = async () => {
    if (quantity > 0) {
      await addItemToCart(cartId, id, quantity); // this is detail
      setProductsInCart(productsInCart + quantity);
      setQuantity(0);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {name}{" "}
        <IconButton
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
        </IconButton>
      </DialogTitle>
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
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.875rem" },
              border: '2px solid',
              '&:disabled': {
                color: theme => theme.palette.text.primary,
                borderColor: theme => theme.palette.primary.main,
              },
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
          disabled={!cartId}
        >
          Add to cart
        </Button>
        {!cartId && (
          <Button
            variant="text"
            size="small"
            onClick={() => {
              navigate("/login");
            }}
            sx={{
              fontSize: { xs: "0.7rem", sm: "0.875rem" },
              width: { xs: "100%", sm: "auto" },
              mt: { xs: 1, sm: 0 },
            }}
          >
            Please log in
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetail;

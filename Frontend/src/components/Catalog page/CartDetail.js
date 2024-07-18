import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Box,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const CartDetail = ({
  open,
  onClose,
  cartDetailArray,
  handleDeleteItem,
  fetchCartDetail,
  cartId,
}) => {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Cart Details{" "}
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
      <DialogContent dividers>
        {cartDetailArray.length > 0 ? (
          <>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Total Price</Typography>
              <Typography variant="h6">
                ${cartDetailArray[0].total_price}
              </Typography>
            </Box>
            <List>
              {cartDetailArray.map((detail) => (
                <ListItem
                  key={detail.product_id}
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => {
                        handleDeleteItem(cartId, detail.product_id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={detail.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          ${detail.price}
                        </Typography>
                        {" - "}
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                        >
                          Amount: {detail.quantity}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
            <Grid container justifyContent="center" width="100%">
              <Button
                variant="contained"
                style={{ marginTop: "3%" }}
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
              >
                Proceed to checkout
              </Button>
            </Grid>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Your cart is empty
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CartDetail;

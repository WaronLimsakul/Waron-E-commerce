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
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const CartDetail = ({ open, onClose, cartDetailArray }) => {
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
                <ListItem key={detail.product_id} alignItems="flex-start">
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

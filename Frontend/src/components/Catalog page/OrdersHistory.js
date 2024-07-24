import React, { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const OrdersHistory = ({ open, onClose, ordersHistory, fetchOrderHistory }) => {
  const [groupedOrders, setGroupedOrders] = useState({});
  useEffect(() => {
    if (ordersHistory) {
      const orders = ordersHistory.reduce((acc, order) => {
        const { order_id, order_date, product_id, quantity, name } = order;
        if (!acc[order_id]) {
          acc[order_id] = {
            order_id,
            order_date,
            products: [],
          };
        }
        acc[order_id].products.push({ product_id, quantity, name });
        return acc;
      }, {});
      setGroupedOrders(orders);
    }
  }, [ordersHistory]);

  //don't know logic to groupd order with same id
  const groupedOrdersArray = Object.values(groupedOrders);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Orders History{" "}
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
        {groupedOrdersArray.length > 0 ? (
          <List>
            {groupedOrdersArray.map((order) => (
              <Box key={order.order_id} mb={2}>
                <Typography variant="subtitle1" gutterBottom style={{fontWeight: '500'}}>
                  Order ID: {order.order_id} (Date:{" "}
                  {new Date(order.order_date).toLocaleDateString()})
                </Typography>
                {order.products.map((product) => (
                  <ListItem key={product.product_id}>
                    <ListItemText
                      primary={
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                        >
                          <Typography variant="body1">
                            {product.name}
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            Amount: {product.quantity}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
                <Divider />
              </Box>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary">
            You have no orders
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrdersHistory;

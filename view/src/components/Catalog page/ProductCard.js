import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";

const ProductCard = (props) => {
  const { name, price, picture_url } = props.productInfo;

  const onClick = props.onClick;

  return (
    <>
      <Card sx={{ maxWidth: 350, minHeight: "220px" }}>
        <CardActionArea onClick={onClick}>
          <Box
            sx={{ height: { xs: "150px", sm: "240px" }, overflow: "hidden" }}
          >
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
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

export default ProductCard;

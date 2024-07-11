import { Box, Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import { useState } from "react";
import ProductDetail from "./ProductDetail";

const ProductList = (props) => {
  const ProductArray = [
    // products array sample
    {
      id: 1,
      name: "sofa",
      price: 120.0,
      stock: 5,
      description: "red sofa, black legs",
      category_id: 1,
      picture_url:
        "https://i.pinimg.com/736x/ef/8c/23/ef8c23bb773239fb665f9dcfff8a6517.jpg",
    },
  ]; // have to get from server
  const productsArray = props.productsArray;
  

  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };
  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ width: "100%", marginTop: "2%", marginBottom: "5%" }}>
      <Grid container spacing={2}>
        <Grid item xs={0.5} sm={1} />
        <Grid item xs={11} sm={10}>
          <Grid container spacing={2}>
            {productsArray.map((product) => (
              <Grid key={product.id} item xs={6} sm={6} md={4} lg={3}>
                <ProductCard
                  productInfo={product}
                  productsInCart={props.productsInCart}
                  setProductsInCart={props.setProductsInCart}
                  onClick={() => {
                    handleCardClick(product);
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={0.5} sm={1} />
      </Grid>
      <ProductDetail
        open={Boolean(selectedProduct)}
        onClose={handleCloseDialog}
        product={selectedProduct}
        productsInCart={props.productsInCart}
        setProductsInCart={props.setProductsInCart}
        cartId={props.cartId}
      />
    </Box>
  );
};
export default ProductList;

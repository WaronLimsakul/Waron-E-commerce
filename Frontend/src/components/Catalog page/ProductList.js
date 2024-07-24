import { Box, Grid } from "@mui/material";
import ProductCard from "./ProductCard";
import { useState } from "react";
import ProductDetail from "./ProductDetail";

const ProductList = (props) => {
  const productsArray = props.productsArray;
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };
  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ width: "100%", marginTop: "2%", marginBottom: "5%", paddingTop: "70px" }}>
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

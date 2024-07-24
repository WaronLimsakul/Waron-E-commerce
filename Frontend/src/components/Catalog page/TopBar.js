import {
  Box,
  AppBar,
  IconButton,
  Grid,
  Autocomplete,
  TextField,
  Badge,
  Tooltip,
  styled,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Logo from "../../waron-logo-zip-file/png/logo-no-background.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cart from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";
import { getCartDetail, getOrderHistory, handleLogout, removeItem } from "../../util";
import { Link, useNavigate } from "react-router-dom";
import CartDetail from "./CartDetail";
import OrdersHistory from "./OrdersHistory";

const ResponsiveAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: "75%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const TopBar = (props) => {
  const productsInCart = props.productsInCart;
  const userInfo = props.userInfo;
  const cartId = props.cartId;
  const debouncedGetCart = props.debouncedGetCart;
  const { setSelectedCategory } = props.filter;
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCart, setOpenCart] = useState(false);
  const [cartDetailArray, setCartDetailArray] = useState(null);
  const [openHistory, setOpenHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState(null);
  const navigate = useNavigate();

  const fetchCartDetail = async () => {
    try {
      const cartDetailRows = await getCartDetail(cartId);
      setCartDetailArray(cartDetailRows);
    } catch (error) {
      console.error('Error fetching cart details:', error);
    }
  };
  const fetchOrderHistory = async () => {
    try {
      const ordersHistory = await getOrderHistory();
      setOrderHistory(ordersHistory);
    } catch (err) {
      console.error("fail to fetch order history in front end:",err);
    }
  };
  useEffect(() => {
    if (!cartId) return
    fetchCartDetail();
  }, [cartId]);
  
  const handleDeleteItem = async (cartId, productId) => {
    try {
      await removeItem(cartId, productId);
      await fetchCartDetail();
      debouncedGetCart();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleOpenCart = () => {
    // fetch cart detail
    fetchCartDetail();
    setOpenCart(true);
  };
  const handleCloseCart = () => {
    setOpenCart(false);
  };
  
  const handleOpenHistory = () => {
    // fetch orderhistory
    fetchOrderHistory();
    setOpenHistory(true);
  };
  const handleCloseHistory = () => {
    setOpenHistory(false);
  };
  
  

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isVerySmallScreen = useMediaQuery("(max-width:320px)");
  const productsCategories = [
    { label: "All", categoryId: 0 },
    { label: "Grocery", categoryId: 1 },
    { label: "Pets", categoryId: 2 },
    { label: "Electronics", categoryId: 3 },
    { label: "Fashion", categoryId: 4 },
    { label: "Home & Kitchen", categoryId: 5 },
    { label: "Beauty & Personal Care", categoryId: 6 },
    { label: "Sports & Outdoors", categoryId: 7 },
    { label: "Toys & Games", categoryId: 8 },
    { label: "Health & Wellness", categoryId: 9 },
    { label: "Automotive", categoryId: 10 },
  ];

  return (
    <Box>
      <AppBar position="fixed" sx={{
          top: 0,
          left: 0,
          width: '100%',
          bgcolor: (theme) => theme.palette.background.paper, // Use the paper background color for contrast
          color: (theme) => theme.palette.text.primary, // Use primary text color
        }} >
        <Grid
          container
          width="100%"
          height="100"
          justifyContent="space-between"
          alignItems="center"
          wrap="nowrap"
          spacing={1}
        >
          <Grid item xs={0} sm={0} md={1.5}>
            <Grid container alignItems="center" justifyContent="flex-start">
              {!isSmallScreen && (
                <StyledIconButton
                  size="large"
                  color="inherit"
                  sx={{ mr: "3%", ml: "3%" }}
                  onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'})}}
                >
                  <Box
                    component="img"
                    sx={{
                      height: 50,
                      margin: "6%",
                    }}
                    alt="Logo"
                    src={Logo}
                  />
                </StyledIconButton>
              )}
            </Grid>
          </Grid>
          {!isVerySmallScreen && (
            <Grid item xs={8} sm={8} md={5} margin="1%">
              <ResponsiveAutocomplete
                disablePortal
                id="categoryId"
                options={productsCategories}
                isOptionEqualToValue={(option, value) =>
                  option.categoryId === value.categoryId
                }
                onChange={(e, newValue) => {
                  if (newValue) {
                    setSelectedCategory(newValue.categoryId);
                  } else {
                    setSelectedCategory(0);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Product categories" />
                )}
              />
            </Grid>
          )}

          <Grid item xs={2} sm={4} md={6}>
            <Grid
              container
              alignItems="center"
              justifyContent="flex-end"
              height="100%"
              wrap="nowrap"
            >
              {!isSmallScreen && <Typography variant="body1" marginRight="1%">
                {userInfo ? (
                  `Hello! ${userInfo.username}`
                ) : (
                  <Link to="/login" color="primary">
                    <Button size="small" color="primary">
                      Please login
                    </Button>
                  </Link>
                )}
              </Typography>}
              {userInfo && (
                <>
                  <Tooltip title="Cart">
                    <StyledIconButton size="large" onClick={handleOpenCart}>
                      <Badge badgeContent={productsInCart} color="error">
                        <Cart />
                      </Badge>
                    </StyledIconButton>
                  </Tooltip>
                  <Tooltip title="Order history">
                    <StyledIconButton size="large" onClick={handleOpenHistory}>
                      <HistoryIcon />
                    </StyledIconButton>
                  </Tooltip>
                  <StyledIconButton
                    size="large"
                    style={{ marginRight: "5%" }}
                    aria-controls="profile-menu"
                    aria-haspopup="true"
                    onClick={handleMenu}
                  >
                    <AccountCircleIcon />
                  </StyledIconButton>
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={() => {
                      setAnchorEl(null);
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setAnchorEl(null);  
                        navigate("/account");
                      }}
                    >
                      <ListItemIcon>
                        <AccountBoxIcon />
                      </ListItemIcon>
                      <ListItemText> My account</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={async () => {
                        await handleLogout();
                        window.location.reload(); //refresh
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText>Log out</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </AppBar>
      <CartDetail
        open={openCart}
        onClose={handleCloseCart}
        cartDetailArray={cartDetailArray ? cartDetailArray : []}
        fetchCartDetail={fetchCartDetail}
        handleDeleteItem={handleDeleteItem}
        cartId={cartId}
      />
      <OrdersHistory 
        open={openHistory}
        onClose={handleCloseHistory}
        ordersHistory={orderHistory ? orderHistory : []}
        fetchOrderHistory={fetchOrderHistory}
      />
    </Box>
  );
};

export default TopBar;

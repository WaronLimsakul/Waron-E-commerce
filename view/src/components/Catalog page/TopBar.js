import {
  Box,
  AppBar,
  IconButton,
  Grid,
  Autocomplete,
  TextField,
  Badge,
  Tooltip,
} from "@mui/material";
import Logo from "../../waron-logo-zip-file/png/logo-no-background.png";
import Cart from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const TopBar = () => {
  const productsCategories = [
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
  const products = 10;
  const handleProfileMenu = (e) => {

  };

  return (
    <Box>
      <AppBar position="static" style={{ backgroundColor: "#1c1c1e" }}>
        <Grid
          container
          width="100%"
          height="100"
          justifyContent="space-between"
        >
          <Grid item xs={6} height="100%">
            <Grid container alignItems="center" justifyContent="flex-start">
              <IconButton size="large" color="inherit" sx={{ mr: "3%", ml:"3%"  }}>
                <Box
                  component="img"
                  sx={{
                    height: 50,
                    margin: "6%",
                  }}
                  alt="Logo"
                  src={Logo}
                />
              </IconButton>
              <Autocomplete
                disablePortal
                id="categoryId"
                options={productsCategories}
                sx={{ width: "40%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Product categories" />
                )}
              />
            </Grid>
          </Grid>
          <Grid item xs={6} height="100&">
            <Grid container alignItems="center" justifyContent="flex-end" height="100%">
                <Tooltip title="Cart">
              <IconButton size="large">
                <Badge badgeContent={products} color="error">
                <Cart />
                </Badge>
              </IconButton>
              </Tooltip>
              <Tooltip title="Order history">
              <IconButton size="large">
                <HistoryIcon />
              </IconButton>
              </Tooltip>
              <Tooltip title="Profile"> 
              <IconButton size="large" style={{ marginRight: "5%"}} onClick={handleProfileMenu}>
                <AccountCircleIcon />
              </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </AppBar>
    </Box>
  );
};

export default TopBar;

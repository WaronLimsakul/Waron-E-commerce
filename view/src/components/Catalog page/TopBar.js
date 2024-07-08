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
} from "@mui/material";
import Logo from "../../waron-logo-zip-file/png/logo-no-background.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cart from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ResponsiveAutocomplete = styled(Autocomplete)(({ theme }) => ({
  width: "75%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.primary.light,
}));

const TopBar = (props) => {
  const productsInCart = props.productsInCart;
  const { setSelectedCategory } = props.filter;

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
      <AppBar position="static" style={{ backgroundColor: "#1c1c1e" }}>
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
              <Tooltip title="Cart">
                <StyledIconButton size="large">
                  <Badge badgeContent={productsInCart} color="error">
                    <Cart />
                  </Badge>
                </StyledIconButton>
              </Tooltip>
              <Tooltip title="Order history">
                <StyledIconButton size="large">
                  <HistoryIcon />
                </StyledIconButton>
              </Tooltip>
              <Tooltip title="Profile">
                <StyledIconButton size="large" style={{ marginRight: "5%" }}>
                  <AccountCircleIcon />
                </StyledIconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </AppBar>
    </Box>
  );
};

export default TopBar;

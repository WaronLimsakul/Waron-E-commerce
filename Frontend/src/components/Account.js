import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./Contexts/UserContext";
import { fetchAccountDetail, updateAccount } from "../util";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import Unauthorized from "./Unauthorized";


const Account = () => {
  const { userInfo, loggedIn } = useContext(UserContext);
  const [accountDetail, setAccountDetail] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    email: "",
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !loggedIn) {
      return;
    }
    const getAccountDetail = async () => {
      const fetchedDetail = await fetchAccountDetail(userInfo.id);
      setAccountDetail(fetchedDetail);
      setFormValues({
        fullName: fetchedDetail.full_name,
        dateOfBirth: fetchedDetail.date_of_birth,
        address: fetchedDetail.address,
        email: fetchedDetail.email,
      });
      setLoading(false);
    };
    getAccountDetail();
  }, [userInfo, loggedIn]);

  if (!userInfo && !loggedIn) return <Unauthorized />;

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const validateEmail = () => {
    // Basic email validation using HTML5 pattern attribute
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return formValues.email.match(emailRegex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) {
      // may use Alert instead
      setEmailError(true);
      return;
    }
    setEmailError(false);
    const result = await updateAccount(userInfo.id, formValues);
    setEditDialogOpen(false);
    setAccountDetail(result.detail);
    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress size={80} />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        flexFlow: "column",
      }}
    >
      {alertOpen && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Account details updated successfully!
        </Alert>
      )}
      <Card sx={{ width: "100%", maxWidth: 500, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Account Details
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText
                primary="Full Name"
                secondary={accountDetail.full_name}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText
                primary="Date of Birth"
                secondary={new Date(
                  accountDetail.date_of_birth
                ).toLocaleDateString()}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText
                primary="Address"
                secondary={accountDetail.address}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={accountDetail.email} />
            </ListItem>
          </List>
        </CardContent>
        <CardActions
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEditClick}
            sx={{ mt: 2, mb: 2 }}
          >
            Edit Account
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              navigate("/catalog");
            }}
          >
            Back to catalog
          </Button>
        </CardActions>
      </Card>
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit Account Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
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
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="dense"
              label="Full Name"
              name="fullName"
              value={formValues.fullName}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Date of Birth"
              name="dateOfBirth"
              value={formValues.dateOfBirth}
              onChange={handleInputChange}
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            
            <TextField
              margin="dense"
              label="Address"
              name="address"
              value={formValues.address}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              fullWidth
              required
            />
            {/* Add other fields as necessary */}
            {emailError && (
              <Alert severity="error" onClose={() => setEmailError(false)}>
                Please enter a valid email address
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Account;

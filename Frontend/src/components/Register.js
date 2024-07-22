import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { handleGoogleLogin, handleRegister } from "../util";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Logo from "../waron-logo-zip-file/png/logo-no-background.png";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(false);
  const [message, setMessage] = useState(null);
  const [pending, setPending] = useState(false);

  const handleClickEye = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    setPending(true);
    e.preventDefault();
    const message = await handleRegister(username, password);
    setPending(false);
    if (!message) {
      setErrors(true);
      setMessage("Something went wrong, please try again");
      return;
    }
    setMessage(message);
  };

  return (
    <>
      <Grid container>
        <Grid item lg={2} md={3} xs={2}></Grid>
        <Grid
          container
          item
          lg={4}
          md={false}
          alignItems="center"
          justifyContent="center"
          height="80vh"
          sx={{
            display: { xs: "none", lg: "flex" }, // Hide on xs screens, show on md and up
          }}
        >
          <Box
            component="img"
            sx={{
              height: "20vh",
              margin: "1%",
            }}
            alt="Logo"
            src={Logo}
          />
        </Grid>
        <Grid item lg={4} md={6} xs={8} marginTop="5%">
          <Grid item width="100%" minWidth="500">
            <Card xs={12} elevation={2}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CardContent>
                  <Typography variant="h4" fontWeight="500" gutterBottom>
                    Please register
                  </Typography>
                  {pending && (
                        <Alert severity="info" style={{ width: "75%" }}>
                          Registering, please wait...
                        </Alert>
                      )}
                  {message && (
                    <Alert severity={errors ? "error" : "success"}>
                      {message}
                    </Alert>
                  )}
                </CardContent>
                <CardActions style={{ flexDirection: "column", width: "100%" }}>
                  <form onSubmit={handleSubmit}>
                    <Grid container justifyContent="center">
                      <TextField
                        id="username"
                        label="Username"
                        variant="filled"
                        style={{ margin: "2%", width: "75%" }}
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                        required
                      />
                      <TextField
                        id="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="filled"
                        style={{ margin: "2%", width: "75%" }}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleClickEye} edge="end">
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        style={{ margin: "4%", width: "75%" }}
                      >
                        Register
                      </Button>
                      <Button
                        variant="contained"
                        size="large"
                        style={{
                          marginBottom: "2%",
                          width: "75%",
                          backgroundColor: "white",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "relative",
                        }}
                        onClick={handleGoogleLogin}
                      >
                        {" "}
                        <GoogleIcon
                          style={{ position: "absolute", left: "5%" }}
                        />
                        Sign up with Google
                      </Button>
                    </Grid>
                  </form>
                </CardActions>
                <CardContent>
                  <Typography variant="subtitle1">
                    Have an account? login{" "}
                    {
                      <Link to="/login">
                        <Button variant="text">Here</Button>
                      </Link>
                    }
                  </Typography>
                </CardContent>
              </div>
            </Card>
          </Grid>
        </Grid>
        <Grid item lg={2} md={3} xs={2}></Grid>
      </Grid>
    </>
  );
}

export default Register;

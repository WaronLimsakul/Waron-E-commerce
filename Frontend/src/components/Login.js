import {
  Card,
  Grid,
  Typography,
  CardActions,
  TextField,
  Button,
  CardContent,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Link, useNavigate as UseNavigate } from "react-router-dom";
import { handleLogin } from "../util";
import { SessionContext } from "./Contexts/SessionContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [correct, setCorrect] = useState(true);
  const navigate = UseNavigate();
  const { handleLoginResponse } = useContext(SessionContext);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);

  const handleClickEye = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    setPending(true);
    e.preventDefault();
    const response = await handleLogin(username, password);
    setPending(false);
    handleLoginResponse(response);
    if (response.authenticate) {
      navigate("/catalog");
    } else {
      setUsername("");
      setPassword("");
      setCorrect(false);
    }
  };
  return (
    <>
      <Grid container alignContent="center">
        <Grid item lg={4} md={3} xs={2}></Grid>
        <Grid item lg={4} md={6} xs={8} justifyContent="center" marginTop="5%">
          <Grid item width="100%">
            <Card xs={12} elevation={2}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <CardContent justifyContent="center">
                  <Typography variant="h4" fontWeight="500">
                    Login
                  </Typography>
                </CardContent>
                <CardActions style={{ flexDirection: "column", width: "100%" }}>
                  <form onSubmit={handleSubmit}>
                    <Grid container justifyContent="center">
                      {!correct && (
                        <Typography variant="body1" color="error">
                          Incorrect username or password. Please try again
                        </Typography>
                      )}
                      {pending && (
                        <Alert severity="info" style={{ width: "75%" }}>
                          Logging in, please wait...
                        </Alert>
                      )}
                      <TextField
                        id="username"
                        label="Username"
                        variant="filled"
                        style={{ margin: 10, width: "75%" }}
                        value={username}
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
                        style={{ margin: 10, width: "75%" }}
                        value={password}
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
                        style={{ margin: 20, width: "75%" }}
                      >
                        Log in
                      </Button>
                    </Grid>
                  </form>
                </CardActions>
                <CardContent>
                  <Typography variant="subtitle1">
                    Don't have account? register{" "}
                    {
                      <Link to="/register">
                        <Button variant="text">Here</Button>
                      </Link>
                    }
                  </Typography>
                </CardContent>
              </div>
            </Card>
          </Grid>
        </Grid>
        <Grid item lg={4} md={3} xs={2}></Grid>
      </Grid>
    </>
  );
};

export default Login;

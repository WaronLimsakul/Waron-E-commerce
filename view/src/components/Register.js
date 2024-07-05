import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate as UseNavigate } from "react-router-dom";
import { handleGoogleLogin, handleRegister } from "../util";
import GoogleIcon from "@mui/icons-material/Google";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = UseNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister(username, password);
    navigate("/login");
  };

  return (
    <>
      <Grid container>
        <Grid item lg={4} md={3} xs={2}></Grid>
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
                  <Typography variant="h4" fontWeight="500">
                    Please register
                  </Typography>
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
                          console.log(e.target.value);
                        }}
                        required
                      />
                      <TextField
                        id="password"
                        label="Password"
                        type="password"
                        variant="filled"
                        style={{ margin: "2%", width: "75%" }}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        required
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
                          position: 'relative'
                        }}
                        onClick={handleGoogleLogin}
                      >
                        {" "}
                        <GoogleIcon
                          style={{ position: "absolute", left: '5%' }}
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
        <Grid item lg={4} md={3} xs={2}></Grid>
      </Grid>
    </>
  );
}

export default Register;

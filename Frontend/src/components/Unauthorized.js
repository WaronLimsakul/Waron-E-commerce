import { Button, Card, CardContent, Grid, Typography } from "@mui/material"
import { useNavigate as UseNavigate } from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';



const Unauthorized = () => {
    const navigate = UseNavigate();
    return (<Grid
        container
        style={{ height: '100vh' }}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Card style={{ padding: '40px', textAlign: 'center' }}>
            <CardContent>
              <ErrorOutlineIcon style={{ fontSize: 50, color: "#d32f2f" }} />
              <Typography variant="h4" style={{ margin: '20px 0' }}>
                Sorry, you can not access this page
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={() => {navigate("/login")}}
              >
                Go to login
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>)
}

export default Unauthorized;
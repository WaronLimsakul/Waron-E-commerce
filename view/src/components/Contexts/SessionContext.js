import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React, { createContext, useState, useEffect } from "react";

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [loginResponse, setLoginResponse] = useState(null);

  const handleLoginResponse = (response) => {
    setLoginResponse(response);
    if (response.authenticate) {
      setSessionExpiry(Date.now() + 1000 * 60 * 30); // 30 mins
    }
  };

  useEffect(() => {
    const checkSession = setInterval(() => {
      if (sessionExpiry) {
        const timeRemaining = sessionExpiry - Date.now();
        if (timeRemaining <= 1000 * 60 * 5 && timeRemaining > 0) { // 5 mins
          setShowWarning(true);
        } else if (timeRemaining <= 0) {
          clearInterval(checkSession);
          alert("Session expired, please log in again");
          setShowWarning(false);
          setSessionExpiry(null);
          window.location.href = "/login";
        }
      }
    }, 10000); // every 10 sec

    return () => clearInterval(checkSession);
  }, [sessionExpiry]);

  const extendSession = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/extend-session`, {method: "POST", credentials: "include"});
        if (!response.ok) {
            throw new Error('Failed to extend session');
        }  
        const data = await response.json();
        if (data.success) {
            setSessionExpiry(Date.now() + 1000 * 60 * 30); // 30 mins
            setShowWarning(false);
        } else {
            throw new Error('Failed to extend session');
        }
    } catch (err) {
        console.error('Error extending session:', err);
      }
  };

  return (
    <SessionContext.Provider value={{ sessionExpiry, loginResponse, handleLoginResponse, extendSession, showWarning }}>
        {children}
        {showWarning && (
             <Dialog open={showWarning}>
             <DialogTitle>Session Expiring Soon</DialogTitle>
             <DialogContent>
               <Typography>Your session is about to expire. Do you want to extend your session?</Typography>
             </DialogContent>
             <DialogActions>
               <Button onClick={extendSession} color="primary">Extend Session</Button>
               <Button onClick={() => window.location.href = '/login'} color="secondary">Log Out</Button>
             </DialogActions>
           </Dialog>
        )}
    </SessionContext.Provider>
  )
};

export { SessionProvider, SessionContext };

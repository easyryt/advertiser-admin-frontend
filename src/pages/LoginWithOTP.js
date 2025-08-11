// pages/LoginWithOTP.js
import React, { useState } from "react";
import axios from "axios";
import {
  Box, Button, Container, TextField, Typography, Paper, useTheme,
  useMediaQuery, CircularProgress, FormControlLabel, Checkbox, Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { SnackbarProvider, useSnackbar } from "notistack";
import { motion } from "framer-motion";

const backgroundImageUrl =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80";

const LoginWithOTPInner = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      enqueueSnackbar("Please fill in all fields", { variant: "warning" });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      enqueueSnackbar("Please enter a valid email address", { variant: "warning" });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(
        "https://advertiserappnew.onrender.com/admin/auth/logIn",
        { email, password },
        { withCredentials: true }
      );
      
      if (response.data.status) {
        enqueueSnackbar("Login successful! Redirecting...", { variant: "success" });
        login(response.data.user, rememberMe);
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Invalid credentials", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      height: "100vh", backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
      display: "flex", alignItems: "center", justifyContent: "center", p: 2,
      position: "relative", overflow: "hidden",
    }}>
      <Box sx={{
        position: "absolute", top: 0, right: 0, bottom: 0, left: 0,
        backgroundColor: "rgba(13, 38, 63, 0.75)", zIndex: 1,
      }} />
      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 2, borderRadius: 3 }}>
        <motion.div initial="hidden" animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" }, },
          }}>
          <Paper
            elevation={12}
            sx={{
              p: isMobile ? 4 : 6,
              borderRadius: 3,
              backdropFilter: "blur(12px)",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 20px 0 rgba(31, 38, 135, 0.25)",
            }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              align="center"
              fontWeight="700"
              color="primary.dark"
              gutterBottom
              sx={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Admin Login
            </Typography>
            <Box sx={{ mt: 3 }} component="form" noValidate onSubmit={handleLogin}>
              <TextField
                label="Email Address"
                variant="outlined"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                inputProps={{ inputMode: "email" }}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                <Link href="#" variant="body2" sx={{ textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                disabled={loading || !email || !password} 
                fullWidth
                sx={{
                  mt: 4, py: 1.7, borderRadius: "12px", fontWeight: "600", fontSize: "1rem",
                  letterSpacing: 1.1, boxShadow: "0 6px 12px rgba(25, 118, 210, 0.3), 0 3px 6px rgba(25, 118, 210, 0.2)",
                  transition: "all 0.35s ease-in-out",
                  "&:hover": { boxShadow: "0 10px 20px rgba(25, 118, 210, 0.6), 0 6px 10px rgba(25, 118, 210, 0.4)" },
                }}
              >
                {loading ? <CircularProgress size={26} /> : "Login"}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

const LoginWithOTP = () => (
  <SnackbarProvider maxSnack={3} autoHideDuration={3500}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}>
    <LoginWithOTPInner />
  </SnackbarProvider>
);

export default LoginWithOTP;
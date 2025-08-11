// TopBar.js
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Avatar,
  Badge,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import dp from "./dp.gif"

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  borderBottom: "1px solid #eee",
  position: "fixed",
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
  width: "100%",
}));

export default function TopBar({
  toggleDrawer,
  activePage,
  handleMenuOpen,
  user,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nameValue, setNameValue] = useState('');

    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('https://advertiserappnew.onrender.com/adv/auth/profile', { withCredentials: true });
        setNameValue(response.data.message?.name || '');
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchProfile();
      // eslint-disable-next-line
    }, []);

  return (
    <StyledAppBar position="fixed">
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 1, sm: 2 },
          minHeight: "56px !important",
        }}
      >
        {/* Left Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <IconButton size="small" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          >
            {activePage}
          </Typography>
        </Box>

        {/* Right Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1.5 },
            }}
          >
            {!isMobile && (
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: "#f1f5f9",
                  borderRadius: "16px",
                  px: 1.5,
                  py: 0.5,
                  fontWeight: 600,
                  fontSize: "14px",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Hi, {nameValue || "Advertiser"}
              </Typography>
            )}

            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar
                src={dp}
                alt={nameValue ? nameValue : "Advertiser"}
                sx={{
                  width: { xs: 28, sm: 32 },
                  height: { xs: 28, sm: 32 },
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

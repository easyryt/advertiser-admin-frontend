// DashboardLayout.js
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  Box,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import { Dashboard, Logout as LogoutIcon, People } from "@mui/icons-material";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export const BG_GRADIENT = "linear-gradient(135deg, #f8fbff 0%, #f0f7ff 100%)";
export const PRIMARY_COLOR = "#1976d2";
export const DRAWER_WIDTH = 240;
export const COLLAPSED_WIDTH = 72;

export default function DashboardLayout() {
  const { logout, user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(!isMobile);
  const [collapsed, setCollapsed] = useState(isMobile);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
      setCollapsed(true);
    } else {
      setOpen(true);
      setCollapsed(false);
    }
  }, [isMobile]);

  const activePage = (() => {
    const path = location.pathname;
    if (path.startsWith("/dashboard/campaigns")) return "Campaigns";
    if (path.startsWith("/dashboard/settings")) return "Settings";
    if (path.startsWith("/profile-page")) return "Profile";
    if (path.startsWith("/dashboard")) return "Dashboard";
    return "";
  })();

  const toggleDrawer = () => {
    if (isMobile) setOpen((o) => !o);
    else setCollapsed((c) => !c);
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const navItems = [
    {
      text: "Dashboard",
      icon: "Dashboard", // Changed to string identifier
      path: "/dashboard",
    },
    {
      text: "Plan List",
      icon: "BallotIcon", // Changed to string identifier
      path: "/dashboard/plan-list",
    },
    {
      text: "Campaign List",
      icon: "People", // Changed to string identifier
      path: "dashboard/campaign-list",
    },
    {
      text: "Advertisers",
      icon: "People", // Changed to string identifier
      path: "dashboard/advertisers",
    },
  ];


  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100vw",
        background: BG_GRADIENT,
        overflowX: "hidden", // Prevent horizontal scroll
        overflowY: "hidden", // Prevent root scroll
        maxWidth: "100vw",
        boxSizing: "border-box",
      }}
    >
      <CssBaseline />

      {/* Sidebar */}
      <Sidebar
        open={open}
        collapsed={collapsed}
        isMobile={isMobile}
        toggleDrawer={toggleDrawer}
        activePage={activePage}
        navItems={navItems}
        handleNavigation={handleNavigation}
      />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: {
            xs: "100%",
            sm: `calc(100% - ${collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH}px)`,
          },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          maxWidth: "100%",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <TopBar
          collapsed={collapsed}
          activePage={activePage}
          toggleDrawer={toggleDrawer}
          handleBack={handleBack}
          handleMenuOpen={handleMenuOpen}
          user={user}
        />

        {/* Scrollable Content Area */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowX: "hidden",
            overflowY: "auto", // Only vertical scroll here
            position: "relative",
            p: 3,
            mt: 7,
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            "& > *": {
              maxWidth: "100%",
              overflowX: "hidden",
              boxSizing: "border-box",
            },
            "& .MuiContainer-root": {
              maxWidth: "100% !important",
              paddingLeft: "0 !important",
              paddingRight: "0 !important",
            },
            "& .MuiGrid-container": {
              marginLeft: "0 !important",
              marginRight: "0 !important",
              width: "100% !important",
            },
            "& .MuiPaper-root": {
              maxWidth: "100%",
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflowX: "hidden",
              boxSizing: "border-box",
              "& > *": {
                maxWidth: "100%",
                overflowX: "hidden",
              },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 4,
          sx: {
            width: 240,
            mt: 1.5,
            borderRadius: 3,
            boxShadow: "0 12px 30px rgba(25, 118, 210, 0.15)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            maxWidth: "calc(100vw - 20px)",
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 20,
              width: 12,
              height: 12,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              borderTop: "1px solid rgba(0, 0, 0, 0.05)",
              borderLeft: "1px solid rgba(0, 0, 0, 0.05)",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          sx={{ py: 1.6, mt: 0.5 }}
          onClick={() => {
            navigate("/profile-page");
            handleMenuClose();
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              mr: 1.5,
              bgcolor: "rgba(25, 118, 210, 0.1)",
              color: PRIMARY_COLOR,
            }}
          />
          My Profile
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: "#f44336",
            fontWeight: 600,
            "&:hover": {
              background: "rgba(244, 67, 54, 0.05)",
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1.5, fontSize: 22 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}

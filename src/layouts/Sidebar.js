// Sidebar.js
import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
  Typography,
  IconButton,
  Box,
  styled,
  useTheme,
  Badge,
  Button,
  keyframes,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  Dashboard,
  People,
  BarChart,
  Settings,
  Inventory,
  Mail as MessagesIcon,
  ChevronLeft,
  ChevronRight,
  SupportAgent,
} from "@mui/icons-material";
import BallotIcon from "@mui/icons-material/Ballot";
import CampaignsIcon from "@mui/icons-material/Campaign";
import GroupsIcon from "@mui/icons-material/Groups";

const PRIMARY_COLOR = "#1976d2";
const SECONDARY_COLOR = "#4dabf5";
const DRAWER_WIDTH = 260;
const COLLAPSED_WIDTH = 80;

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 ${alpha(PRIMARY_COLOR, 0.7)};
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(25, 118, 210, 0);
  }
  100% {
    transform: scale(0.95);
    boxShadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

const ListItemStyled = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "selected",
})(({ theme, selected }) => ({
  borderRadius: 14,
  margin: theme.spacing(1, 1.5),
  color: selected ? "#fff" : "#0d3c6e",
  background: selected
    ? `linear-gradient(90deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)`
    : "transparent",
  minHeight: 52,
  transition: "all 0.3s ease",
  boxShadow: selected ? "0 4px 16px rgba(25, 118, 210, 0.25)" : "none",
  "&:hover": {
    background: selected
      ? `linear-gradient(90deg, #1565c0 0%, #2196f3 100%)`
      : "rgba(25, 118, 210, 0.05)",
    transform: "translateX(3px) scale(1.02)",
    color: selected ? "#fff" : PRIMARY_COLOR,
  },
  cursor: "pointer",
}));

const SidebarListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 0,
  marginRight: theme.spacing(2.5),
  justifyContent: "center",
  color: "inherit",
  alignItems: "center",
  display: "flex",
  fontSize: 26,
  transition: "transform 0.3s ease",
}));

const SidebarDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})(({ theme, collapsed }) => ({
  width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  position: "relative",
  zIndex: theme.zIndex.drawer,
  "& .MuiDrawer-paper": {
    width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
    background: "linear-gradient(195deg, #f8fbff 0%, #f0f7ff 100%)",
    borderRight: "none",
    boxShadow: "4px 0 30px rgba(140, 180, 250, 0.2)",
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    "&::-webkit-scrollbar": {
      width: 0,
    },
  },
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: PRIMARY_COLOR,
    color: "#fff",
    fontWeight: "bold",
    animation: `${pulse} 2s infinite`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      content: '""',
    },
  },
}));

const iconComponents = {
  Dashboard: Dashboard,
  BallotIcon: BallotIcon,
  People: People,
  BarChart: BarChart,
  Settings: Settings,
  Inventory: Inventory,
  Messages: MessagesIcon,
  Campaigns: CampaignsIcon,
  Advertisers: GroupsIcon,
};

export default function Sidebar({
  open,
  collapsed,
  isMobile,
  toggleDrawer,
  activePage,
  navItems,
  handleNavigation,
}) {
  const theme = useTheme();
  const [animateLogo, setAnimateLogo] = useState(false);

  useEffect(() => {
    if (collapsed) {
      setAnimateLogo(true);
      const timer = setTimeout(() => setAnimateLogo(false), 500);
      return () => clearTimeout(timer);
    }
  }, [collapsed]);

  return (
    <SidebarDrawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      collapsed={collapsed}
      onClose={() => isMobile && toggleDrawer()}
      ModalProps={{ keepMounted: true }}
    >
      <br/>
      <br/>
      <br/>
      <List sx={{ pt: 1, px: 0.5 }}>
        {navItems.map(({ text, icon, path, badge }) => {
          const IconComponent = iconComponents[icon];
          const iconElement = badge ? (
            <NotificationBadge badgeContent={badge} color="primary">
              <IconComponent fontSize="inherit" />
            </NotificationBadge>
          ) : (
            <IconComponent fontSize="inherit" />
          );

          return (
            <Tooltip
              key={text}
              title={collapsed ? text : ""}
              placement="right"
              arrow
              enterDelay={200}
              enterNextDelay={150}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: PRIMARY_COLOR,
                    fontSize: theme.typography.pxToRem(12),
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.25)",
                  },
                },
                arrow: {
                  sx: {
                    color: PRIMARY_COLOR,
                  },
                },
              }}
            >
              <ListItemStyled
                button
                selected={activePage === text}
                onClick={() => {
                  handleNavigation(path);
                  if (isMobile) toggleDrawer();
                }}
                sx={{
                  justifyContent: collapsed ? "center" : "flex-start",
                  px: collapsed ? 2 : 3,
                  py: 1.5,
                  my: 0.5,
                }}
                aria-current={activePage === text ? "page" : undefined}
              >
                <SidebarListItemIcon>{iconElement}</SidebarListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      letterSpacing: 0.2,
                    }}
                  />
                )}
              </ListItemStyled>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.05)", my: 1.5 }} />

      <Box
        sx={{
          mt: "auto",
          p: collapsed ? 1.2 : 2.5,
          background: "rgba(25, 118, 210, 0.03)",
          borderRadius: collapsed ? "50%" : 4,
          margin: collapsed ? "10px auto" : "15px 18px",
          textAlign: "center",
          border: "1px dashed rgba(25, 118, 210, 0.15)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.1)",
          },
        }}
      >
        {collapsed ? (
          <Tooltip
            title="Premium Support"
            arrow
            placement="right"
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: PRIMARY_COLOR,
                  fontSize: theme.typography.pxToRem(12),
                  fontWeight: 600,
                },
              },
              arrow: {
                sx: {
                  color: PRIMARY_COLOR,
                },
              },
            }}
          >
            <SupportAgent
              sx={{
                color: PRIMARY_COLOR,
                fontSize: 28,
                "&:hover": {
                  transform: "scale(1.1)",
                },
                transition: "transform 0.3s ease",
              }}
            />
          </Tooltip>
        ) : (
          <>
            <Box
              sx={{
                width: 60,
                height: 60,
                background: "rgba(25, 118, 210, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1.5,
              }}
            >
              <SupportAgent sx={{ color: PRIMARY_COLOR, fontSize: 32 }} />
            </Box>
            <Typography
              variant="body2"
              color={PRIMARY_COLOR}
              fontWeight={600}
              sx={{ opacity: 0.9 }}
            >
              Premium Support
            </Typography>
            <Button
              variant="outlined"
              sx={{
                mt: 1.5,
                fontWeight: 700,
                borderRadius: 2,
                py: 0.8,
                px: 3,
                color: PRIMARY_COLOR,
                borderColor: PRIMARY_COLOR,
                "&:hover": {
                  background: `linear-gradient(90deg, ${PRIMARY_COLOR} 0%, ${SECONDARY_COLOR} 100%)`,
                  color: "#fff",
                  borderColor: "transparent",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.25)",
                },
                transition: "all 0.3s ease",
              }}
              onClick={() => alert("Support contact action")}
            >
              Contact Now
            </Button>
          </>
        )}
      </Box>
    </SidebarDrawer>
  );
}
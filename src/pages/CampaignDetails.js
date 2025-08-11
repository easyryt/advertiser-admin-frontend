// src/CampaignDetails.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  LinearProgress,
  Chip,
  Button,
  useMediaQuery,
  Tooltip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";
import {
  Campaign,
  MonetizationOn,
  Download,
  Reviews,
  CalendarToday,
  Link as LinkIcon,
  CheckCircle,
  PendingActions,
  Error as ErrorIcon,
  Edit,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const CampaignDetails = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { campaignId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://advertiserappnew.onrender.com/admin/plan/get/688b4fe96e51a50c15e95d2e`,
          { withCredentials: true }
        );
        if (response.data.status && response.data.data) {
          setCampaign(response.data.data);
          setNewName(response.data.data.name);
        } else {
          setError("Campaign data not found");
        }
      } catch (err) {
        setError("Failed to fetch campaign data");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignData();
  }, [campaignId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "active":
        return "success";
      case "completed":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <PendingActions />;
      case "active":
        return <CheckCircle />;
      case "completed":
        return <CheckCircle />;
      default:
        return <ErrorIcon />;
    }
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleUpdateCampaign = async () => {
    try {
      setUpdateLoading(true);
      const response = await axios.put(
        `https://advertiserappnew.onrender.com/adv/campaign/update/${campaignId}`,
        { name: newName },
        { withCredentials: true }
      );
      
      if (response.data.status) {
        setCampaign({ ...campaign, name: newName });
        setSnackbarMessage("Campaign name updated successfully!");
        setSnackbarSeverity("success");
        setEditOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update campaign");
      }
    } catch (err) {
      setSnackbarMessage(err.message || "Error updating campaign");
      setSnackbarSeverity("error");
    } finally {
      setUpdateLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const budgetPercentage = campaign
    ? (campaign.budgetSpent / campaign.budgetTotal) * 100
    : 0;
  const installsPercentage = campaign
    ? (campaign.installsCount / campaign.target) * 100
    : 0;

  // Loading Screen
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={70} color="primary" />
      </Box>
    );
  }

  // Error Screen
  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <ErrorIcon sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ fontWeight: 600, px: 4 }}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ pt: isMobile ? 2 : 6, pb: 3 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: 2,
              mb: isMobile ? 2 : 4,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              sx={{
                fontWeight: 900,
                flex: 1,
                letterSpacing: "0.02em",
                color: "text.primary",
              }}
            >
              Campaign Details
            </Typography>
            <Chip
              icon={getStatusIcon(campaign.status)}
              label={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              color={getStatusColor(campaign.status)}
              variant="filled"
              sx={{ px: 2, py: 1, fontSize: "1rem", fontWeight: 700, borderRadius: 2 }}
            />
          </Box>
        </motion.div>
        {/* Main content: 2 Columns layout */}
        <Grid
          container
          spacing={isMobile ? 2 : 4}
          alignItems="stretch"
          sx={{
            flexDirection: { xs: "column-reverse", md: "row" }
          }}
        >
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Campaign Info */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <Card
                elevation={4}
                sx={{
                  mb: isMobile ? 2 : 4,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  position: "relative"
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <CardMedia
                        component="img"
                        image={campaign.appLogo.url}
                        alt="App Logo"
                        sx={{
                          width: isMobile ? 60 : 90,
                          height: isMobile ? 60 : 90,
                          objectFit: "cover",
                          borderRadius: 2,
                        }}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700 }}>
                        {campaign.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 1.2, flexWrap: "wrap" }}>
                        <LinkIcon sx={{ mr: 0.8, color: "primary.main", fontSize: 18 }} />
                        <Tooltip
                          arrow
                          title={<span style={{ wordBreak: "break-all" }}>{campaign.appLink}</span>}
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 400 }}
                        >
                          <Typography
                            variant="body2"
                            component="a"
                            href={campaign.appLink}
                            target="_blank"
                            rel="noopener"
                            sx={{
                              color: "primary.main",
                              wordBreak: "break-all",
                              textDecoration: "none",
                              fontWeight: 600,
                              transition: "color 0.2s",
                              "&:hover": { textDecoration: "underline", color: "secondary.main" },
                            }}
                          >
                            {campaign.appLink}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
            {/* Budget Card */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.13 }}
            >
              <Card elevation={3} sx={{ mb: isMobile ? 2 : 4, borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <MonetizationOn sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Budget Overview
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{
                      display: "flex", justifyContent: "space-between", mb: 1.2
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Spent: <strong>${campaign.budgetSpent}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total: <strong>${campaign.budgetTotal}</strong>
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={budgetPercentage}
                      sx={{
                        height: 11,
                        borderRadius: 6,
                        bgcolor: theme.palette.grey[200],
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.8 }}>
                      {budgetPercentage.toFixed(1)}% budget used
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "primary.light",
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Cost Per Install
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          ${campaign.costPerInstall}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "secondary.light",
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Remaining Budget
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          ${Math.max(campaign.budgetTotal - campaign.budgetSpent, 0)}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
            {/* Installs Card */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Download sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Installs Overview
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{
                      display: "flex", justifyContent: "space-between", mb: 1.2
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Installs: <strong>{campaign.installsCount}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Target: <strong>{campaign.target}</strong>
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={installsPercentage}
                      color="info"
                      sx={{
                        height: 11,
                        borderRadius: 6,
                        bgcolor: theme.palette.grey[200],
                        "& .MuiLinearProgress-bar": { borderRadius: 6 },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.8 }}>
                      {installsPercentage.toFixed(1)}% of target reached
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "info.light",
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Reviews
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {campaign.reviewCount}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "success.light",
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Campaign Type
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                          {campaign.type}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <Card elevation={3} sx={{ mb: isMobile ? 2 : 4, borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Campaign Timeline
                    </Typography>
                  </Box>
                  <Box sx={{ position: "relative", pl: 3 }}>
                    {[["Start Date", campaign.startDate], ["End Date", campaign.endDate]].map(
                      ([label, date], i) => (
                        <Box key={label} sx={{ position: "relative", mb: i === 0 ? 3 : 0 }}>
                          <Box
                            sx={{
                              position: "absolute",
                              left: -24,
                              top: 7,
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              zIndex: 2,
                            }}
                          />
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, letterSpacing: "0.015em" }}
                          >
                            {label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(date)}
                          </Typography>
                          {i === 0 && (
                            <Box
                              sx={{
                                position: "absolute",
                                left: -17,
                                top: 14,
                                width: 2.5,
                                height: 36,
                                bgcolor: "primary.main",
                                borderRadius: 1
                              }}
                            />
                          )}
                        </Box>
                      )
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.33 }}
            >
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Campaign sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Campaign Actions
                    </Typography>
                  </Box>
                  {/* Edit */}
                  <Button
                    variant="outlined"
                    fullWidth
                    color="secondary"
                    startIcon={<Edit />}
                    onClick={handleEditOpen}
                    sx={{ 
                      mb: 2, 
                      py: 1.5, 
                      borderRadius: 2, 
                      fontWeight: 600, 
                      fontSize: "1rem" 
                    }}
                  >
                    Edit Campaign Name
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Name Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Edit sx={{ mr: 1, color: "primary.main" }} />
            Edit Campaign Name
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Update the name of your campaign. This will be visible in all campaign reports.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Campaign Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={handleNameChange}
            disabled={updateLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleEditClose} 
            color="inherit"
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateCampaign} 
            color="primary"
            variant="contained"
            disabled={updateLoading || !newName.trim()}
          >
            {updateLoading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CampaignDetails;
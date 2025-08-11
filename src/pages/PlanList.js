import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Fade,
  Grow,
  Zoom,
  Divider,
  Tooltip,
  IconButton,
  Grid,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InfoIcon from "@mui/icons-material/Info";
import { styled, alpha } from "@mui/material/styles";

// Premium styled components
const PremiumButton = styled(Button)(({ theme }) => ({
  borderRadius: "12px",
  fontWeight: 700,
  letterSpacing: "0.5px",
  padding: "10px 24px",
  boxShadow: theme.shadows[3],
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[8],
    transform: "translateY(-2px)",
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  },
}));

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: "none",
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    color: theme.palette.text.primary,
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    fontWeight: 700,
    fontSize: "0.9rem",
    color: theme.palette.text.primary,
    padding: "0 16px",
    "&:focus-within": {
      outline: "none",
    },
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 700,
    color: theme.palette.text.primary,
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiDataGrid-toolbarContainer": {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
  },
  "& .MuiDataGrid-row": {
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.05),
    },
  },
  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: theme.palette.background.paper,
  },
}));

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Form state
  const [formData, setFormData] = useState({
    planType: "cpi",
    planDescription: "",
    planAmount: "",
    installs: "",
    reviews: "",
  });

  const [formErrors, setFormErrors] = useState({
    planDescription: false,
    planAmount: false,
    installs: false,
    reviews: false,
  });

  const planTypes = [
    {
      value: "cpi",
      label: "Cost Per Install (CPI)",
      field: "installs",
      fieldLabel: "Installs",
      icon: (
        <CheckCircleIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
      ),
    },
    {
      value: "review",
      label: "Verified Reviews",
      field: "reviews",
      fieldLabel: "Reviews",
      icon: (
        <MonetizationOnIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
      ),
    },
  ];

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://advertiserappnew.onrender.com/admin/plan/getAll",
        { withCredentials: true }
      );

      if (response?.data?.status && response?.data?.data) {
        setPlans(response?.data?.data || []);
      } else {
        setPlans([]);
        setError("No plans data available");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to load plans"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreateClick = () => {
    setFormData({
      planType: "cpi",
      planDescription: "",
      planAmount: "",
      installs: "",
      reviews: "",
    });
    setFormErrors({
      planDescription: false,
      planAmount: false,
      installs: false,
      reviews: false,
    });
    setOpenCreateDialog(true);
  };

  const handleEditClick = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      planType: plan?.planType ?? "",
      planDescription: plan?.planDescription ?? "",
      planAmount: plan?.planAmount ?? "",
      installs: plan?.installs ?? "",
      reviews: plan?.reviews ?? "",
    });
    setFormErrors({
      planDescription: false,
      planAmount: false,
      installs: false,
      reviews: false,
    });
    setOpenUpdateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
    setSelectedPlan(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedPlan(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e?.target ?? {};
    setFormData({
      ...formData,
      [name]: value,
    });

    if (formErrors?.[name]) {
      setFormErrors({
        ...formErrors,
        [name]: false,
      });
    }
  };

  const validateForm = () => {
    const errors = {
      planDescription: !formData?.planDescription,
      planAmount:
        !formData?.planAmount ||
        isNaN(formData?.planAmount) ||
        formData?.planAmount <= 0,
    };

    // Validate based on plan type
    if (formData?.planType === "cpi") {
      errors.installs =
        !formData?.installs ||
        isNaN(formData?.installs) ||
        formData?.installs <= 0;
    } else {
      errors.reviews =
        !formData?.reviews ||
        isNaN(formData?.reviews) ||
        formData?.reviews <= 0;
    }

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  const handleCreatePlan = async () => {
    if (!validateForm()) return;

    try {
      setCreatingPlan(true);
      const payload = {
        planType: formData?.planType,
        planDescription: formData.planDescription,
        planAmount: Number(formData.planAmount),
      };

      // Add plan type specific field
      if (formData.planType === "cpi") {
        payload.installs = Number(formData.installs);
      } else {
        payload.reviews = Number(formData.reviews);
      }

      const response = await axios.post(
        "https://advertiserappnew.onrender.com/admin/plan/create",
        payload,
        { withCredentials: true }
      );

      if (response?.data?.status) {
        setSnackbar({
          open: true,
          message: "Plan created successfully!",
          severity: "success",
        });
        fetchPlans();
        setOpenCreateDialog(false);
      } else {
        throw new Error(response?.data?.message || "Failed to create plan");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to create plan",
        severity: "error",
      });
    } finally {
      setCreatingPlan(false);
    }
  };

  const handleUpdatePlan = async () => {
    if (!selectedPlan || !validateForm()) return;

    try {
      setUpdatingPlan(true);
      const payload = {
        planType: formData?.planType,
        planDescription: formData.planDescription,
        planAmount: Number(formData.planAmount),
      };

      // Add plan type specific field
      if (formData?.planType === "cpi") {
        payload.installs = Number(formData.installs);
      } else {
        payload.reviews = Number(formData.reviews);
      }

      const response = await axios.put(
        `https://advertiserappnew.onrender.com/admin/plan/update/${selectedPlan?._id}`,
        payload,
        { withCredentials: true }
      );

      if (response?.data?.status) {
        setSnackbar({
          open: true,
          message: "Plan updated successfully!",
          severity: "success",
        });
        fetchPlans();
        setOpenUpdateDialog(false);
      } else {
        throw new Error(response?.data?.message || "Failed to update plan");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to update plan",
        severity: "error",
      });
    } finally {
      setUpdatingPlan(false);
    }
  };

  const handleDeleteClick = (id) => {
    const plan = plans?.find((p) => p?._id === id);
    setSelectedPlan(plan);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPlan) return;

    try {
      setDeletingPlan(true);
      const response = await axios.delete(
        `https://advertiserappnew.onrender.com/admin/plan/delete/${selectedPlan?._id}`,
        { withCredentials: true }
      );

      if (response?.data?.status) {
        setSnackbar({
          open: true,
          message: "Plan deleted successfully!",
          severity: "success",
        });
        fetchPlans();
        setOpenDeleteDialog(false);
      } else {
        throw new Error(response?.data?.message || "Failed to delete plan");
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to delete plan",
        severity: "error",
      });
    } finally {
      setDeletingPlan(false);
      setSelectedPlan(null);
    }
  };

  const getTargetValue = (plan) => {
    if (plan?.planType === "cpi") {
      return plan?.installs;
    } else if (plan?.planType === "review") {
      return plan?.reviews;
    }
    return "-";
  };

  const getTargetLabel = (planType) => {
    const type = planTypes?.find((t) => t?.value === planType);
    return type?.fieldLabel ?? "Target";
  };

  const columns = [
    {
      field: "planType",
      headerName: "PLAN TYPE",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const planType = planTypes.find((t) => t.value === params.value);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {planType?.icon}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                textTransform: "uppercase",
              }}
            >
              {params.value === "cpi" ? "CPI" : "REVIEW"}
            </Typography>
            <Tooltip title={planType?.label} placement="top">
              <InfoIcon
                sx={{
                  fontSize: "1rem",
                  ml: 1,
                  color: theme.palette.text.secondary,
                }}
              />
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: "planDescription",
      headerName: "DESCRIPTION",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            lineHeight: 1.4,
            fontWeight: 500,
            fontStyle: params.value ? "normal" : "italic",
            color: theme.palette.text.primary,
          }}
        >
          {params?.value || "No description"}
        </Typography>
      ),
    },
    {
      field: "planAmount",
      headerName: "AMOUNT",
      type: "number",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {params?.value ? (
            <Box
              sx={{
                backgroundColor: alpha(theme.palette.success.light, 0.2),
                borderRadius: "20px",
                px: 1.5,
                py: 0.5,
                display: "inline-flex",
                alignItems: "center",
                border: `1px solid ${theme.palette.success.light}`,
              }}
            >
              <MonetizationOnIcon
                sx={{
                  fontSize: "1.2rem",
                  mr: 0.5,
                  color: theme.palette.success.dark,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.success.dark,
                }}
              >
                ${params?.value?.toLocaleString()}
              </Typography>
            </Box>
          ) : (
            "-"
          )}
        </Box>
      ),
    },
    {
      field: "target",
      headerName: "TARGET",
      type: "number",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: theme.palette.info.dark,
              backgroundColor: alpha(theme.palette.info.light, 0.2),
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
            }}
          >
            {getTargetValue(params?.row) || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "CREATED",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!params?.value) return "-";
        const date = new Date(params?.value);
        return (
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.grey[300], 0.1),
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              {date.toLocaleDateString()}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => handleEditClick(params.row)}
            sx={{
              backgroundColor: alpha(theme.palette.primary.light, 0.2),
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                color: "white",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteClick(params.id)}
            sx={{
              backgroundColor: alpha(theme.palette.error.light, 0.2),
              color: theme.palette.error.main,
              "&:hover": {
                backgroundColor: theme.palette.error.main,
                color: "white",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: isMobile ? 2 : 4,
        mx: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2f6 100%)",
        minHeight: "100vh",
      }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6 } }}
    >
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar?.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Grow}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar?.severity}
          variant="filled"
          sx={{
            width: "100%",
            boxShadow: theme.shadows[6],
            alignItems: "center",
            fontWeight: 500,
            borderRadius: "12px",
            color: "white",
          }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <DeleteIcon fontSize="inherit" />,
          }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
      {/* Header with Create Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
          background: "white",
          p: 3,
          borderRadius: 4,
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        }}
        component={motion.div}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box>
          <Typography
            variant={isMobile ? "h6" : "h4"}
            fontWeight={800}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            Advertising Plans
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: "600px" }}
          >
            Manage your advertising packages and pricing strategies with our
            premium plans designed to maximize your ROI
          </Typography>
        </Box>
        <PremiumButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          sx={{
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
          }}
        >
          Create New Plan
        </PremiumButton>
      </Box>

      {/* Stats Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "white",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                TOTAL PLANS
              </Typography>
              <Box
                sx={{
                  backgroundColor: alpha(theme.palette.primary.light, 0.2),
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleIcon
                  sx={{ color: theme.palette.primary.main, fontSize: 20 }}
                />
              </Box>
            </Box>
            <Typography variant="h4" fontWeight={800}>
              {plans.length}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, fontSize: "0.85rem" }}
            >
              <Box
                component="span"
                sx={{ color: theme.palette.success.main, fontWeight: 600 }}
              >
                +12%
              </Box>{" "}
              from last month
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "white",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                CPI PLANS
              </Typography>
              <Box
                sx={{
                  backgroundColor: alpha(theme.palette.success.light, 0.2),
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MonetizationOnIcon
                  sx={{ color: theme.palette.success.main, fontSize: 20 }}
                />
              </Box>
            </Box>
            <Typography variant="h4" fontWeight={800}>
              {plans.filter((p) => p.planType === "cpi").length}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, fontSize: "0.85rem" }}
            >
              Most popular plan type
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "white",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                REVIEW PLANS
              </Typography>
              <Box
                sx={{
                  backgroundColor: alpha(theme.palette.info.light, 0.2),
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <InfoIcon
                  sx={{ color: theme.palette.info.main, fontSize: 20 }}
                />
              </Box>
            </Box>
            <Typography variant="h4" fontWeight={800}>
              {plans.filter((p) => p.planType === "review").length}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, fontSize: "0.85rem" }}
            >
              High conversion rates
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              background: "white",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                AVG. PLAN VALUE
              </Typography>
              <Box
                sx={{
                  backgroundColor: alpha(theme.palette.warning.light, 0.2),
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MonetizationOnIcon
                  sx={{ color: theme.palette.warning.main, fontSize: 20 }}
                />
              </Box>
            </Box>
            <Typography variant="h4" fontWeight={800}>
              $
              {plans.length > 0
                ? Math.round(
                    plans.reduce((acc, plan) => acc + plan.planAmount, 0) /
                      plans.length
                  ).toLocaleString()
                : "0"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, fontSize: "0.85rem" }}
            >
              Across all advertising plans
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Plan Table */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.paper,
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Box
            sx={{
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color={theme.palette.text.primary}
            >
              All Advertising Plans
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {plans.length} plans available
            </Typography>
          </Box>
          {error ? (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
              }}
            >
              <Typography variant="h6" color="error" gutterBottom>
                Error loading plans
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mb: 2, textAlign: "center" }}
              >
                {error}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={fetchPlans}
                sx={{ borderRadius: "12px", px: 3 }}
              >
                Retry
              </Button>
            </Box>
          ) : (
            <Box sx={{ width: "100%", height: "100%", flex: 1 }}>
              <StyledDataGrid
                rows={plans || []}
                columns={columns}
                getRowId={(row) => row?._id}
                loading={loading}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25]}
                disableSelectionOnClick
                components={{
                  LoadingOverlay: LinearProgress,
                  Toolbar: GridToolbar,
                }}
                componentsProps={{
                  toolbar: {
                    sx: {
                      "& .MuiButton-root": {
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      },
                    },
                  },
                }}
                sx={{
                  "& .MuiDataGrid-columnHeader": {
                    py: 2,
                  },
                }}
              />
            </Box>
          )}
        </Paper>
      </Box>

      {/* Create Plan Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            background: theme.palette.background.paper,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "white",
            fontWeight: 700,
            fontSize: "1.25rem",
            py: 2,
            textAlign: "center",
          }}
        >
          Create New Plan
        </DialogTitle>
        <br />
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              select
              label="Plan Type"
              name="planType"
              value={formData?.planType}
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              size="medium"
              sx={{ mt: 1 }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      borderRadius: "12px",
                      marginTop: "8px",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                    },
                  },
                },
              }}
            >
              {planTypes?.map((option) => (
                <MenuItem key={option?.value} value={option?.value}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {option?.icon}
                    {option?.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Description"
              name="planDescription"
              value={formData?.planDescription}
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              size="medium"
              multiline
              rows={3}
              error={formErrors?.planDescription}
              helperText={
                formErrors?.planDescription ? "Description is required" : ""
              }
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                },
                "& label": {
                  color: theme.palette.text.primary,
                },
              }}
            />

            <TextField
              label="Amount ($)"
              name="planAmount"
              value={formData?.planAmount}
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              size="medium"
              type="number"
              error={formErrors?.planAmount}
              helperText={
                formErrors?.planAmount ? "Valid amount is required" : ""
              }
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                },
                "& label": {
                  color: theme.palette.text.primary,
                },
              }}
              InputProps={{
                startAdornment: (
                  <MonetizationOnIcon
                    sx={{
                      color: theme.palette.text.secondary,
                      mr: 1,
                    }}
                  />
                ),
              }}
            />

            {formData?.planType === "cpi" ? (
              <TextField
                label="Installs"
                name="installs"
                value={formData?.installs}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                size="medium"
                type="number"
                error={formErrors?.installs}
                helperText={
                  formErrors?.installs ? "Valid install count is required" : ""
                }
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                  },
                  "& label": {
                    color: theme.palette.text.primary,
                  },
                }}
              />
            ) : (
              <TextField
                label="Reviews"
                name="reviews"
                value={formData?.reviews}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                size="medium"
                type="number"
                error={formErrors?.reviews}
                helperText={
                  formErrors?.reviews ? "Valid review count is required" : ""
                }
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                  },
                  "& label": {
                    color: theme.palette.text.primary,
                  },
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}
        >
          <Button
            onClick={handleCloseCreateDialog}
            color="secondary"
            sx={{
              borderRadius: "12px",
              px: 3,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Cancel
          </Button>
          <PremiumButton
            onClick={handleCreatePlan}
            disabled={creatingPlan}
            sx={{ minWidth: 120 }}
          >
            {creatingPlan ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create"
            )}
          </PremiumButton>
        </DialogActions>
      </Dialog>

      {/* Update Plan Dialog */}
      <Dialog
        open={openUpdateDialog}
        onClose={handleCloseUpdateDialog}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Zoom}
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            background: theme.palette.background.paper,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            color: "white",
            fontWeight: 700,
            fontSize: "1.25rem",
            py: 2,
            textAlign: "center",
          }}
        >
          Update Plan
        </DialogTitle>
        <br />
        <DialogContent sx={{ py: 3, px: 3 }}>
          {selectedPlan && (
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
            >
              <TextField
                select
                label="Plan Type"
                name="planType"
                value={formData?.planType}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                size="medium"
                disabled
                sx={{ mt: 1 }}
              >
                {planTypes?.map((option) => (
                  <MenuItem key={option?.value} value={option?.value}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {option?.icon}
                      {option?.label}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Description"
                name="planDescription"
                value={formData?.planDescription}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                size="medium"
                multiline
                rows={3}
                error={formErrors?.planDescription}
                helperText={
                  formErrors?.planDescription ? "Description is required" : ""
                }
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                  },
                  "& label": {
                    color: theme.palette.text.primary,
                  },
                }}
              />

              <TextField
                label="Amount ($)"
                name="planAmount"
                value={formData?.planAmount}
                onChange={handleFormChange}
                fullWidth
                variant="outlined"
                size="medium"
                type="number"
                error={formErrors?.planAmount}
                helperText={
                  formErrors?.planAmount ? "Valid amount is required" : ""
                }
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0, 0.1)",
                  },
                  "& label": {
                    color: theme.palette.text.primary,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <MonetizationOnIcon
                      sx={{
                        color: theme.palette.text.secondary,
                        mr: 1,
                      }}
                    />
                  ),
                }}
              />

              {formData.planType === "cpi" ? (
                <TextField
                  label="Installs"
                  name="installs"
                  value={formData?.installs}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  type="number"
                  error={formErrors?.installs}
                  helperText={
                    formErrors?.installs
                      ? "Valid install count is required"
                      : ""
                  }
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "12px",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                    },
                    "& label": {
                      color: theme.palette.text.primary,
                    },
                  }}
                />
              ) : (
                <TextField
                  label="Reviews"
                  name="reviews"
                  value={formData?.reviews}
                  onChange={handleFormChange}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  type="number"
                  error={formErrors?.reviews}
                  helperText={
                    formErrors?.reviews ? "Valid review count is required" : ""
                  }
                  sx={{
                    "& .MuiInputBase-root": {
                      borderRadius: "12px",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                    },
                    "& label": {
                      color: theme.palette.text.primary,
                    },
                  }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}
        >
          <Button
            onClick={handleCloseUpdateDialog}
            color="secondary"
            sx={{
              borderRadius: "12px",
              px: 3,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Cancel
          </Button>
          <PremiumButton
            onClick={handleUpdatePlan}
            disabled={updatingPlan}
            sx={{ minWidth: 120 }}
          >
            {updatingPlan ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update"
            )}
          </PremiumButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            background: theme.palette.background.paper,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            py: 2,
            textAlign: "center",
            background: theme.palette.grey[100],
            color: theme.palette.text.primary,
          }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography
            variant="body1"
            fontWeight={500}
            textAlign="center"
            color={theme.palette.text.primary}
          >
            Are you sure you want to delete this plan?
          </Typography>
          <Box
            sx={{
              mt: 3,
              p: 3,
              backgroundColor: theme.palette.grey[50],
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{ mb: 1, textAlign: "center", color: theme.palette.error.main }}
            >
              {selectedPlan?.planDescription}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Type:
              </Typography>
              <Typography variant="body2" fontWeight={600} color={theme.palette.text.primary}>
                {selectedPlan?.planType === "cpi" ? "CPI" : "REVIEW"}
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Amount:
              </Typography>
              <Typography variant="body2" fontWeight={600} color={theme.palette.text.primary}>
                ${selectedPlan?.planAmount?.toLocaleString?.()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                {getTargetLabel(selectedPlan?.planType)}:
              </Typography>
              <Typography variant="body2" fontWeight={600} color={theme.palette.text.primary}>
                {getTargetValue(selectedPlan)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}
        >
          <Button
            onClick={handleCloseDeleteDialog}
            color="secondary"
            sx={{
              borderRadius: "12px",
              px: 3,
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deletingPlan}
            startIcon={
              deletingPlan ? <CircularProgress size={20} /> : <DeleteIcon />
            }
            sx={{
              borderRadius: "12px",
              px: 3,
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
              color: "white",
              "&:hover": {
                boxShadow: theme.shadows[4],
              },
            }}
          >
            {deletingPlan ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlanList;
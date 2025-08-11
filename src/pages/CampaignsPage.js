import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  CalendarToday,
  EventAvailable,
  EventBusy,
  AttachMoney,
  People,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate, useParams } from "react-router-dom";

const CampaignsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { advertiserId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    type: "cpi",
    budgetTotal: "",
    target: "",
    appLink: "",
    appLogo: null,
    startDate: null,
    endDate: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(
        "https://advertiserappnew.onrender.com/adv/campaign/getAll",
        { withCredentials: true }
      );
      if (response.data.status && Array.isArray(response.data.data)) {
        setCampaigns(response.data.data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch campaigns"
      );
    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line
  }, []);

  const handleRefresh = () => {
    setRefreshLoading(true);
    setError("");
    fetchCampaigns();
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
    setFormData({
      name: "",
      type: "cpi",
      budgetTotal: "",
      target: "",
      appLink: "",
      appLogo: null,
      startDate: null,
      endDate: null,
    });
    setFormErrors({});
    setCreateError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      appLogo: e.target.files[0],
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Campaign name is required";
    if (!formData.budgetTotal || formData.budgetTotal <= 0)
      errors.budgetTotal = "Budget must be greater than 0";
    if (!formData.target || formData.target <= 0)
      errors.target = "Target must be greater than 0";
    if (!formData.appLink) errors.appLink = "App link is required";
    else if (!/^https?:\/\//i.test(formData.appLink))
      errors.appLink = "Invalid URL format";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    else if (formData.startDate && formData.endDate <= formData.startDate)
      errors.endDate = "End date must be after start date";
    if (!formData.appLogo) errors.appLogo = "App logo is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setCreateLoading(true);
      setCreateError("");
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("type", formData.type);
      formPayload.append("budgetTotal", formData.budgetTotal);
      formPayload.append("target", formData.target);
      formPayload.append("appLink", formData.appLink);
      formPayload.append("appLogo", formData.appLogo);
      formPayload.append("startDate", formData.startDate.toISOString());
      formPayload.append("endDate", formData.endDate.toISOString());
      const response = await axios.post(
        `https://advertiserappnew.onrender.com/adv/campaign/create/${advertiserId}`,
        formPayload,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.status) {
        fetchCampaigns();
        handleCreateDialogClose();
      } else {
        throw new Error(response.data.message || "Failed to create campaign");
      }
    } catch (err) {
      setCreateError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create campaign"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // All columns with minWidth, no flex, no width 
  const columns = [
    {
      field: "name",
      headerName: "Campaign Name",
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body1" fontWeight={600}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      minWidth: 150,
      renderCell: (params) => (
        <Box
          sx={{
            bgcolor: params.value === "CPC" ? "#e3f2fd" : "#e8f5e9",
            color: params.value === "CPC" ? "#1976d2" : "#2e7d32",
            px: 1.5,
            py: 0.5,
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "appLink",
      headerName: "App Link",
      minWidth: 250,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <LinkIcon fontSize="small" color="primary" />
          <Typography
            variant="body2"
            sx={{
              textDecoration: "underline",
              color: "primary.main",
              cursor: "pointer",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 180,
            }}
            onClick={() => window.open(params.value, "_blank")}
          >
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "appLogo",
      headerName: "App Logo",
      minWidth: 140,
      renderCell: (params) =>
        params.row.appLogo?.url ? (
          <Box
            component="img"
            src={params.row.appLogo.url}
            alt="App logo"
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              objectFit: "contain",
            }}
          />
        ) : (
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: "grey.100",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageIcon fontSize="small" color="disabled" />
          </Box>
        ),
    },
    {
      field: "startDate",
      headerName: "Start Date",
      minWidth: 160,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <CalendarToday fontSize="small" color="primary" />
          <Typography variant="body2">{formatDate(params.value)}</Typography>
        </Stack>
      ),
    },
    {
      field: "endDate",
      headerName: "End Date",
      minWidth: 160,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          {new Date(params.value) > new Date() ? (
            <EventAvailable fontSize="small" color="success" />
          ) : (
            <EventBusy fontSize="small" color="error" />
          )}
          <Typography
            variant="body2"
            color={
              new Date(params.value) > new Date()
                ? "text.primary"
                : "error.main"
            }
          >
            {formatDate(params.value)}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      renderCell: (params) => {
        const endDate = new Date(params.row.endDate);
        const today = new Date();
        const isActive = today <= endDate;
        return (
          <Box
            sx={{
              bgcolor: isActive ? "#e8f5e9" : "#ffebee",
              color: isActive ? "#2e7d32" : "#d32f2f",
              px: 1.5,
              py: 0.5,
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {isActive ? "Active" : "Ended"}
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "ACTION",
      minWidth: 180,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            navigate(`/dashboard/campaigns-details/${params.row._id}`)
          }
          sx={{
            whiteSpace: "nowrap",
            fontWeight: 600,
            color: theme.palette.info.main,
            borderColor: theme.palette.info.main,
            "&:hover": {
              backgroundColor: theme.palette.info.light,
              borderColor: theme.palette.info.dark,
            },
          }}
        >
          View Campaign
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert
          severity="error"
          icon={<ErrorIcon fontSize="large" />}
          sx={{ fontSize: 16 }}
        >
          <Typography variant="h6" mb={1}>
            Error Loading Campaigns
          </Typography>
          {error}
        </Alert>
        <Button
          variant="outlined"
          color="error"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          sx={{ mt: 3 }}
        >
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={4}
        >
          <Typography variant="h4" fontWeight={700} color="primary">
            Your Campaigns
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateDialogOpen}
              sx={{ borderRadius: 2 }}
            >
              New Campaign
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshLoading}
              sx={{ borderRadius: 2 }}
            >
              {refreshLoading ? <CircularProgress size={24} /> : "Refresh"}
            </Button>
          </Stack>
        </Stack>
        {campaigns.length === 0 ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" color="textSecondary" mb={2}>
              No campaigns found
            </Typography>
            <Typography variant="body1" mb={3}>
              You haven't created any campaigns yet. Start by creating your
              first campaign!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              size="large"
              onClick={handleCreateDialogOpen}
            >
              Create Campaign
            </Button>
          </Paper>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Paper
              elevation={3}
              sx={{
                height: 600,
                width: "100%",
                borderRadius: 3,
                overflow: "auto",
              }}
            >
              <DataGrid
                rows={campaigns}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 25]}
                disableSelectionOnClick
                getRowId={(row) => row._id || row.id}
                sx={{
                  border: "none",
                  minWidth: 1000,
                  "& .MuiDataGrid-columnHeaders": {
                    bgcolor:
                      theme.palette.mode === "light" ? "#f5f5f7" : "#121212",
                    borderRadius: 0,
                    fontSize: 15,
                    fontWeight: 700,
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    bgcolor:
                      theme.palette.mode === "light" ? "#f5f5f7" : "#121212",
                    borderRadius: 0,
                  },
                  "& .MuiDataGrid-row": {
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.03)",
                    },
                  },
                }}
              />
            </Paper>
          </Box>
        )}

        {/* Create Campaign Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={handleCreateDialogClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
            <Typography variant="h5" fontWeight={700}>
              Create New Campaign
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3} mt={1}>
                {createError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {createError}
                  </Alert>
                )}

                <TextField
                  name="name"
                  label="Campaign Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  fullWidth
                  required
                />

                <FormControl fullWidth error={!!formErrors.type}>
                  <InputLabel>Campaign Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    label="Campaign Type"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="cpi">CPI (Cost Per Install)</MenuItem>
                    <MenuItem value="cpc">CPC (Cost Per Click)</MenuItem>
                    <MenuItem value="cpm">CPM (Cost Per Mille)</MenuItem>
                  </Select>
                  {formErrors.type && (
                    <FormHelperText>{formErrors.type}</FormHelperText>
                  )}
                </FormControl>

                <TextField
                  name="budgetTotal"
                  label="Total Budget ($)"
                  type="number"
                  value={formData.budgetTotal}
                  onChange={handleInputChange}
                  error={!!formErrors.budgetTotal}
                  helperText={formErrors.budgetTotal}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  name="target"
                  label="Target Installs"
                  type="number"
                  value={formData.target}
                  onChange={handleInputChange}
                  error={!!formErrors.target}
                  helperText={formErrors.target}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <People />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  name="appLink"
                  label="App Store Link"
                  value={formData.appLink}
                  onChange={handleInputChange}
                  error={!!formErrors.appLink}
                  helperText={formErrors.appLink}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <Box>
                  <Button variant="outlined" component="label" fullWidth>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ImageIcon />
                      <Typography>
                        {formData.appLogo
                          ? formData.appLogo.name
                          : "Upload App Logo"}
                      </Typography>
                    </Stack>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {formErrors.appLogo && (
                    <Typography variant="caption" color="error">
                      {formErrors.appLogo}
                    </Typography>
                  )}
                </Box>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(date) => handleDateChange("startDate", date)}
                    slotProps={{
                      textField: {
                        error: !!formErrors.startDate,
                        helperText: formErrors.startDate,
                        fullWidth: true,
                      },
                    }}
                  />

                  <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={(date) => handleDateChange("endDate", date)}
                    minDate={formData.startDate || new Date()}
                    slotProps={{
                      textField: {
                        error: !!formErrors.endDate,
                        helperText: formErrors.endDate,
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Stack>
            </form>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={handleCreateDialogClose}
              color="secondary"
              disabled={createLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={createLoading}
              startIcon={
                createLoading ? <CircularProgress size={20} /> : <AddIcon />
              }
            >
              {createLoading ? "Creating..." : "Create Campaign"}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default CampaignsPage;

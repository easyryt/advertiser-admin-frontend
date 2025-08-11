import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Divider,
  TextField,
  MenuItem,
  Button,
  IconButton,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Chip,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DataGrid } from "@mui/x-data-grid";
import {
  FilterList,
  DateRange,
  ArrowUpward,
  ArrowDownward,
  Refresh,
  MonetizationOn,
  Cached,
  TrendingUp,
  People,
  TouchApp,
  RateReview,
  Campaign,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams } from "react-router-dom";

// Light theme with white background
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4361ee",
    },
    secondary: {
      main: "#3a0ca3",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    success: {
      main: "#2ecc71",
    },
    warning: {
      main: "#f39c12",
    },
    error: {
      main: "#e74c3c",
    },
    info: {
      main: "#3498db",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.5px",
      color: "#2d3436",
    },
    h5: {
      fontWeight: 600,
      color: "#2d3436",
    },
    h6: {
      fontWeight: 500,
      color: "#2d3436",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          background: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 30px rgba(67, 97, 238, 0.2)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 20px",
        },
        contained: {
          background: "linear-gradient(45deg, #4361ee, #3a0ca3)",
          boxShadow: "0 4px 15px rgba(67, 97, 238, 0.2)",
          color: "#ffffff",
          "&:hover": {
            background: "linear-gradient(45deg, #3a56e0, #2f0a8a)",
            boxShadow: "0 6px 20px rgba(67, 97, 238, 0.3)",
          },
        },
        outlined: {
          border: "2px solid rgba(67, 97, 238, 0.3)",
          color: "#4361ee",
          "&:hover": {
            border: "2px solid #4361ee",
            background: "rgba(67, 97, 238, 0.05)",
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(67, 97, 238, 0.05)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "rgba(67, 97, 238, 0.03)",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
  },
});

// Sample data structure for development when API is unavailable
const sampleData = {
  status: true,
  data: {
    summary: {
      totalCampaigns: 1,
      totalBudget: 500,
      totalSpent: 2.5,
      totalInstalls: 1,
      totalReviews: 0,
      totalClicks: 28,
      activeCampaigns: 1,
      completedCampaigns: 0,
      pausedCampaigns: 0,
      pendingCampaigns: 0,
      averageCTR: 0.0357,
      averageCPC: 0.0893,
      budgetUtilization: 0.005,
    },
    campaigns: [
      {
        _id: "6890bc04af109e2aa1b78080",
        name: "NotaAI - Ask AI Chat to Write",
        type: "cpi",
        budgetTotal: 500,
        budgetSpent: 2.5,
        appLogo: {
          filename: "applogoAdv/hn0fwex8m7i9obigxnha",
          url: "https://res.cloudinary.com/ddy5sbdtr/image/upload/v1754315780/applogoAdv/hn0fwex8m7i9obigxnha.webp",
        },
        costPerInstall: 2.5,
        installsCount: 1,
        reviewCount: 0,
        clickCount: 28,
        status: "approved",
        createdAt: "2025-08-04T13:56:20.151Z",
        endDate: "2025-08-09T19:27:26.366Z",
        startDate: "2025-08-04T19:27:26.366Z",
        packageName:
          "https://play.google.com/store/apps/details?id=com.notaAINotesAIChatOCR&pcampaignid=web_share",
        remainingBudget: 497.5,
        budgetUtilization: 0.005,
        ctr: 0.0357,
        cpc: 0.0893,
      },
    ],
    performanceByType: [
      {
        count: 1,
        totalBudget: 500,
        totalSpent: 2.5,
        totalInstalls: 1,
        totalReviews: 0,
        totalClicks: 28,
        avgCTR: 0.0357,
        avgCPC: 0.0893,
        type: "cpi",
      },
    ],
    monthlyPerformance: [
      {
        month: "2025-08",
        totalCampaigns: 1,
        totalSpent: 2.5,
        totalInstalls: 1,
        totalReviews: 0,
        totalClicks: 28,
      },
    ],
    statusDistribution: [
      {
        count: 1,
        totalBudget: 500,
        status: "approved",
      },
    ],
  },
};

const COLORS = [
  "#4361ee",
  "#3a0ca3",
  "#4cc9f0",
  "#4895ef",
  "#560bad",
  "#7209b7",
];
const STATUS_COLORS = {
  approved: "#2ecc71",
  pending: "#f39c12",
  completed: "#3498db",
  paused: "#e74c3c",
};

const AdvertiserAnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: [],
    type: "",
    minBudget: "",
    maxBudget: "",
    sortBy: "budgetUtilization",
    sortOrder: "asc",
  });
  const {advertiserId} = useParams()

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Construct query parameters
      const params = new URLSearchParams();
      if (filters.startDate)
        params.append(
          "startDate",
          filters.startDate.toISOString().split("T")[0]
        );
      if (filters.endDate)
        params.append("endDate", filters.endDate.toISOString().split("T")[0]);
      filters.status.forEach((status) => params.append("status[]", status));
      if (filters.type) params.append("type", filters.type);
      if (filters.minBudget) params.append("minBudget", filters.minBudget);
      if (filters.maxBudget) params.append("maxBudget", filters.maxBudget);
      params.append("sortBy", filters.sortBy);
      params.append("sortOrder", filters.sortOrder);

      const response = await axios.get(
        `https://advertiserappnew.onrender.com/admin/analytics/adv/analytics/${advertiserId}`,
        {
          withCredentials: true,
          params,
        }
      );

      if (response.data.status) {
        setData(response.data.data);
      } else {
        throw new Error("Failed to fetch data from server");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Using sample data for demonstration.");
      // Use sample data for demonstration
      setData(sampleData.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, advertiserId]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (event) => {
    const { value } = event.target;
    setFilters((prev) => ({
      ...prev,
      status: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      status: [],
      type: "",
      minBudget: "",
      maxBudget: "",
      sortBy: "budgetUtilization",
      sortOrder: "asc",
    });
  };

  // Campaign Data Grid columns
  const campaignColumns = [
    {
      field: "name",
      headerName: "Campaign Name",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <img
            src={params.row.appLogo.url}
            alt="App Logo"
            style={{ width: 40, height: 40, borderRadius: 8, marginRight: 12 }}
          />
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          size="small"
          sx={{
            backgroundColor: `${STATUS_COLORS[params.value]}22`,
            color: STATUS_COLORS[params.value],
            fontWeight: 600,
            border: `1px solid ${STATUS_COLORS[params.value]}`,
          }}
        />
      ),
    },
    {
      field: "type",
      headerName: "Type",
      width: 100,
      renderCell: (params) => (
        <Typography
          variant="body2"
          fontWeight={600}
          textTransform="uppercase"
          color="text.secondary"
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "budgetTotal",
      headerName: "Total Budget",
      width: 140,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="text.primary">
          ₹{params.value.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: "budgetSpent",
      headerName: "Spent",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="#4361ee">
          ₹{params.value.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: "budgetUtilization",
      headerName: "Utilization",
      width: 140,
      renderCell: (params) => (
        <Box width="100%" display="flex" alignItems="center">
          <Box flex={1} mr={1}>
            <Box
              bgcolor="rgba(67, 97, 238, 0.1)"
              height={8}
              borderRadius={4}
              width="100%"
            >
              <Box
                bgcolor="#4361ee"
                height="100%"
                borderRadius={4}
                width={`${params.value * 100}%`}
              />
            </Box>
          </Box>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {(params.value * 100).toFixed(1)}%
          </Typography>
        </Box>
      ),
    },
    {
      field: "clickCount",
      headerName: "Clicks",
      width: 100,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <TouchApp fontSize="small" sx={{ color: "#3498db", mr: 0.5 }} />
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "installsCount",
      headerName: "Installs",
      width: 100,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <People fontSize="small" sx={{ color: "#2ecc71", mr: 0.5 }} />
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "ctr",
      headerName: "CTR",
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="#f39c12">
          {(params.value * 100).toFixed(1)}%
        </Typography>
      ),
    },
    {
      field: "cpc",
      headerName: "CPC",
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="#e74c3c">
          ₹{params.value.toFixed(2)}
        </Typography>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          p: { xs: 2, md: 4 },
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                Advertiser Analytics Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comprehensive analytics and performance metrics
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchData}
                disabled={loading}
              >
                Refresh Data
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3, bgcolor: "rgba(0, 0, 0, 0.08)" }} />

          {/* Filters Section */}
          <Paper
            sx={{
              p: 3,
              mb: 4,
              bgcolor: "background.paper",
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <FilterList sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" color="text.primary">
                Filters
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={filters.startDate}
                    onChange={(newValue) =>
                      handleFilterChange("startDate", newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={filters.endDate}
                    onChange={(newValue) =>
                      handleFilterChange("endDate", newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    multiple
                    value={filters.status}
                    onChange={handleStatusChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={
                              value.charAt(0).toUpperCase() + value.slice(1)
                            }
                            size="small"
                            sx={{
                              backgroundColor: `${STATUS_COLORS[value]}22`,
                              color: STATUS_COLORS[value],
                              border: `1px solid ${STATUS_COLORS[value]}`,
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="paused">Paused</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Campaign Type</InputLabel>
                  <Select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    label="Campaign Type"
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="cpi">CPI</MenuItem>
                    <MenuItem value="cpc">CPC</MenuItem>
                    <MenuItem value="cpa">CPA</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Min Budget"
                  type="number"
                  value={filters.minBudget}
                  onChange={(e) =>
                    handleFilterChange("minBudget", e.target.value)
                  }
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Max Budget"
                  type="number"
                  value={filters.maxBudget}
                  onChange={(e) =>
                    handleFilterChange("maxBudget", e.target.value)
                  }
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    label="Sort By"
                  >
                    <MenuItem value="budgetUtilization">
                      Budget Utilization
                    </MenuItem>
                    <MenuItem value="totalBudget">Total Budget</MenuItem>
                    <MenuItem value="totalSpent">Total Spent</MenuItem>
                    <MenuItem value="totalClicks">Total Clicks</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort Order</InputLabel>
                  <Select
                    value={filters.sortOrder}
                    onChange={(e) =>
                      handleFilterChange("sortOrder", e.target.value)
                    }
                    label="Sort Order"
                  >
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={resetFilters}
                    startIcon={<DateRange />}
                  >
                    Reset Filters
                  </Button>
                  <Button
                    variant="contained"
                    onClick={fetchData}
                    disabled={loading}
                    startIcon={<FilterList />}
                  >
                    Apply Filters
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress
              size={60}
              thickness={4}
              sx={{ color: "#4361ee" }}
            />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, textAlign: "center", bgcolor: "error.light" }}>
            <Typography variant="h6" color="error.contrastText">
              {error}
            </Typography>
          </Paper>
        ) : data ? (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  title: "Total Budget",
                  value: `₹${data.summary.totalBudget.toLocaleString()}`,
                  icon: (
                    <MonetizationOn
                      sx={{ color: "primary.main", fontSize: 32 }}
                    />
                  ),
                  bgColor: "rgba(67, 97, 238, 0.1)",
                  subtitle: (
                    <>
                      <Box
                        component="span"
                        color="success.main"
                        fontWeight={600}
                      >
                        ₹{data.summary.totalSpent.toLocaleString()}
                      </Box>{" "}
                      spent •{" "}
                      <Box
                        component="span"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {(data.summary.budgetUtilization * 100).toFixed(1)}%
                      </Box>{" "}
                      utilization
                    </>
                  ),
                },
                {
                  title: "Campaigns",
                  value: data.summary.totalCampaigns,
                  icon: (
                    <Campaign sx={{ color: "secondary.main", fontSize: 32 }} />
                  ),
                  bgColor: "rgba(58, 12, 163, 0.1)",
                  subtitle: (
                    <>
                      <Box
                        component="span"
                        color="success.main"
                        fontWeight={600}
                      >
                        {data.summary.activeCampaigns}
                      </Box>{" "}
                      active •{" "}
                      <Box
                        component="span"
                        color="warning.main"
                        fontWeight={600}
                      >
                        {data.summary.pendingCampaigns}
                      </Box>{" "}
                      pending
                    </>
                  ),
                },
                {
                  title: "Performance",
                  value: data.summary.totalInstalls,
                  icon: (
                    <TrendingUp sx={{ color: "success.main", fontSize: 32 }} />
                  ),
                  bgColor: "rgba(46, 204, 113, 0.1)",
                  subtitle: (
                    <>
                      <Box
                        component="span"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {data.summary.totalClicks}
                      </Box>{" "}
                      clicks •{" "}
                      <Box component="span" color="info.main" fontWeight={600}>
                        {(data.summary.averageCTR * 100).toFixed(1)}%
                      </Box>{" "}
                      CTR
                    </>
                  ),
                },
                {
                  title: "Engagement",
                  value: data.summary.totalReviews,
                  icon: (
                    <RateReview sx={{ color: "warning.main", fontSize: 32 }} />
                  ),
                  bgColor: "rgba(243, 156, 18, 0.1)",
                  subtitle: (
                    <>
                      <Box
                        component="span"
                        fontWeight={600}
                        color="text.primary"
                      >
                        ₹{data.summary.averageCPC.toFixed(2)}
                      </Box>{" "}
                      avg. CPC •{" "}
                      <Box
                        component="span"
                        color="success.main"
                        fontWeight={600}
                      >
                        {data.summary.totalInstalls}
                      </Box>{" "}
                      installs
                    </>
                  ),
                },
              ].map((card, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between">
                        <Box>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            gutterBottom
                          >
                            {card.title}
                          </Typography>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            color="text.primary"
                          >
                            {card.value}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "50%",
                            bgcolor: card.bgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {card.icon}
                        </Box>
                      </Box>
                      <Box mt={2}>
                        <Typography variant="body2" color="text.secondary">
                          {card.subtitle}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Charts Section - Fixed to be equally sized */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    <Typography variant="h6" gutterBottom color="text.primary">
                      Monthly Performance
                    </Typography>
                    <Box
                      sx={{ flex: 1, minHeight: "300px", minWidth: "320px" }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={data.monthlyPerformance}
                          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorSpent"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#4361ee"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#4361ee"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorClicks"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#4cc9f0"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#4cc9f0"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <Tooltip
                            contentStyle={{
                              background: "#ffffff",
                              border: "1px solid rgba(67, 97, 238, 0.3)",
                              borderRadius: "8px",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                              color: "#2d3436",
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="totalSpent"
                            stroke="#4361ee"
                            fillOpacity={1}
                            fill="url(#colorSpent)"
                            name="Amount Spent"
                            strokeWidth={2}
                          />
                          <Area
                            type="monotone"
                            dataKey="totalClicks"
                            stroke="#4cc9f0"
                            fillOpacity={1}
                            fill="url(#colorClicks)"
                            name="Total Clicks"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    <Typography variant="h6" gutterBottom color="text.primary">
                      Campaign Types
                    </Typography>
                    <Box
                      sx={{ flex: 1, minHeight: "300px", minWidth: "320px" }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.performanceByType}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="totalSpent"
                            nameKey="type"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {data.performanceByType.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: "#ffffff",
                              border: "1px solid rgba(67, 97, 238, 0.3)",
                              borderRadius: "8px",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                              color: "#2d3436",
                            }}
                            formatter={(value) => [
                              `₹${value.toLocaleString()}`,
                              "Total Spent",
                            ]}
                          />
                          <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{ paddingLeft: "20px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                  >
                    <Typography variant="h6" gutterBottom color="text.primary">
                      Status Distribution
                    </Typography>
                    <Box
                      sx={{ flex: 1, minHeight: "300px", minWidth: "320px" }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={data.statusDistribution}
                          layout="vertical"
                          margin={{ top: 10, right: 20, left: 70, bottom: 10 }}
                        >
                          <XAxis type="number" />
                          <YAxis
                            dataKey="status"
                            type="category"
                            tick={{ fontSize: 12 }}
                            width={80}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "#ffffff",
                              border: "1px solid rgba(67, 97, 238, 0.3)",
                              borderRadius: "8px",
                              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                              color: "#2d3436",
                            }}
                            formatter={(value) => [
                              `₹${value.toLocaleString()}`,
                              "Total Budget",
                            ]}
                          />
                          <Bar
                            dataKey="totalBudget"
                            name="Total Budget"
                            barSize={20}
                          >
                            {data.statusDistribution.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  STATUS_COLORS[entry.status] ||
                                  COLORS[index % COLORS.length]
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Campaigns Data Grid */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6" gutterBottom color="text.primary">
                    Campaigns Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.campaigns.length} campaigns found
                  </Typography>
                </Box>

                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={data.campaigns}
                    columns={campaignColumns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 25]}
                    getRowId={(row) => row._id}
                    disableSelectionOnClick
                  />
                </Box>
              </CardContent>
            </Card>
          </>
        ) : null}
      </Box>
    </ThemeProvider>
  );
};

export default AdvertiserAnalyticsDashboard;

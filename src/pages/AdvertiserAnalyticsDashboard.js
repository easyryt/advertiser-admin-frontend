import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  useTheme,
  Fade,
  Grow,
  Slide,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Chip,
  Stack,
  alpha,
  Skeleton,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpward,
  ArrowDownward,
  FilterList,
  Refresh,
  Campaign,
  MonetizationOn,
  AttachMoney,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Close,
  Check,
  ArrowForward,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useParams } from "react-router-dom";




// Initial filter values
const INITIAL_FILTERS = {
  startDate: new Date("2025-07-01"),
  endDate: new Date("2025-08-31"),
  status: ["approved", "completed"],
  type: "cpi",
  minBudget: 500,
  maxBudget: 1000,
  sortOrder: "asc",
};

// ---------- UTILS ----------
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const formatPercent = (value) =>
  value !== undefined ? `${(value * 100).toFixed(1)}%` : "0.0%";

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(value ?? 0);

// --------- STATUS COLOR ---------
const useStatusColor = () => {
  const theme = useTheme();
  return (status) => {
    const map = {
      active: theme.palette.success.main,
      completed: theme.palette.info.main,
      approved: theme.palette.success.dark,
      paused: theme.palette.warning.main,
      pending: theme.palette.grey[500],
    };
    return map[(status || "").toLowerCase()] || theme.palette.primary.light;
  };
};

// ----------- FILTER DIALOG -----------
const FilterDialog = ({ open, onClose, filters, setFilters, applyFilters }) => {
  const handleStatusChange = (event) => {
    const { value } = event.target;
    // Support "All" option
    if (value.includes("all")) {
      setFilters((prev) => ({
        ...prev,
        status: ["active", "completed", "approved", "paused", "pending"],
      }));
    } else {
      setFilters((prev) => ({ ...prev, status: value }));
    }
  };

  const handleTypeChange = (event) => {
    setFilters((prev) => ({ ...prev, type: event.target.value }));
  };

  const handleSortChange = (event) => {
    setFilters((prev) => ({ ...prev, sortOrder: event.target.value }));
  };

  const handleMinBudgetChange = (event) => {
    setFilters((prev) => ({ ...prev, minBudget: Number(event.target.value) }));
  };

  const handleMaxBudgetChange = (event) => {
    setFilters((prev) => ({ ...prev, maxBudget: Number(event.target.value) }));
  };

  const handleStartDateChange = (date) => {
    setFilters((prev) => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date) => {
    setFilters((prev) => ({ ...prev, endDate: date }));
  };

  const handleApply = () => {
    applyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({ ...INITIAL_FILTERS });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6">Filter Campaigns</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={handleStartDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={handleEndDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status}
                  onChange={handleStatusChange}
                  label="Status"
                  renderValue={(selected) => selected.join(", ")}
                >
                  {[
                    "all",
                    "active",
                    "completed",
                    "approved",
                    "paused",
                    "pending",
                  ].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status === "all"
                        ? "All"
                        : status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Campaign Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={handleTypeChange}
                  label="Campaign Type"
                >
                  {["cpi", "cpa", "cpc", "cpm"].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Min Budget (₹)"
                type="number"
                value={filters.minBudget}
                onChange={handleMinBudgetChange}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Max Budget (₹)"
                type="number"
                value={filters.maxBudget}
                onChange={handleMaxBudgetChange}
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Sort Order</InputLabel>
                <Select
                  value={filters.sortOrder}
                  onChange={handleSortChange}
                  label="Sort Order"
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleReset}
          variant="outlined"
          color="secondary"
          startIcon={<Refresh />}
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          color="primary"
          startIcon={<Check />}
        >
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ------- Top Filters Bar (All Filters) -------
const TopFiltersBar = ({
  filters,
  onOpenFilter,
  onRefresh,
  activeChips = [],
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#ffffff",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          maxWidth: 1600,
          mx: "auto",
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6" fontWeight={800} sx={{ mr: 2 }}>
          Dashboard
        </Typography>
        {activeChips.map((chip, i) => (
          <Chip
            key={i}
            label={chip}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.light, 0.18),
              color: theme.palette.primary.dark,
              fontWeight: 600,
            }}
          />
        ))}
        <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterList />}
            onClick={onOpenFilter}
          >
            All Filters
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Refresh />}
            onClick={onRefresh}
          >
            Refresh
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// ------- Reusable Header for cards -------
const Header = ({ title, onFilter, onRefresh }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
    <Typography variant="h6" fontWeight={700} color="text.primary">
      {title}
    </Typography>
    <Box display="flex" gap={1}>
      <Tooltip title="Filter">
        <IconButton
          size="small"
          sx={{
            bgcolor: "#f1f5fe",
            borderRadius: 2,
            "&:hover": { bgcolor: "#e6edfe" },
          }}
          onClick={onFilter}
        >
          <FilterList fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Refresh data">
        <IconButton
          size="small"
          sx={{
            bgcolor: "#f1f5fe",
            borderRadius: 2,
            "&:hover": { bgcolor: "#e6edfe" },
          }}
          onClick={onRefresh}
        >
          <Refresh fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>
);

// ------- SUMMARY CARD -----------
const SummaryCard = ({ title, value, icon, color, trend }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    whileHover={{ y: -4, boxShadow: "0 8px 24px 1px rgba(92,65,184,.13)" }}
    transition={{ type: "spring", stiffness: 300, damping: 22 }}
  >
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        p: 3,
        background: "linear-gradient(to bottom right, #ffffff, #f9faff)",
        border: "1px solid rgba(224, 230, 255, 0.7)",
        boxShadow:
          "0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)",
        height: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontWeight={600}
          >
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={900} mt={0.5}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: alpha(color, 0.1),
            color,
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            boxShadow: `0 8px 19px 0 ${alpha(color, 0.17)}`,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box display="flex" alignItems="center" mt={1}>
        {trend >= 0 ? (
          <ArrowUpward
            fontSize="small"
            sx={{ color: trend === 0 ? "text.secondary" : "success.main" }}
          />
        ) : (
          <ArrowDownward fontSize="small" sx={{ color: "error.main" }} />
        )}
        <Typography
          variant="body2"
          ml={0.5}
          sx={{
            color:
              trend === 0
                ? "text.secondary"
                : trend > 0
                ? "success.main"
                : "error.main",
            fontWeight: 700,
          }}
        >
          {trend === 0 ? "0.0%" : `${Math.abs(trend).toFixed(1)}%`}
        </Typography>
        <Typography
          variant="caption"
          ml={1}
          color="text.secondary"
          fontWeight={600}
        >
          from last month
        </Typography>
      </Box>
    </Card>
  </motion.div>
);

// ------- STATUS CARD -----------
const StatusCard = ({ status, count, color, icon }) => (
  <motion.div
    initial={{ scale: 0.98, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{
      scale: 1.06,
      boxShadow: "0 5px 32px -7px " + alpha(color, 0.24),
    }}
    transition={{ type: "spring", stiffness: 200, damping: 30 }}
  >
    <Card
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 4,
        background: "linear-gradient(to bottom right, #ffffff, #f9faff)",
        border: "1px solid rgba(224, 230, 255, 0.7)",
        boxShadow:
          "0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)",
        minHeight: 92,
        height: "100%",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2" fontWeight={800}>
          {status} Campaigns
        </Typography>
        <Box
          sx={{
            bgcolor: alpha(color, 0.13),
            color,
            borderRadius: "50%",
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box display="flex" alignItems="flex-end" mt={1}>
        <Typography variant="h4" fontWeight={800} sx={{ color }}>
          {count}
        </Typography>
      </Box>
    </Card>
  </motion.div>
);

// ------- METRIC CARD -----------
const MetricCard = ({ title, value, icon, trend, color }) => (
  <motion.div
    initial={{ y: 14, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 240, damping: 18 }}
  >
    <Card
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 4,
        minHeight: 89,
        background: "linear-gradient(to bottom right, #ffffff, #f9faff)",
        border: "1px solid rgba(224, 230, 255, 0.7)",
        boxShadow:
          "0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)",
        height: "100%",
      }}
    >
      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
        {title}
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
      >
        <Typography variant="h4" fontWeight={800}>
          {value}
        </Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body2" fontWeight={700} sx={{ color }}>
            {trend}
          </Typography>
          <Box ml={1} sx={{ color }}>
            {icon}
          </Box>
        </Box>
      </Box>
    </Card>
  </motion.div>
);

// ----------- MAIN DASHBOARD -----------
const AdvertiserAnalyticsDashboard= () => {
  const theme = useTheme();
  const getStatusColor = useStatusColor();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState(null);
  const [tempFilters, setTempFilters] = useState({ ...INITIAL_FILTERS });
  const {advertiserId} = useParams()

  useEffect(() => {
    fetchData();
  }, []);

  const applyFilters = (filters) => {
    setAppliedFilters(filters);
    fetchData(filters);
  };

  const fetchData = async (filters = null) => {
    try {
      setLoading(true);
      setError(null);

      let params = {};

      if (filters) {
        params = {
          startDate: filters.startDate?.toISOString?.().split("T")[0],
          endDate: filters.endDate?.toISOString?.().split("T")[0],
          "status[]": filters.status,
          type: filters.type,
          minBudget: filters.minBudget,
          maxBudget: filters.maxBudget,
          sortOrder: filters.sortOrder,
        };
      }

      const response = await axios.get(`https://advertiserappnew.onrender.com/admin/analytics/adv/analytics/${advertiserId}`, {
        params,
        withCredentials: true,
      });

      if (response.data && response.data.status) {
        setDashboardData(response.data);
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard data");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFilterDialog = () => {
    setTempFilters(appliedFilters || { ...INITIAL_FILTERS });
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  const getActiveFilters = () => {
    if (!appliedFilters) return [];
    return [
      `Date: ${appliedFilters.startDate?.toLocaleDateString?.() || ""} - ${
        appliedFilters.endDate?.toLocaleDateString?.() || ""
      }`,
      `Status: ${appliedFilters.status.join(", ")}`,
      `Type: ${appliedFilters.type.toUpperCase()}`,
      `Budget: ₹${appliedFilters.minBudget} - ₹${appliedFilters.maxBudget}`,
    ];
  };

  // Shared SX for flawless chart sizing
  const chartCardSX = {
    p: 3,
    borderRadius: 4,
    minHeight: 420,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    background: "linear-gradient(to bottom right, #ffffff, #f9faff)",
    border: "1px solid rgba(224, 230, 255, 0.7)",
    boxShadow:
      "0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)",
  };

  const chartContainerSX = {
    flex: 1,
    width: "100%",
    minHeight: 300,
    mt: 1,
    pb: 1,
    overflow: "hidden",
  };

  const tableCardSX = {
    p: 3,
    borderRadius: 4,
    background: "linear-gradient(to bottom right, #ffffff, #f9faff)",
    border: "1px solid rgba(224, 230, 255, 0.7)",
    boxShadow:
      "0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)",
  };

  if (loading)
    return (
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        bgcolor="#f8fafd"
      >
        <TopFiltersBar
          filters={appliedFilters || INITIAL_FILTERS}
          onOpenFilter={handleOpenFilterDialog}
          onRefresh={() => fetchData(appliedFilters)}
        />
        <Box sx={{ p: 3, maxWidth: 1600, margin: "0 auto", width: "100%" }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Skeleton variant="rounded" width="100%" height={140} />
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={3} mt={0}>
            <Grid item xs={12} md={8}>
              <Skeleton
                variant="rounded"
                width="100%"
                height={420}
                sx={{ mt: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton
                variant="rounded"
                width="100%"
                height={420}
                sx={{ mt: 3 }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12} md={8}>
              <Skeleton
                variant="rounded"
                width="100%"
                height={360}
                sx={{ mt: 3 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton
                variant="rounded"
                width="100%"
                height={360}
                sx={{ mt: 3 }}
              />
            </Grid>
          </Grid>
          <Skeleton
            variant="rounded"
            width="100%"
            height={480}
            sx={{ mt: 3 }}
          />
        </Box>
      </Box>
    );

  if (error) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        bgcolor="#f8fafd"
      >
        <TopFiltersBar
          filters={appliedFilters || INITIAL_FILTERS}
          onOpenFilter={handleOpenFilterDialog}
          onRefresh={() => fetchData(appliedFilters)}
        />
        <Box
          minHeight="60vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Alert severity="error" sx={{ width: "100%", maxWidth: 500 }}>
            <Typography variant="h6" fontWeight={700}>
              Data Loading Error
            </Typography>
            <Typography>{error}</Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Refresh />}
                onClick={() => fetchData(appliedFilters)}
              >
                Try Again
              </Button>
            </Box>
          </Alert>
        </Box>
      </Box>
    );
  }

  if (!dashboardData || !dashboardData.data) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        bgcolor="#f8fafd"
      >
        <TopFiltersBar
          filters={appliedFilters || INITIAL_FILTERS}
          onOpenFilter={handleOpenFilterDialog}
          onRefresh={() => fetchData(appliedFilters)}
        />
        <Box
          minHeight="60vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" color="textSecondary">
            No data available
          </Typography>
        </Box>
      </Box>
    );
  }

  const {
    summary,
    campaigns,
    performanceByType,
    monthlyPerformance,
    statusDistribution,
  } = dashboardData.data;

  const statusData = (statusDistribution || []).map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    color: getStatusColor(item.status),
  }));

  const activeFilters = getActiveFilters();

  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
  };

  // Add short date formatter
const formatShortDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? String(value)
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      bgcolor="#f8fafd"
    >
      {/* Global Top Filters Bar */}
      <TopFiltersBar
        filters={appliedFilters || INITIAL_FILTERS}
        onOpenFilter={handleOpenFilterDialog}
        onRefresh={() => fetchData(appliedFilters)}
        activeChips={activeFilters}
      />

      {/* Filter Dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={handleCloseFilterDialog}
        filters={tempFilters}
        setFilters={setTempFilters}
        applyFilters={applyFilters}
      />

      {/* Main Content */}
      <Box sx={{ p: 3, maxWidth: 1600, margin: "0 auto", width: "100%" }}>
        {/* Summary Grid */}
        <Fade in>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Total Campaigns"
                value={summary.totalCampaigns}
                icon={<Campaign />}
                color={theme.palette.primary.main}
                trend={+2}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Total Budget"
                value={formatCurrency(summary.totalBudget)}
                icon={<MonetizationOn />}
                color={theme.palette.success.main}
                trend={0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Total Spent"
                value={formatCurrency(summary.totalSpent)}
                icon={<AttachMoney />}
                color={theme.palette.warning.main}
                trend={8.5}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryCard
                title="Budget Utilization"
                value={formatPercent(summary.budgetUtilization)}
                icon={<PieChartIcon />}
                color={theme.palette.info.main}
                trend={-2.1}
              />
            </Grid>
          </Grid>
        </Fade>

        {/* Charts Section with CSS Grid 1fr 1fr */}
        <Box
          sx={{
            mt: 3,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 5,
          }}
        >
          {/* Monthly Performance - Wide and Not Cropped */}
          <Paper elevation={0} sx={chartCardSX}>
            <Header
              title="Monthly Performance"
              onFilter={handleOpenFilterDialog}
              onRefresh={() => fetchData(appliedFilters)}
            />
            <Box sx={chartContainerSX}>
              <ResponsiveContainer width="100%" height={360}>
                <ComposedChart
                  data={monthlyPerformance}
                  margin={{ top: 16, right: 28, left: 16, bottom: 24 }}
                >
                  <defs>
                    <linearGradient id="premBarA" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="75%"
                        stopColor={theme.palette.primary.light}
                        stopOpacity={0.18}
                      />
                    </linearGradient>
                    <linearGradient id="premBarS" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#39BF7D"
                        stopOpacity={0.94}
                      />
                      <stop
                        offset="100%"
                        stopColor="#C3EEC6"
                        stopOpacity={0.08}
                      />
                    </linearGradient>
                    <linearGradient id="premBarC" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffb62a" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#FFF5CA"
                        stopOpacity={0.06}
                      />
                    </linearGradient>
                    <filter
                      id="shadow-premium"
                      x="-40%"
                      y="-20%"
                      width="180%"
                      height="170%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="8"
                        stdDeviation="10"
                        floodColor="#003A7B"
                        floodOpacity="0.07"
                      />
                    </filter>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={alpha(theme.palette.divider, 0.4)}
                  />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(m) =>
                      m && m.includes?.("-") ? `M${m.split("-")[1]}` : m
                    }
                    style={{ fontWeight: 600, fontSize: "0.9rem" }}
                    dy={8}
                    interval="preserveStartEnd"
                  />
                  <YAxis style={{ fontWeight: 600 }} />
                  <ChartTooltip
                    formatter={formatNumber}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      minWidth: 58,
                      boxShadow: theme.shadows[4],
                      background: theme.palette.background.paper,
                      fontWeight: 600,
                    }}
                  />
                  <Legend verticalAlign="top" height={28} />
                  <Bar
                    dataKey="totalSpent"
                    name="Spent"
                    fill="url(#premBarA)"
                    barSize={34}
                    radius={[6, 6, 0, 0]}
                    style={{ filter: "url(#shadow-premium)" }}
                  />
                  <Bar
                    dataKey="totalInstalls"
                    name="Installs"
                    fill="url(#premBarS)"
                    barSize={34}
                    radius={[6, 6, 0, 0]}
                    style={{ filter: "url(#shadow-premium)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalClicks"
                    name="Clicks"
                    stroke="#FFA726"
                    fill="url(#premBarC)"
                    strokeWidth={3}
                    dot={{ r: 4, fill: theme.palette.warning.main }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Status Distribution - Wide and Not Cropped */}
          <Paper elevation={0} sx={chartCardSX}>
            <Header
              title="Status Distribution"
              onFilter={handleOpenFilterDialog}
              onRefresh={() => fetchData(appliedFilters)}
            />
            <Box sx={chartContainerSX}>
              <ResponsiveContainer width="100%" height={360}>
                <PieChart>
                  <defs>
                    <filter
                      id="pie-glow"
                      x="0"
                      y="0"
                      width="200%"
                      height="200%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="0"
                        stdDeviation="7"
                        floodColor="#4f57ef"
                        floodOpacity="0.13"
                      />
                    </filter>
                  </defs>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={64}
                    outerRadius={110}
                    labelLine={false}
                    stroke="#fff"
                    strokeWidth={3}
                    dataKey="value"
                    isAnimationActive
                    animationDuration={1100}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    style={{ filter: "url(#pie-glow)" }}
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    formatter={(v) => [`${v} campaigns`]}
                    contentStyle={{
                      borderRadius: 10,
                      border: "none",
                      fontWeight: 600,
                      background: "#fafcff",
                      boxShadow: theme.shadows[2],
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Lower charts with 1fr 1fr */}
        <Box
          sx={{
            mt: 3,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 5,
          }}
        >
          {/* Campaign Performance & Metrics */}
          <Paper elevation={0} sx={{ ...chartCardSX, minHeight: 420 }}>
            <Box mb={1}>
              <Typography
                variant="h6"
                fontWeight={800}
                display="flex"
                alignItems="center"
                letterSpacing="-0.5px"
              >
                <BarChartIcon
                  fontSize="inherit"
                  sx={{ mr: 1, verticalAlign: "middle" }}
                />
                Campaign Performance
              </Typography>
            </Box>
            <Grid container spacing={2} mb={2}>
              {[
                { label: "Active", value: summary.activeCampaigns },
                { label: "Completed", value: summary.completedCampaigns },
                { label: "Paused", value: summary.pausedCampaigns },
                { label: "Pending", value: summary.pendingCampaigns },
              ].map((item) => (
                <Grid item xs={6} sm={3} key={item.label}>
                  <StatusCard
                    status={item.label}
                    count={item.value}
                    color={getStatusColor(item.label)}
                    icon={item.value >= 0 ? <ArrowUpward /> : <ArrowDownward />}
                  />
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Total Installs"
                  value={formatNumber(summary.totalInstalls)}
                  icon={<ArrowUpward fontSize="small" />}
                  trend="+12%"
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Average CTR"
                  value={formatPercent(summary.averageCTR)}
                  icon={<ArrowUpward fontSize="small" />}
                  trend="+2.3%"
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <MetricCard
                  title="Average CPC"
                  value={formatCurrency(summary.averageCPC)}
                  icon={<ArrowDownward fontSize="small" />}
                  trend="-0.5%"
                  color={theme.palette.error.main}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Performance by Type */}
          <Paper elevation={0} sx={chartCardSX}>
            <Box mb={1}>
              <Typography
                variant="h6"
                fontWeight={800}
                display="flex"
                alignItems="center"
                letterSpacing="-0.5px"
              >
                <PieChartIcon
                  fontSize="inherit"
                  sx={{ mr: 1, verticalAlign: "middle" }}
                />
                Performance by Type
              </Typography>
            </Box>
            <Box sx={chartContainerSX}>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart
                  data={performanceByType}
                  margin={{ top: 10, right: 24, left: 16, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="pbtBudget" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0.7}
                      />
                      <stop
                        offset="95%"
                        stopColor={theme.palette.primary.main}
                        stopOpacity={0.16}
                      />
                    </linearGradient>
                    <linearGradient id="pbtSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={theme.palette.success.light}
                        stopOpacity={0.75}
                      />
                      <stop
                        offset="95%"
                        stopColor={theme.palette.success.light}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={alpha(theme.palette.divider, 0.4)}
                  />
                  <XAxis dataKey="type" style={{ fontWeight: 700 }} />
                  <YAxis style={{ fontWeight: 700 }} />
                  <ChartTooltip
                    formatter={formatNumber}
                    contentStyle={{
                      borderRadius: 8,
                      border: "none",
                      boxShadow: theme.shadows[4],
                      background: theme.palette.background.paper,
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="totalBudget"
                    name="Total Budget"
                    stroke={theme.palette.primary.main}
                    fill="url(#pbtBudget)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalSpent"
                    name="Total Spent"
                    stroke={theme.palette.success.main}
                    fill="url(#pbtSpent)"
                    strokeWidth={3}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Table: Campaigns (Full Width) */}
        <Grow in timeout={800}>
          <Box mt={4}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography
                variant="h6"
                fontWeight={900}
                display="flex"
                alignItems="center"
              >
                Campaign Details
              </Typography>
              <Box display="flex" gap={1}>
                <Tooltip title="Refresh">
                  <IconButton onClick={() => fetchData(appliedFilters)}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Filter">
                  <IconButton onClick={handleOpenFilterDialog}>
                    <FilterList />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {/* Premium Table Container */}
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                background:
                  "linear-gradient(to bottom right, #ffffff, #f9faff)",
                border: "1px solid rgba(224, 230, 255, 0.7)",
                boxShadow:
                  "0 12px 40px -10px rgba(101, 116, 255, 0.08), 0 1.5px 10px -3px rgba(0,0,0,0.03)",
              }}
            >
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f8ff" }}>
                      <TableCell
                        sx={{ fontWeight: 800, color: "text.secondary", py: 2 }}
                      >
                        App
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 800, color: "text.secondary", py: 2 }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 800, color: "text.secondary", py: 2 }}
                      >
                        Type
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 800, color: "text.secondary", py: 2 }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 800, color: "text.secondary", py: 2 }}
                      >
                        Budget
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 800, color: "text.secondary", py: 2 }}
                      >
                        Performance
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 800, color: "text.secondary", py: 2 }}
                      >
                        Metrics
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ fontWeight: 800, color: "text.secondary", py: 2 }}
                      >
                        Timeline
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(campaigns || []).map((campaign) => {
                      const util =
                        campaign?.budgetUtilization ??
                        (campaign?.budgetTotal
                          ? (campaign?.budgetSpent || 0) / campaign.budgetTotal
                          : 0);

                      return (
                        <TableRow
                          key={campaign._id || Math.random()}
                          hover
                          sx={{
                            "&:last-child td": { border: 0 },
                            transition: "background-color 0.2s",
                            "&:hover": { bgcolor: "#f9faff" },
                          }}
                        >
                          {/* App Logo */}
                          <TableCell sx={{ py: 2 }}>
                            <Box display="flex" alignItems="center">
                              <Avatar
                                src={campaign?.appLogo?.url || ""}
                                sx={{
                                  bgcolor: getStatusColor(campaign?.status),
                                  width: 42,
                                  height: 42,
                                  fontWeight: 700,
                                  mr: 2,
                                  fontSize: 20,
                                  boxShadow:
                                    "0 3px 10px rgba(101, 116, 255, 0.15)",
                                }}
                              >
                                {campaign?.name?.charAt?.(0)?.toUpperCase?.() ||
                                  "A"}
                              </Avatar>
                            </Box>
                          </TableCell>

                          {/* Campaign Name */}
                          <TableCell sx={{ py: 2 }}>
                            <Typography fontWeight={700} sx={{ mb: 0.5 }}>
                              {campaign?.name || "—"}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {campaign?.packageName?.split?.("/")?.pop?.() ||
                                "—"}
                            </Typography>
                          </TableCell>

                          {/* Campaign Type */}
                          <TableCell align="center" sx={{ py: 2 }}>
                            <Chip
                              label={(campaign?.type || "—")
                                .toString()
                                .toUpperCase()}
                              size="small"
                              sx={{
                                bgcolor:
                                  theme.palette.type === "light"
                                    ? alpha(theme.palette.primary.light, 0.2)
                                    : alpha(theme.palette.primary.dark, 0.3),
                                color: theme.palette.primary.dark,
                                fontWeight: 700,
                                px: 1,
                                borderRadius: 1,
                              }}
                            />
                          </TableCell>

                          {/* Status */}
                          <TableCell align="center" sx={{ py: 2 }}>
                            <Chip
                              label={campaign?.status || "—"}
                              size="small"
                              sx={{
                                bgcolor: alpha(
                                  getStatusColor(campaign?.status),
                                  0.15
                                ),
                                color: getStatusColor(campaign?.status),
                                fontWeight: 700,
                                px: 1,
                                borderRadius: 1,
                                textTransform: "capitalize",
                              }}
                            />
                          </TableCell>

                          {/* Budget */}
                          <TableCell align="center" sx={{ py: 2 }}>
                            <Stack spacing={1} alignItems="center">
                              <Box textAlign="center">
                                <Typography variant="body2" fontWeight={600}>
                                  {formatCurrency(campaign?.budgetTotal || 0)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Total
                                </Typography>
                              </Box>

                              <Box textAlign="center">
                                <Typography variant="body2" fontWeight={600}>
                                  {formatCurrency(campaign?.budgetSpent || 0)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Spent
                                </Typography>
                              </Box>

                              <Box width="100%" maxWidth={120} mt={1}>
                                <LinearProgress
                                  variant="determinate"
                                  value={(util || 0) * 100}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: theme.palette.grey[200],
                                    "& .MuiLinearProgress-bar": {
                                      borderRadius: 4,
                                      bgcolor:
                                        util > 0.7
                                          ? theme.palette.error.main
                                          : util > 0.4
                                          ? theme.palette.warning.main
                                          : theme.palette.success.main,
                                    },
                                  }}
                                />
                                <Typography variant="caption" fontWeight={600}>
                                  {formatPercent(util || 0)}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>

                          {/* Performance */}
                          <TableCell align="center" sx={{ py: 2 }}>
                            <Grid container spacing={1}>
                              <Grid item xs={4}>
                                <Box textAlign="center">
                                  <Typography variant="body2" fontWeight={700}>
                                    {formatNumber(campaign?.installsCount || 0)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Installs
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Box textAlign="center">
                                  <Typography variant="body2" fontWeight={700}>
                                    {formatNumber(campaign?.reviewCount || 0)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Reviews
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={4}>
                                <Box textAlign="center">
                                  <Typography variant="body2" fontWeight={700}>
                                    {formatNumber(campaign?.clickCount || 0)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Clicks
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </TableCell>

                          {/* Metrics */}
                          <TableCell align="center" sx={{ py: 2 }}>
                            <Stack spacing={1} alignItems="center">
                              <Box>
                                <Typography variant="body2" fontWeight={700}>
                                  {formatPercent(campaign?.ctr || 0)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  CTR
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={700}>
                                  {campaign?.cpc !== undefined &&
                                  campaign?.cpc !== null
                                    ? formatCurrency(campaign.cpc)
                                    : "—"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  CPC
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>

                          {/* Timeline */}
                          <TableCell align="center" sx={{ py: 2 }}>
                            <Stack spacing={0.5} alignItems="center">
                              <Tooltip
                                title={`Created: ${formatDate(
                                  campaign?.createdAt
                                )}`}
                              >
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Created
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {formatShortDate(campaign?.createdAt)}
                                  </Typography>
                                </Box>
                              </Tooltip>

                              <Box display="flex" alignItems="center">
                                <Typography variant="body2" fontWeight={600}>
                                  {formatShortDate(campaign?.startDate)}
                                </Typography>
                                <ArrowForward
                                  fontSize="small"
                                  sx={{ mx: 0.5, color: "text.secondary" }}
                                />
                                <Typography variant="body2" fontWeight={600}>
                                  {formatShortDate(campaign?.endDate)}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Empty State */}
              {(!campaigns || campaigns.length === 0) && (
                <Box py={6} textAlign="center">
                  <Campaign
                    sx={{ fontSize: 64, color: "text.disabled", mb: 1 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    No campaigns found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Try adjusting your filters or create a new campaign
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Grow>
      </Box>
    </Box>
  );
};

export default AdvertiserAnalyticsDashboard;

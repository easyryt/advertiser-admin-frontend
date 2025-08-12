import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import axios from "axios";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/Launch";
import { styled, alpha } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";

// Premium styled components with light blue theme
const PremiumPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(0, 87, 178, 0.1)",
  overflow: "hidden",
  border: "1px solid rgba(208, 222, 255, 0.7)",
  background: "linear-gradient(145deg, #ffffff, #f8fbff)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 12px 40px rgba(0, 87, 178, 0.15)",
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  minWidth: 90,
  textTransform: "capitalize",
  borderRadius: "6px",
  backgroundColor:
    status === "approved"
      ? "rgba(76, 175, 80, 0.12)"
      : status === "pending"
      ? "rgba(255, 152, 0, 0.12)"
      : status === "paused"
      ? "rgba(156, 39, 176, 0.12)"
      : "rgba(33, 150, 243, 0.12)",
  color:
    status === "approved"
      ? "#2e7d32"
      : status === "pending"
      ? "#ef6c00"
      : status === "paused"
      ? "#7b1fa2"
      : "#1565c0",
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}));

const HeaderBar = styled("div")({
  background: "linear-gradient(135deg, #e6f0ff 0%, #c2dcff 100%)",
  color: "#0d47a1",
  padding: "18px 32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopLeftRadius: "12px",
  borderTopRightRadius: "12px",
  boxShadow: "0 2px 10px rgba(25, 118, 210, 0.1)",
});

// Custom Toolbar with premium styling
function CustomToolbar({ onRefresh }) {
  return (
    <GridToolbarContainer
      sx={{
        justifyContent: "space-between",
        p: 1.5,
        bgcolor: "#f5f9ff",
        borderBottom: "1px solid rgba(208, 222, 255, 0.5)",
      }}
    >
      <Button
        onClick={onRefresh}
        startIcon={<RefreshIcon sx={{ color: "#1976d2" }} />}
        variant="text"
        size="small"
        sx={{
          color: "#1565c0",
          fontWeight: 600,
          borderRadius: "8px",
          px: 2,
          py: 1,
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
          },
        }}
      >
        Refresh Data
      </Button>
      <Box display="flex" gap={1}>
        <GridToolbarColumnsButton
          sx={{
            color: "#1976d2",
            "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" },
          }}
        />
        <GridToolbarFilterButton
          sx={{
            color: "#1976d2",
            "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" },
          }}
        />
        <GridToolbarDensitySelector
          sx={{
            color: "#1976d2",
            "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" },
          }}
        />
        <GridToolbarExport
          sx={{
            color: "#1976d2",
            "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.08)" },
          }}
          printOptions={{ disableToolbarButton: true }}
          csvOptions={{
            fileName: "campaigns-list",
            delimiter: ";",
            utf8WithBom: true,
          }}
        />
      </Box>
    </GridToolbarContainer>
  );
}

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "https://advertiserappnew.onrender.com/admin/campaign/getAll",
        {
          withCredentials: true,
          params: {
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
          },
        }
      );

      if (response?.data?.status && Array.isArray(response?.data?.campaigns)) {
        setCampaigns(response.data.campaigns || []);
        setTotalRows(response?.data?.total || 0);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch campaigns"
      );
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [paginationModel]);

  const handleStatusChange = async (campaignId, newStatus) => {
    const originalCampaigns = [...campaigns];
    try {
      setUpdatingStatus((prev) => ({ ...prev, [campaignId]: true }));
      setCampaigns((prev) =>
        prev.map((camp) =>
          camp?._id === campaignId ? { ...camp, status: newStatus } : camp
        )
      );

      await axios.patch(
        `https://advertiserappnew.onrender.com/admin/campaign/status/update/${campaignId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      setSnackbar({
        children: `Status updated to ${newStatus} successfully!`,
        severity: "success",
      });
    } catch (error) {
      setCampaigns(originalCampaigns);
      setSnackbar({
        children:
          "Failed to update status: " +
          (error.response?.data?.message || error.message),
        severity: "error",
      });
      console.error("Update error:", error);
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [campaignId]: false }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRowClick = (params) => {
    setSelectedCampaign(params.row);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedCampaign(null);
  };

  const columns = [
    {
      field: "name",
      headerName: "Campaign Name",
      minWidth: 250,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: "#e3f2fd",
              color: "#1565c0",
              fontWeight: 600,
              width: 40,
              height: 40,
              fontSize: "1rem",
              boxShadow: "0 2px 6px rgba(25, 118, 210, 0.2)",
            }}
          >
            {params.row.name?.charAt(0) || "C"}
          </Avatar>
          <Tooltip title={params.row.name || "N/A"} placement="top">
            <Typography variant="body1" fontWeight="600" noWrap>
              {params.row.name || "N/A"}
            </Typography>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: "advertiser",
      headerName: "Advertiser",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="subtitle2" fontWeight="600" color="#0d47a1">
            {params.row.advertiser?.name || "Unknown"}
          </Typography>
          <Typography variant="caption" color="#546e7a">
            {params.row.advertiser?.phone || "No phone"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        const currentStatus = params.row.status || "pending";
        const campaignId = params.row._id;

        return (
          <Select
            value={currentStatus}
            onChange={(e) => handleStatusChange(campaignId, e.target.value)}
            size="small"
            disabled={updatingStatus[campaignId]}
            sx={{
              width: "100%",
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                py: 0.5,
                pr: "32px !important",
              },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  borderRadius: "8px",
                  boxShadow: "0 8px 24px rgba(33, 150, 243, 0.15)",
                  marginTop: "4px",
                  border: "1px solid rgba(208, 222, 255, 0.7)",
                },
              },
            }}
          >
            {["pending", "approved", "paused", "completed"].map((status) => (
              <MenuItem key={status} value={status} sx={{ py: 1 }}>
                {updatingStatus[campaignId] && status === currentStatus ? (
                  <CircularProgress size={20} sx={{ mr: 1.5, color: "#1976d2" }} />
                ) : (
                  <StatusChip
                    label={status.charAt(0).toUpperCase() + status.slice(1)}
                    status={status}
                    size="small"
                  />
                )}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "type",
      headerName: "Type",
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row.type?.toUpperCase() || "N/A"}
          sx={{
            fontWeight: 600,
            bgcolor: "#e3f2fd",
            color: "#1976d2",
            px: 1.5,
            py: 0.5,
            borderRadius: "6px",
            boxShadow: "0 2px 4px rgba(25, 118, 210, 0.1)",
          }}
        />
      ),
    },
    {
      field: "wallet",
      headerName: "Wallet Balance",
      minWidth: 150,
      align: "right",
      headerAlign: "right",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="600" color="#2e7d32">
          ₹{params.row.advertiser?.wallet?.toFixed(2) || "0.00"}
        </Typography>
      ),
    },
    {
      field: "dates",
      headerName: "Duration",
      minWidth: 220,
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="caption" display="block" color="#546e7a">
            <strong>Start:</strong> {formatDate(params.row.startDate)}
          </Typography>
          <Typography variant="caption" display="block" color="#546e7a">
            <strong>End:</strong> {formatDate(params.row.endDate)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "packageName",
      headerName: "App Link",
      minWidth: 300,
      flex: 1,
      renderCell: (params) => {
        const link = params.row.packageName;
        return link ? (
          <Tooltip title={link} placement="top">
            <Button
              component="a"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<LaunchIcon fontSize="small" />}
              sx={{
                textTransform: "none",
                textDecoration: "none",
                color: "#1565c0",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
                justifyContent: "flex-start",
                borderRadius: "6px",
                px: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(33, 150, 243, 0.08)",
                },
              }}
            >
              View App
            </Button>
          </Tooltip>
        ) : (
          <Typography variant="body2" color="#b0bec5">
            No link provided
          </Typography>
        );
      },
    },
  ];

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
          textAlign: "center",
          p: 3,
        }}
      >
        <Fade in={true} timeout={500}>
          <Box>
            <Typography
              variant="h6"
              color="#d32f2f"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Error Loading Campaigns
            </Typography>
            <Typography
              variant="body1"
              color="#546e7a"
              sx={{ mb: 3, maxWidth: 500 }}
            >
              {error}
            </Typography>
            <Button
              onClick={fetchCampaigns}
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              sx={{
                borderRadius: "8px",
                px: 4,
                py: 1,
                fontWeight: 600,
                background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                },
              }}
            >
              Retry
            </Button>
          </Box>
        </Fade>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <HeaderBar>
        <Typography variant="h6" fontWeight="700">
          Campaign Management Dashboard
        </Typography>
        <Box>
          <Button
            onClick={fetchCampaigns}
            variant="outlined"
            color="inherit"
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: "rgba(25, 118, 210, 0.3)",
              color: "#0d47a1",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                borderColor: "rgba(25, 118, 210, 0.5)",
                backgroundColor: "rgba(25, 118, 210, 0.08)",
              },
            }}
          >
            Refresh Data
          </Button>
        </Box>
      </HeaderBar>

      <PremiumPaper sx={{ flex: 1, mt: 2 }}>
        <DataGrid
          rows={campaigns}
          columns={columns}
          getRowId={(row) => row._id || Math.random().toString(36)}
          rowCount={totalRows}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25]}
          onRowClick={handleRowClick}
          loading={loading}
          slots={{
            toolbar: () => <CustomToolbar onRefresh={fetchCampaigns} />,
            loadingOverlay: LinearProgress,
            noRowsOverlay: () => (
              <Box
                sx={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography
                  variant="body1"
                  color="#78909c"
                  fontWeight="500"
                >
                  No campaigns found
                </Typography>
                <Typography variant="body2" color="#b0bec5">
                  Create a new campaign or adjust your filters
                </Typography>
              </Box>
            ),
          }}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              fontSize: "0.875rem",
              fontFamily: "inherit",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#edf4ff",
              fontWeight: "700",
              color: "#0d47a1",
              fontSize: "0.9rem",
              borderBottom: "1px solid rgba(208, 222, 255, 0.7)",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid rgba(208, 222, 255, 0.5)",
              cursor: "pointer",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "rgba(179, 208, 255, 0.1) !important",
              },
              "&:nth-of-type(even)": {
                backgroundColor: "#f8fbff",
                "&:hover": {
                  backgroundColor: "rgba(179, 208, 255, 0.15) !important",
                },
              },
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "white",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#edf4ff",
              borderTop: "1px solid rgba(208, 222, 255, 0.7)",
            },
            "& .MuiDataGrid-toolbarContainer": {
              borderBottom: "1px solid rgba(208, 222, 255, 0.7)",
            },
          }}
        />
      </PremiumPaper>

      {/* Campaign Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            background: "linear-gradient(145deg, #ffffff, #f8fbff)",
            boxShadow: "0 12px 40px rgba(0, 87, 178, 0.2)",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#edf4ff",
            borderBottom: "1px solid rgba(208, 222, 255, 0.7)",
            py: 2,
            px: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#0d47a1">
            Campaign Details
          </Typography>
          <IconButton 
            onClick={handleCloseDetailDialog}
            sx={{
              color: "#1976d2",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
         <br/>
        <DialogContent sx={{ py: 3, px: 3 }}>
          {selectedCampaign && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#1565c0",
                    width: 60,
                    height: 60,
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    boxShadow: "0 4px 8px rgba(25, 118, 210, 0.2)",
                  }}
                >
                  {selectedCampaign.name?.charAt(0) || "C"}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700} color="#0d47a1">
                    {selectedCampaign.name}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2, borderColor: "rgba(208, 222, 255, 0.7)" }} />

              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                gap={3}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="#546e7a"
                    mb={1}
                    sx={{ letterSpacing: "0.5px" }}
                  >
                    ADVERTISER INFORMATION
                  </Typography>
                  <Box sx={{ pl: 1 }}>
                    <Typography variant="body1" mb={1.5}>
                      <strong style={{ color: "#0d47a1" }}>Name:</strong>{" "}
                      <span style={{ color: "#37474f" }}>
                        {selectedCampaign.advertiser?.name || "N/A"}
                      </span>
                    </Typography>
                    <Typography variant="body1" mb={1.5}>
                      <strong style={{ color: "#0d47a1" }}>Phone:</strong>{" "}
                      <span style={{ color: "#37474f" }}>
                        {selectedCampaign.advertiser?.phone || "N/A"}
                      </span>
                    </Typography>
                    <Typography variant="body1" mb={0.5}>
                      <strong style={{ color: "#0d47a1" }}>Wallet Balance:</strong>{" "}
                      <span style={{ color: "#2e7d32", fontWeight: 600 }}>
                        ₹{selectedCampaign.advertiser?.wallet?.toFixed(2) || "0.00"}
                      </span>
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="#546e7a"
                    mb={1}
                    sx={{ letterSpacing: "0.5px" }}
                  >
                    CAMPAIGN DETAILS
                  </Typography>
                  <Box sx={{ pl: 1 }}>
                    <Typography variant="body1" mb={1.5}>
                      <strong style={{ color: "#0d47a1" }}>Type:</strong>
                      <Chip
                        label={selectedCampaign.type?.toUpperCase() || "N/A"}
                        sx={{
                          ml: 1.5,
                          fontWeight: 600,
                          bgcolor: "#e3f2fd",
                          color: "#1976d2",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "6px",
                          boxShadow: "0 2px 4px rgba(25, 118, 210, 0.1)",
                        }}
                      />
                    </Typography>
                    <Typography variant="body1" mb={0.5}>
                      <strong style={{ color: "#0d47a1" }}>Status:</strong>
                      <StatusChip
                        label={selectedCampaign.status}
                        status={selectedCampaign.status}
                        size="small"
                        sx={{ ml: 1.5 }}
                      />
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="#546e7a"
                    mb={1}
                    sx={{ letterSpacing: "0.5px" }}
                  >
                    TIMELINE
                  </Typography>
                  <Box sx={{ pl: 1 }}>
                    <Typography variant="body1" mb={1.5}>
                      <strong style={{ color: "#0d47a1" }}>Start Date:</strong>{" "}
                      <span style={{ color: "#37474f" }}>
                        {formatDate(selectedCampaign.startDate)}
                      </span>
                    </Typography>
                    <Typography variant="body1" mb={1.5}>
                      <strong style={{ color: "#0d47a1" }}>End Date:</strong>{" "}
                      <span style={{ color: "#37474f" }}>
                        {formatDate(selectedCampaign.endDate)}
                      </span>
                    </Typography>
                    <Typography variant="body1" mb={0.5}>
                      <strong style={{ color: "#0d47a1" }}>Duration:</strong>{" "}
                      <span style={{ color: "#37474f" }}>
                        {selectedCampaign.startDate && selectedCampaign.endDate
                          ? `${Math.ceil(
                              (new Date(selectedCampaign.endDate) -
                                new Date(selectedCampaign.startDate)) /
                                (1000 * 60 * 60 * 24)
                            )} days`
                          : "N/A"}
                      </span>
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="#546e7a"
                    mb={1}
                    sx={{ letterSpacing: "0.5px" }}
                  >
                    APP INFORMATION
                  </Typography>
                  <Box sx={{ pl: 1 }}>
                    <Typography variant="body1" mb={1.5}>
                      <strong style={{ color: "#0d47a1" }}>Package Name:</strong>
                    </Typography>
                    {selectedCampaign.packageName ? (
                      <Button
                        component="a"
                        href={selectedCampaign.packageName}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        color="primary"
                        endIcon={<LaunchIcon />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 500,
                          borderRadius: "8px",
                          background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                          boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                          px: 3,
                          "&:hover": {
                            boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                          },
                        }}
                      >
                        View on Play Store
                      </Button>
                    ) : (
                      <Typography variant="body2" color="#b0bec5">
                        No link provided
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid rgba(208, 222, 255, 0.7)" }}>
          <Button
            onClick={handleCloseDetailDialog}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                borderColor: "#0d47a1",
                backgroundColor: "rgba(25, 118, 210, 0.08)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity={snackbar.severity}
            onClose={handleCloseSnackbar}
            sx={{
              width: "100%",
              borderRadius: "8px",
              fontWeight: 500,
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
          >
            {snackbar.children}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default CampaignList;
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
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

// Styled components for premium look
const PremiumPaper = styled(Paper)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 12px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)",
  overflow: "hidden",
  border: "1px solid rgba(224, 224, 224, 0.5)",
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  minWidth: 90,
  textTransform: "capitalize",
  backgroundColor:
    status === "approved"
      ? "rgba(56, 142, 60, 0.1)"
      : status === "pending"
      ? "rgba(255, 152, 0, 0.1)"
      : status === "paused"
      ? "rgba(156, 39, 176, 0.1)"
      : "rgba(66, 133, 244, 0.1)",
  color:
    status === "approved"
      ? theme.palette.success.main
      : status === "pending"
      ? theme.palette.warning.main
      : status === "paused"
      ? theme.palette.secondary.main
      : theme.palette.primary.main,
}));

const GradientHeader = styled("div")({
  background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
  color: "white",
  padding: "16px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
});

// Custom Toolbar with export option
function CustomToolbar({ onRefresh }) {
  return (
    <GridToolbarContainer
      sx={{ justifyContent: "space-between", p: 1, bgcolor: "#f8f9ff" }}
    >
      <Button
        onClick={onRefresh}
        startIcon={<RefreshIcon />}
        variant="text"
        size="small"
        sx={{
          color: "#5c6bc0",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "rgba(92, 107, 192, 0.08)",
          },
        }}
      >
        Refresh Data
      </Button>
      <Box>
        <GridToolbarColumnsButton sx={{ color: "#5c6bc0" }} />
        <GridToolbarFilterButton sx={{ color: "#5c6bc0" }} />
        <GridToolbarDensitySelector sx={{ color: "#5c6bc0" }} />
        <GridToolbarExport
          sx={{ color: "#5c6bc0" }}
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
              color: "#1a237e",
              fontWeight: 600,
              width: 36,
              height: 36,
              fontSize: "0.8rem",
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
          <Typography variant="subtitle2" fontWeight="600">
            {params.row.advertiser?.name || "Unknown"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
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
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                  marginTop: "4px",
                },
              },
            }}
          >
            {["pending", "approved", "paused", "completed"].map((status) => (
              <MenuItem key={status} value={status} sx={{ py: 1 }}>
                {updatingStatus[campaignId] && status === currentStatus ? (
                  <CircularProgress size={20} sx={{ mr: 1.5 }} />
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
            bgcolor: "#e8eaf6",
            color: "#3949ab",
            px: 1.5,
            py: 0.5,
            borderRadius: "6px",
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
          <Typography variant="caption" display="block" color="text.secondary">
            <strong>Start:</strong> {formatDate(params.row.startDate)}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
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
                color: "#1a237e",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                width: "100%",
                justifyContent: "flex-start",
                "&:hover": {
                  color: "#5c6bc0",
                  backgroundColor: "transparent",
                },
              }}
            >
              View App
            </Button>
          </Tooltip>
        ) : (
          <Typography variant="body2" color="text.secondary">
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
        <Typography
          variant="h6"
          color="error"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Error Loading Campaigns
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 2, maxWidth: 500 }}
        >
          {error}
        </Typography>
        <Button
          onClick={fetchCampaigns}
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          sx={{
            borderRadius: "50px",
            px: 4,
            py: 1,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(92, 107, 192, 0.2)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(92, 107, 192, 0.3)",
            },
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <GradientHeader>
        <Typography variant="h6" fontWeight="600">
          Campaign Management Dashboard
        </Typography>
        <Box>
          <Button
            onClick={fetchCampaigns}
            variant="outlined"
            color="inherit"
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: "rgba(255,255,255,0.3)",
              color: "white",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.5)",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Refresh Data
          </Button>
        </Box>
      </GradientHeader>

      <PremiumPaper sx={{ flex: 1 }}>
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
                  color="text.secondary"
                  fontWeight="500"
                >
                  No campaigns found
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
              backgroundColor: "#f5f7ff",
              fontWeight: "bold",
              color: "#1a237e",
              fontSize: "0.9rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid rgba(224, 224, 224, 0.3)",
              cursor: "pointer",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "rgba(92, 107, 192, 0.03) !important",
              },
              "&:nth-of-type(even)": {
                backgroundColor: "#f8f9ff",
                "&:hover": {
                  backgroundColor: "rgba(92, 107, 192, 0.05) !important",
                },
              },
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "white",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#f5f7ff",
              borderTop: "1px solid rgba(224, 224, 224, 0.5)",
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
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#f5f7ff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Campaign Details
          </Typography>
          <IconButton onClick={handleCloseDetailDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <br/>
        <DialogContent sx={{ py: 3 }}>
          {selectedCampaign && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                <Avatar
                  sx={{
                    bgcolor: "#e3f2fd",
                    color: "#1a237e",
                    width: 56,
                    height: 56,
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                >
                  {selectedCampaign.name?.charAt(0) || "C"}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {selectedCampaign.name}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
                gap={3}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={1}
                  >
                    ADVERTISER INFORMATION
                  </Typography>
                  <Box sx={{ pl: 1 }}>
                    <Typography variant="body1" mb={0.5}>
                      <strong>Name:</strong>{" "}
                      {selectedCampaign.advertiser?.name || "N/A"}
                    </Typography>
                    <Typography variant="body1" mb={0.5}>
                      <strong>Phone:</strong>{" "}
                      {selectedCampaign.advertiser?.phone || "N/A"}
                    </Typography>
                    <Typography variant="body1" mb={0.5}>
                      <strong>Wallet Balance:</strong> ₹
                      {selectedCampaign.advertiser?.wallet?.toFixed(2) ||
                        "0.00"}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={1}
                  >
                    CAMPAIGN DETAILS
                  </Typography>
                  <Box sx={{ pl: 1 }}>
                    <Typography variant="body1" mb={0.5}>
                      <strong>Type:</strong>
                      <Chip
                        label={selectedCampaign.type?.toUpperCase() || "N/A"}
                        sx={{
                          ml: 1,
                          fontWeight: 600,
                          bgcolor: "#e8eaf6",
                          color: "#3949ab",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "6px",
                        }}
                      />
                    </Typography>
                    <Typography variant="body1" mb={0.5}>
                      <strong>Status:</strong>
                      <StatusChip
                        label={selectedCampaign.status}
                        status={selectedCampaign.status}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={1}
                  >
                    TIMELINE
                  </Typography>
                  <Box sx={{ pl: 1 }}>
                    <Typography variant="body1" mb={0.5}>
                      <strong>Start Date:</strong>{" "}
                      {formatDate(selectedCampaign.startDate)}
                    </Typography>
                    <Typography variant="body1" mb={0.5}>
                      <strong>End Date:</strong>{" "}
                      {formatDate(selectedCampaign.endDate)}
                    </Typography>
                    <Typography variant="body1" mb={0.5}>
                      <strong>Duration:</strong>{" "}
                      {selectedCampaign.startDate && selectedCampaign.endDate
                        ? `${Math.ceil(
                            (new Date(selectedCampaign.endDate) -
                              new Date(selectedCampaign.startDate)) /
                              (1000 * 60 * 60 * 24)
                          )} days`
                        : "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.secondary"
                    mb={1}
                  >
                    APP INFORMATION
                  </Typography>
                  <Box sx={{ pl: 1 }}>
                    <Typography variant="body1" mb={1}>
                      <strong>Package Name:</strong>
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
                          boxShadow: "0 4px 12px rgba(92, 107, 192, 0.2)",
                          "&:hover": {
                            boxShadow: "0 6px 16px rgba(92, 107, 192, 0.3)",
                          },
                        }}
                      >
                        View on Play Store
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No link provided
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <Button
            onClick={handleCloseDetailDialog}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              fontWeight: 600,
              px: 3,
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
              borderRadius: "12px",
              fontWeight: 500,
              alignItems: "center",
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

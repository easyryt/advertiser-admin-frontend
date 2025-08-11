import React, { useState, useEffect } from 'react';
import { 
  DataGrid, 
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import axios from 'axios';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

// Custom Toolbar with export option
function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ justifyContent: 'flex-end', p: 1 }}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport 
        printOptions={{ disableToolbarButton: true }} 
        csvOptions={{ 
          fileName: 'campaigns-list',
          delimiter: ';',
          utf8WithBom: true
        }} 
      />
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

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://advertiserappnew.onrender.com/admin/campaign/getAll',
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
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch campaigns');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [paginationModel]);

  const handleStatusChange = async (campaignId, newStatus) => {
    // Optimistic UI update
    const originalCampaigns = [...campaigns];
    try {
      setCampaigns(prev => prev.map(camp => 
        camp?._id === campaignId ? { ...camp, status: newStatus } : camp
      ));

      // Make API call to update status
      await axios.patch(
        `https://advertiserappnew.onrender.com/admin/campaign/status/update/${campaignId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      setSnackbar({
        children: `Status updated to ${newStatus} successfully!`,
        severity: 'success',
      });
    } catch (error) {
      // Revert on error
      setCampaigns(originalCampaigns);
      setSnackbar({
        children: 'Failed to update status: ' + (error.response?.data?.message || error.message),
        severity: 'error',
      });
      console.error('Update error:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  const getStatusChip = (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'warning' },
      approved: { label: 'Approved', color: 'success' },
      paused: { label: 'Paused', color: 'secondary' },
      completed: { label: 'Completed', color: 'primary' },
    };
    
    const statusInfo = statusMap[status] || { label: status, color: 'default' };
    
    return (
      <Chip 
        label={statusInfo.label}
        color={statusInfo.color}
        size="small"
        sx={{ 
          fontWeight: 600, 
          minWidth: 90,
          textTransform: 'capitalize'
        }}
      />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns = [
    { 
      field: 'name', 
      headerName: 'Campaign Name', 
      width: 220,
      renderCell: (params) => (
        <Typography variant="body1" fontWeight="medium">
          {params.row.name || 'N/A'}
        </Typography>
      )
    },
    { 
      field: 'advertiser', 
      headerName: 'Advertiser Phone', 
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.advertiser?.phone || 'Unknown'}
        </Typography>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 180,
      renderCell: (params) => {
        const currentStatus = params.row.status || 'pending';
        const campaignId = params.row._id;
        
        return (
          <Select
            value={currentStatus}
            onChange={(e) => handleStatusChange(campaignId, e.target.value)}
            size="small"
            sx={{ 
              width: '100%',
              '& .MuiSelect-select': { 
                display: 'flex', 
                alignItems: 'center',
                py: 0.5
              }
            }}
          >
            <MenuItem value="pending">
              {getStatusChip('pending')}
            </MenuItem>
            <MenuItem value="approved">
              {getStatusChip('approved')}
            </MenuItem>
            <MenuItem value="paused">
              {getStatusChip('paused')}
            </MenuItem>
            <MenuItem value="completed">
              {getStatusChip('completed')}
            </MenuItem>
          </Select>
        );
      }
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip 
          label={params.row.type?.toUpperCase() || 'N/A'} 
          color="info" 
          size="small"
          sx={{ fontWeight: 600 }}
        />
      )
    },
    { 
      field: 'wallet', 
      headerName: 'Advertiser Wallet', 
      width: 150,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          ₹{params.row.advertiser?.wallet?.toFixed(2) || '0.00'}
        </Typography>
      )
    },
    { 
      field: 'dates', 
      headerName: 'Duration', 
      width: 200,
      renderCell: (params) => (
        <Box>
          <Typography variant="caption" display="block" color="text.secondary">
            Start: {formatDate(params.row.startDate)}
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            End: {formatDate(params.row.endDate)}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'appLink', 
      headerName: 'App Link', 
      width: 300,
      renderCell: (params) => {
        const link = params.row.appLink;
        return link ? (
          <Typography 
            component="a" 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{
              textDecoration: 'underline',
              color: 'primary.main',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
              '&:hover': {
                color: 'secondary.main'
              }
            }}
          >
            {link}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No link provided
          </Typography>
        );
      }
    },
  ];

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '50vh',
        textAlign: 'center',
        p: 3
      }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Campaigns
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <button 
          onClick={fetchCampaigns}
          style={{ 
            padding: '8px 24px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Retry
        </button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: 700, 
      width: '100%',
      '& .MuiDataGrid-root': {
        border: 'none',
        fontSize: '0.875rem'
      },
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#f5f7fa',
        fontWeight: 'bold'
      },
      '& .MuiDataGrid-cell:focus': {
        outline: 'none',
      },
    }}>
      <DataGrid
        rows={campaigns}
        columns={columns}
        getRowId={(row) => row._id || Math.random().toString(36)}
        rowCount={totalRows}
        loading={loading}
        pagination
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        slots={{
          toolbar: CustomToolbar,
          loadingOverlay: LinearProgress,
          noRowsOverlay: () => (
            <Box sx={{ 
              display: 'flex', 
              height: '100%', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 1
            }}>
              <Typography variant="body1" color="text.secondary">
                No campaigns found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new campaign or adjust your filters
              </Typography>
            </Box>
          ),
        }}
        sx={{
          boxShadow: 2,
          border: 'none',
          borderRadius: 3,
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(224, 224, 224, 0.5)',
          },
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
      />
      
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert
            elevation={6}
            variant="filled"
            severity={snackbar.severity}
            onClose={handleCloseSnackbar}
            sx={{ width: '100%' }}
          >
            {snackbar.children}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default CampaignList;
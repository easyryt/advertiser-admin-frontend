import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  useNavigate,
  useParams
} from 'react-router-dom';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { 
  Box, 
  Typography, 
  Paper, 
  LinearProgress,
  useTheme,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

// Custom theme with premium styling
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '1px solid #333',
          borderRadius: '8px',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          },
          '& .MuiDataGrid-cell--textCenter': {
            justifyContent: 'center',
          },
          '& .MuiDataGrid-columnHeader--alignCenter': {
            justifyContent: 'center',
          },
        },
        columnHeader: {
          backgroundColor: '#1a1a1a',
          fontSize: '0.9rem',
          fontWeight: 'bold',
        },
        footerContainer: {
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

// Custom toolbar with premium buttons
function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between' }}>
      <Box>
        <GridToolbarFilterButton 
          sx={{ 
            color: '#00e5ff', 
            '&:hover': { backgroundColor: 'rgba(0, 229, 255, 0.08)' } 
          }} 
        />
        <GridToolbarDensitySelector 
          sx={{ 
            color: '#00e5ff', 
            ml: 1,
            '&:hover': { backgroundColor: 'rgba(0, 229, 255, 0.08)' } 
          }} 
        />
      </Box>
      <GridToolbarExport 
        sx={{ 
          color: '#00e5ff', 
          '&:hover': { backgroundColor: 'rgba(0, 229, 255, 0.08)' } 
        }} 
      />
    </GridToolbarContainer>
  );
}

export default function AdvertisersDataGrid() {
  const [data, setData] = useState([]);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { advertiserId } = useParams();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://advertiserappnew.onrender.com/admin/analytics/adv/getAll',
        {
          withCredentials: true,
          params: {
            page: paginationModel.page + 1, // Convert to 1-based index
            limit: paginationModel.pageSize
          }
        }
      );

      if (response.data.status) {
        setData(response.data.message);
        setRowCount(response.data.total);
        
        // If URL has advertiserId, open detail view
        if (advertiserId) {
          const advertiser = response.data.message.find(item => item._id === advertiserId);
          if (advertiser) {
            setSelectedAdvertiser(advertiser);
            setDetailDialogOpen(true);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel, advertiserId]);

  const handleRowClick = (params) => {
    navigate(`/dashboard/advertiser-analytics-/${params.id}`);
    setSelectedAdvertiser(params.row);
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    navigate('/dashboard/advertiser-analytics');
    setDetailDialogOpen(false);
  };

  const columns = [
    { 
      field: 'phone', 
      headerName: 'Phone', 
      flex: 1,
      minWidth: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body2" color="primary" sx={{ textAlign: 'center' }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            bgcolor: params.value === 'Advertiser' 
              ? 'rgba(0, 229, 255, 0.2)' 
              : 'rgba(255, 193, 7, 0.2)',
            color: params.value === 'Advertiser' 
              ? '#00e5ff' 
              : '#ffc107',
            px: 1.5,
            py: 0.5,
            borderRadius: 4,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            display: 'inline-flex',
          }}
        >
          {params.value}
        </Box>
      )
    },
    { 
      field: 'wallet', 
      headerName: 'Wallet Balance', 
      type: 'number',
      flex: 1,
      minWidth: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="bold" sx={{ textAlign: 'center' }}>
          ₹{params.value.toLocaleString()}
        </Typography>
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Created', 
      flex: 1.5,
      minWidth: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography sx={{ textAlign: 'center' }}>
          {new Date(params.value).toLocaleString()}
        </Typography>
      ),
    },
    { 
      field: 'updatedAt', 
      headerName: 'Last Updated', 
      flex: 1.5,
      minWidth: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography sx={{ textAlign: 'center' }}>
          {new Date(params.value).toLocaleString()}
        </Typography>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Paper 
        elevation={6} 
        sx={{ 
          height: '100%', 
          bgcolor: 'background.paper',
          borderRadius: 3,
          overflow: 'hidden',
          p: isMobile ? 1 : 3,
        }}
      >
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Advertisers Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Premium analytics with real-time data
          </Typography>
        </Box>
        
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            rowCount={rowCount}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 25]}
            onRowClick={handleRowClick}
            slots={{
              toolbar: CustomToolbar,
              loadingOverlay: LinearProgress,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              '& .premium-header': {
                bgcolor: 'rgba(0, 229, 255, 0.15)',
              },
              '& .MuiDataGrid-virtualScroller': {
                bgcolor: 'rgba(255, 255, 255, 0.02)',
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor: 'rgba(0, 229, 255, 0.05)',
                cursor: 'pointer',
              },
            }}
            getRowId={(row) => row._id}
            disableRowSelectionOnClick
            density="comfortable"
          />
        </Box>
        
        <Box sx={{ 
          mt: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          color: 'text.secondary',
          fontSize: '0.8rem',
          px: 1
        }}>
          <Typography sx={{ textAlign: 'center' }}>Total Advertisers: {rowCount}</Typography>
          <Typography sx={{ textAlign: 'center' }}>
            Page {paginationModel.page + 1} of {Math.ceil(rowCount / paginationModel.pageSize)}
          </Typography>
        </Box>
        
        {/* Advertiser Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={handleCloseDetail}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ m: 0, p: 2 }}>
            Advertiser Details
            <IconButton
              aria-label="close"
              onClick={handleCloseDetail}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedAdvertiser && (
              <Stack spacing={2}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Chip 
                    label={selectedAdvertiser.role} 
                    sx={{ 
                      bgcolor: selectedAdvertiser.role === 'Advertiser' 
                        ? 'rgba(0, 229, 255, 0.2)' 
                        : 'rgba(255, 193, 7, 0.2)',
                      color: selectedAdvertiser.role === 'Advertiser' 
                        ? '#00e5ff' 
                        : '#ffc107',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      px: 2,
                      py: 1
                    }} 
                  />
                </Box>
                
                <Divider />
                
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">Phone</Typography>
                  <Typography variant="h6" color="primary" sx={{ textAlign: 'center' }}>
                    {selectedAdvertiser.phone}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">Wallet Balance</Typography>
                  <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    ₹{selectedAdvertiser.wallet.toLocaleString()}
                  </Typography>
                </Box>
                
                <Divider />
                
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">Account Created</Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    {new Date(selectedAdvertiser.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">Last Updated</Typography>
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    {new Date(selectedAdvertiser.updatedAt).toLocaleString()}
                  </Typography>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseDetail} 
              sx={{ color: '#00e5ff' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </ThemeProvider>
  );
}
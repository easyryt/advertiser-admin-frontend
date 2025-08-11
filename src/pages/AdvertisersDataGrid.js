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
  Divider,
  Avatar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventIcon from '@mui/icons-material/Event';
import UpdateIcon from '@mui/icons-material/Update';

// Premium theme customization
const premiumTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '12px',
          padding: '8px 20px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.8rem',
          padding: '4px 8px',
        },
      },
    },
  },
});

// Custom toolbar with premium buttons
function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ p: 2, justifyContent: 'space-between', bgcolor: 'rgba(99, 102, 241, 0.05)' }}>
      <Box>
        <GridToolbarFilterButton 
          sx={{ 
            color: '#6366f1', 
            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.08)' } 
          }} 
        />
        <GridToolbarDensitySelector 
          sx={{ 
            color: '#6366f1', 
            ml: 1,
            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.08)' } 
          }} 
        />
      </Box>
      <GridToolbarExport 
        sx={{ 
          color: '#6366f1', 
          '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.08)' } 
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
      field: 'name', 
      headerName: 'Name', 
      flex: 1.2,
      minWidth: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ 
            bgcolor: '#e0e7ff', 
            color: '#6366f1', 
            mr: 2,
            width: 36,
            height: 36,
            fontSize: '1rem'
          }}>
            {params.row.name ? params.row.name.charAt(0) : 'A'}
          </Avatar>
          <Typography variant="body2" fontWeight="500">
            {params.value || 'N/A'}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      flex: 1,
      minWidth: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography variant="body2" color="#4b5563" sx={{ textAlign: 'center' }}>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      flex: 0.8,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            bgcolor: params.value === 'Advertiser' 
              ? 'rgba(99, 102, 241, 0.1)' 
              : 'rgba(16, 185, 129, 0.1)',
            color: params.value === 'Advertiser' 
              ? '#6366f1' 
              : '#10b981',
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
      headerName: 'Wallet', 
      type: 'number',
      flex: 0.8,
      minWidth: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ 
          bgcolor: '#f0fdf4',
          px: 1.5,
          py: 0.5,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center'
        }}>
          <MonetizationOnIcon sx={{ 
            color: '#10b981', 
            fontSize: '1rem', 
            mr: 1 
          }}/>
          <Typography variant="body2" fontWeight="700" color="#10b981">
            ₹{params.value.toLocaleString()}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Created', 
      flex: 1.2,
      minWidth: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: '#64748b',
          fontSize: '0.875rem'
        }}>
          <EventIcon sx={{ fontSize: '1rem', mr: 1 }}/>
          {new Date(params.value).toLocaleDateString()}
        </Box>
      ),
    },
    { 
      field: 'updatedAt', 
      headerName: 'Updated', 
      flex: 1.2,
      minWidth: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          color: '#64748b',
          fontSize: '0.875rem'
        }}>
          <UpdateIcon sx={{ fontSize: '1rem', mr: 1 }}/>
          {new Date(params.value).toLocaleDateString()}
        </Box>
      ),
    },
  ];

  return (
    <ThemeProvider theme={premiumTheme}>
      <Paper 
        elevation={0} 
        sx={{ 
          height: '100%', 
          bgcolor: 'background.default',
          borderRadius: 3,
          overflow: 'hidden',
          p: isMobile ? 1 : 3,
        }}
      >
        <Box sx={{ 
          mb: 3, 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #6366f1 0%, #8b5cf6 100%)',
          p: 3,
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
        }}>
          <Typography variant="h4" fontWeight="800" letterSpacing="-0.5px">
            Advertisers Dashboard
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
            Premium analytics with real-time insights
          </Typography>
        </Box>
        
        <Box sx={{ 
          height: 600, 
          width: '100%',
          '& .MuiDataGrid-root': {
            border: 'none',
            fontSize: '0.875rem'
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'rgba(99, 102, 241, 0.05)',
            borderRadius: '12px 12px 0 0',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          },
        }}>
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
              '& .MuiDataGrid-row:hover': {
                bgcolor: 'rgba(99, 102, 241, 0.03)',
                cursor: 'pointer',
              },
              '& .MuiDataGrid-row.Mui-selected': {
                bgcolor: 'rgba(99, 102, 241, 0.08)',
              },
              '& .MuiDataGrid-row.Mui-selected:hover': {
                bgcolor: 'rgba(99, 102, 241, 0.1)',
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
          <Typography sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{
              width: '12px',
              height: '12px',
              bgcolor: '#6366f1',
              borderRadius: '4px'
            }}/>
            Total Advertisers: {rowCount}
          </Typography>
          <Typography sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}>
            <Box sx={{
              width: '12px',
              height: '12px',
              bgcolor: '#10b981',
              borderRadius: '4px'
            }}/>
            Page {paginationModel.page + 1} of {Math.ceil(rowCount / paginationModel.pageSize)}
          </Typography>
        </Box>
        
        {/* Premium Advertiser Detail Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={handleCloseDetail}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
            }
          }}
        >
          <Box sx={{ 
            bgcolor: 'primary.main',
            p: 3,
            color: 'white',
            position: 'relative'
          }}>
            <DialogTitle sx={{ 
              m: 0, 
              p: 0,
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 700
            }}>
              Advertiser Profile
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleCloseDetail}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'white',
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <DialogContent dividers sx={{ py: 4 }}>
            {selectedAdvertiser && (
              <Stack spacing={3}>
                <Box sx={{ 
                  textAlign: 'center', 
                  mb: 2,
                  position: 'relative',
                  mt: -8
                }}>
                  <Avatar 
                    src="" 
                    sx={{ 
                      width: 96, 
                      height: 96, 
                      mx: 'auto',
                      border: '4px solid white',
                      bgcolor: '#e0e7ff',
                      color: '#6366f1',
                      fontSize: '2.5rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    {selectedAdvertiser.name ? selectedAdvertiser.name.charAt(0) : 'A'}
                  </Avatar>
                  <Typography variant="h5" fontWeight="700" sx={{ mt: 2 }}>
                    {selectedAdvertiser.name || 'N/A'}
                  </Typography>
                  <Chip 
                    label={selectedAdvertiser.role} 
                    sx={{ 
                      bgcolor: selectedAdvertiser.role === 'Advertiser' 
                        ? 'rgba(99, 102, 241, 0.1)' 
                        : 'rgba(16, 185, 129, 0.1)',
                      color: selectedAdvertiser.role === 'Advertiser' 
                        ? '#6366f1' 
                        : '#10b981',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      px: 2,
                      py: 1,
                      mt: 1
                    }} 
                  />
                </Box>
                
                <Divider />
                
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 3,
                  mt: 2
                }}>
                  <DetailItem 
                    icon={<AccountCircleIcon sx={{ color: '#64748b' }}/>}
                    label="Phone"
                    value={selectedAdvertiser.phone}
                  />
                  
                  <DetailItem 
                    icon={<MonetizationOnIcon sx={{ color: '#10b981' }}/>}
                    label="Wallet Balance"
                    value={`₹${selectedAdvertiser.wallet.toLocaleString()}`}
                    valueColor="#10b981"
                  />
                  
                  <DetailItem 
                    icon={<EventIcon sx={{ color: '#64748b' }}/>}
                    label="Account Created"
                    value={new Date(selectedAdvertiser.createdAt).toLocaleDateString()}
                  />
                  
                  <DetailItem 
                    icon={<UpdateIcon sx={{ color: '#64748b' }}/>}
                    label="Last Updated"
                    value={new Date(selectedAdvertiser.updatedAt).toLocaleDateString()}
                  />
                </Box>
                
                <Divider sx={{ mt: 1 }}/>
                
                <Box sx={{ 
                  bgcolor: 'rgba(99, 102, 241, 0.03)',
                  borderRadius: '12px',
                  p: 2,
                  textAlign: 'center'
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Advertiser ID
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: 'monospace', 
                    wordBreak: 'break-all',
                    color: '#6366f1'
                  }}>
                    {selectedAdvertiser._id}
                  </Typography>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ 
            px: 3, 
            py: 2,
            bgcolor: 'background.paper'
          }}>
            <Button 
              onClick={handleCloseDetail} 
              variant="contained"
              sx={{ 
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              Close Profile
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </ThemeProvider>
  );
}

// Reusable detail item component
function DetailItem({ icon, label, value, valueColor = '#1e293b' }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        {icon}
        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
          {label}
        </Typography>
      </Box>
      <Typography variant="body1" fontWeight="500" sx={{ color: valueColor }}>
        {value}
      </Typography>
    </Box>
  );
}
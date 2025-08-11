import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  useNavigate
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
  Chip,
  Avatar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
    subtitle1: {
      fontWeight: 600,
      letterSpacing: '-0.25px',
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
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
          }
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.8rem',
          padding: '4px 8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        cell: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        columnHeaderTitleContainer: {
          justifyContent: 'center',
          width: '100%',
        },
      }
    }
  },
});

// Custom toolbar with premium buttons
function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{ 
      p: 2, 
      justifyContent: 'space-between', 
      bgcolor: 'rgba(99, 102, 241, 0.05)',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
    }}>
      <Box>
        <GridToolbarFilterButton 
          sx={{ 
            color: '#6366f1', 
            '&:hover': { 
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.2)'
            } 
          }} 
        />
        <GridToolbarDensitySelector 
          sx={{ 
            color: '#6366f1', 
            ml: 1,
            '&:hover': { 
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.2)'
            } 
          }} 
        />
      </Box>
      <GridToolbarExport 
        sx={{ 
          color: '#6366f1', 
          '&:hover': { 
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            boxShadow: '0 2px 6px rgba(99, 102, 241, 0.2)'
          } 
        }} 
      />
    </GridToolbarContainer>
  );
}

export default function AdvertisersDataGrid() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

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
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  const handleRowClick = (params) => {
    navigate(`/dashboard/advertiser-analytics/${params.id}`);
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
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}>
          <Typography variant="body2" fontWeight="600" sx={{ textAlign: 'center' }}>
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
        <Typography variant="body2" fontWeight="500" color="#4b5563" sx={{ 
          textAlign: 'center',
          width: '100%'
        }}>
          {params.value || 'N/A'}
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
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Chip
            label={params.value}
            sx={{ 
              bgcolor: params.value === 'Advertiser' 
                ? 'rgba(99, 102, 241, 0.1)' 
                : 'rgba(16, 185, 129, 0.1)',
              color: params.value === 'Advertiser' 
                ? '#6366f1' 
                : '#10b981',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              px: 1.5,
              py: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
            }} 
          />
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
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.15)',
          width: 'fit-content',
          margin: '0 auto'
        }}>
          <MonetizationOnIcon sx={{ 
            color: '#10b981', 
            fontSize: '1.2rem', 
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
          justifyContent: 'center',
          color: '#64748b',
          fontSize: '0.875rem',
          width: '100%'
        }}>
          <EventIcon sx={{ fontSize: '1.2rem', mr: 1, color: '#6366f1' }}/>
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
          justifyContent: 'center',
          color: '#64748b',
          fontSize: '0.875rem',
          width: '100%'
        }}>
          <UpdateIcon sx={{ fontSize: '1.2rem', mr: 1, color: '#6366f1' }}/>
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
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ 
          mb: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          p: 4,
          borderRadius: '16px',
          color: 'white',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            transform: 'rotate(30deg)'
          }
        }}>
          <Typography variant="h4" fontWeight="800" letterSpacing="-0.5px" sx={{ position: 'relative', zIndex: 1 }}>
            Advertisers Dashboard
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 1, position: 'relative', zIndex: 1 }}>
            Premium analytics with real-time insights
          </Typography>
        </Box>
        
        <Box sx={{ 
          height: 600, 
          width: '100%',
          '& .MuiDataGrid-root': {
            border: 'none',
            fontSize: '0.875rem',
            borderRadius: '16px',
            overflow: 'hidden',
          },
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'rgba(99, 102, 241, 0.05)',
            borderRadius: '16px 16px 0 0',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            padding: '0 16px',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: '#ffffff',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            fontSize: '0.9rem',
          }
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
              '& .MuiDataGrid-row': {
                transition: 'background-color 0.2s ease',
              },
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
          mt: 3, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'text.secondary',
          fontSize: '0.85rem',
          px: 1,
          py: 1.5,
          borderRadius: '12px',
          bgcolor: 'rgba(99, 102, 241, 0.03)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <Typography sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            fontWeight: 500
          }}>
            <Box sx={{
              width: '12px',
              height: '12px',
              bgcolor: '#6366f1',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(99, 102, 241, 0.5)'
            }}/>
            Total Advertisers: <Box component="span" fontWeight="700" color="#6366f1">{rowCount}</Box>
          </Typography>
          <Typography sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            fontWeight: 500
          }}>
            <Box sx={{
              width: '12px',
              height: '12px',
              bgcolor: '#10b981',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.5)'
            }}/>
            Page <Box component="span" fontWeight="700" color="#6366f1">{paginationModel.page + 1}</Box> 
            of <Box component="span" fontWeight="700" color="#10b981">{Math.ceil(rowCount / paginationModel.pageSize)}</Box>
          </Typography>
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  CircularProgress, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Box,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  IconButton,
  Tooltip,
  Fab
} from '@mui/material';
import { 
  createTheme, 
  ThemeProvider, 
  useTheme 
} from '@mui/material/styles';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Close as CloseIcon,
  CurrencyRupee as RupeeIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Premium theme configuration
const theme = createTheme({
  palette: {
    primary: { 
      main: '#4a148c',
      light: '#7c43bd',
      dark: '#12005e'
    },
    secondary: { 
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055'
    },
    background: { 
      default: '#f5f7fa',
      paper: '#ffffff'
    },
    success: {
      main: '#4caf50'
    },
    error: {
      main: '#f44336'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { 
      fontWeight: 700, 
      letterSpacing: 0.5,
      color: '#2d2d2d'
    },
    subtitle1: { 
      fontWeight: 500,
      color: '#5d5d5d'
    },
    h6: {
      fontWeight: 600
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: { 
          fontWeight: 700, 
          backgroundColor: '#f8f9ff',
          fontSize: '1rem'
        },
        root: { 
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          fontSize: '0.95rem'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(45deg, #4a148c 30%, #7c43bd 90%)',
          boxShadow: '0 3px 5px 2px rgba(74, 20, 140, .2)',
          '&:hover': {
            background: 'linear-gradient(45deg, #3a0d6d 30%, #6a33a8 90%)',
          }
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #ff4081 30%, #ff79b0 90%)',
          boxShadow: '0 3px 5px 2px rgba(255, 64, 129, .2)',
          '&:hover': {
            background: 'linear-gradient(45deg, #e0006b 30%, #ff5da0 90%)',
          }
        }
      }
    }
  }
});

const RewardDialog = ({ open, onClose, reward, onSubmit, mode }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    rewardType: '',
    amount: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reward) {
      setFormData({
        rewardType: reward.rewardType || '',
        amount: reward.amount || 0
      });
    } else {
      setFormData({
        rewardType: '',
        amount: 0
      });
    }
  }, [reward]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.rewardType || formData.amount <= 0) {
      setError('Please fill all fields with valid values');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      let url, method;
      if (mode === 'create') {
        url = 'https://advertiserappnew.onrender.com/admin/reward/create';
        method = 'post';
      } else {
        url = 'https://advertiserappnew.onrender.com/admin/reward/update';
        method = 'put';
      }

      const payload = mode === 'create' 
        ? formData 
        : { ...formData, _id: reward._id };

      const response = await axios({
        method,
        url,
        data: payload,
        withCredentials: true
      });

      if (response.data.status) {
        onSubmit();
        onClose();
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const rewardTypes = ['Install', 'Review', 'Refferal', 'ReviewRef'];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: 16,
          background: theme.palette.background.paper
        }
      }}
    >
      <DialogTitle sx={{ 
        background: theme.palette.primary.main,
        color: 'white',
        fontWeight: 600,
        py: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {mode === 'create' ? 'Create New Reward' : 'Edit Reward'}
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ py: 3, px: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <br/>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Reward Type</InputLabel>
              <Select
                name="rewardType"
                value={formData.rewardType}
                onChange={handleChange}
                label="Reward Type"
              >
                {rewardTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount (₹)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              InputProps={{
                startAdornment: <RupeeIcon sx={{ color: 'action.active', mr: 1 }} />,
                inputProps: { min: 0, step: 0.01 }
              }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
              borderColor: theme.palette.primary.dark
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ 
            ml: 2,
            color: 'white',
            position: 'relative'
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            mode === 'create' ? 'Create Reward' : 'Update Reward'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteConfirmation = ({ open, onClose, onConfirm, reward }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16
        }
      }}
    >
      <DialogTitle sx={{ 
        fontWeight: 600,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        py: 2
      }}>
        Confirm Deletion
      </DialogTitle>
      <DialogContent sx={{ py: 3, px: 3 }}>
        <Typography variant="body1">
          Are you sure you want to delete the reward for <strong>{reward?.rewardType}</strong>?
        </Typography>
        <Box display="flex" alignItems="center" mt={2}>
          <RupeeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="h6" color="error">
            {reward?.amount}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" mt={1}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            color: 'text.primary',
            borderColor: 'rgba(0,0,0,0.23)'
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained"
          color="error"
          sx={{ ml: 2 }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const RewardDashboard = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [mode, setMode] = useState('create');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchRewards = async () => {
    try {
      setLoading(true);
      const params = filter !== 'All' ? { rewardType: filter } : {};
      
      const response = await axios.get(
        'https://advertiserappnew.onrender.com/admin/reward/getAll', 
        {
          params,
          withCredentials: true
        }
      );
      
      if (response.data.status && response.data.data) {
        setRewards(response.data.data);
      } else {
        setError('Invalid response structure');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [filter]);

  const handleCreateClick = () => {
    setMode('create');
    setCurrentReward(null);
    setDialogOpen(true);
  };

  const handleEditClick = (reward) => {
    setMode('edit');
    setCurrentReward(reward);
    setDialogOpen(true);
  };

  const handleDeleteClick = (reward) => {
    setCurrentReward(reward);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `https://advertiserappnew.onrender.com/admin/reward/delete/${currentReward._id}`,
        { withCredentials: true }
      );
      
      if (response.data.status) {
        setSnackbar({
          open: true,
          message: 'Reward deleted successfully',
          severity: 'success'
        });
        fetchRewards();
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Deletion failed',
          severity: 'error'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'Deletion failed',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleDialogSuccess = () => {
    setSnackbar({
      open: true,
      message: mode === 'create' 
        ? 'Reward created successfully' 
        : 'Reward updated successfully',
      severity: 'success'
    });
    fetchRewards();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'PPpp');
  };

  const rewardTypes = ['All', 'Install', 'Review', 'Refferal', 'ReviewRef'];

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
        <Paper sx={{ p: 4, mb: 4, position: 'relative' }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4" gutterBottom>
                Reward Management
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Track and manage reward configurations
              </Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Filter by Type</InputLabel>
                    <Select
                      value={filter}
                      onChange={handleFilterChange}
                      label="Filter by Type"
                    >
                      {rewardTypes.map(type => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreateClick}
                    sx={{ height: '40px' }}
                  >
                    New Reward
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress size={60} thickness={4} color="secondary" />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ position: 'relative' }}>
            <Table sx={{ minWidth: 750 }} aria-label="rewards table">
              <TableHead>
                <TableRow>
                  <TableCell>Reward Type</TableCell>
                  <TableCell align="center">Amount (₹)</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rewards.map((reward) => (
                  <TableRow key={reward._id} hover>
                    <TableCell>
                      <Chip 
                        label={reward.rewardType} 
                        color={
                          reward.rewardType === 'Review' ? 'primary' : 
                          reward.rewardType === 'Install' ? 'secondary' : 'default'
                        }
                        sx={{ 
                          fontWeight: 600,
                          px: 1.5,
                          py: 1
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        <RupeeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                        <Typography 
                          variant="h6" 
                          color={reward.amount > 1 ? 'primary' : 'textPrimary'}
                          sx={{ fontWeight: 700 }}
                        >
                          {reward.amount}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(reward.createdAt)}</TableCell>
                    <TableCell>{formatDate(reward.updatedAt)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
                        <IconButton 
                          onClick={() => handleEditClick(reward)}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          onClick={() => handleDeleteClick(reward)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Fab
          color="primary"
          aria-label="add"
          sx={{ 
            position: 'fixed', 
            bottom: 32, 
            right: 32,
            background: 'linear-gradient(45deg, #4a148c 30%, #7c43bd 90%)'
          }}
          onClick={handleCreateClick}
        >
          <AddIcon />
        </Fab>

        <RewardDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          reward={currentReward}
          onSubmit={handleDialogSuccess}
          mode={mode}
        />

        <DeleteConfirmation
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          reward={currentReward}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ 
              width: '100%',
              borderRadius: 2,
              boxShadow: theme.shadows[4]
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default RewardDashboard;
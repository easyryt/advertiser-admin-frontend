import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  TextField,
  Stack,
  CircularProgress,
  Alert,
  Snackbar,
  Slide,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Badge,
  Phone,
  AccountBalanceWallet as WalletIcon,
  Event as EventIcon,
  Update as UpdateIcon,
  MonetizationOn,
  Edit,
  Error as ErrorIcon,
  CheckCircle,
} from '@mui/icons-material';

// Utility for date formatting
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const gradientMain = 'linear-gradient(135deg, #16222A 0%, #3A6073 100%)';

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [walletValue, setWalletValue] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: '',
    type: 'success'
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('https://advertiserappnew.onrender.com/adv/auth/profile', { withCredentials: true });
      setProfile(response.data.message);
      setNameValue(response.data.message?.name || '');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // Wallet recharge
  const handleRecharge = async (e) => {
    e.preventDefault();
    setWalletLoading(true);
    try {
      const amt = parseFloat(walletValue);
      if (isNaN(amt) || amt <= 0) throw new Error('Please enter a valid amount');
      await axios.put('https://advertiserappnew.onrender.com/adv/auth/wallet/recharge', { amount: amt }, { withCredentials: true });
      setSnack({ open: true, message: 'Wallet recharged!', type: 'success' });
      setWalletValue('');
      fetchProfile();
    } catch (err) {
      setSnack({
        open: true,
        message: err.response?.data?.message || err.message || 'Could not recharge wallet',
        type: 'error'
      });
    } finally {
      setWalletLoading(false);
    }
  };

  // Name update
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setNameLoading(true);
    try {
      if (nameValue.length < 3) throw new Error('Name too short');
      await axios.put('https://advertiserappnew.onrender.com/adv/auth/profile/update', { name: nameValue }, { withCredentials: true });
      setSnack({ open: true, message: 'Name updated successfully', type: 'success' });
      fetchProfile();
    } catch (err) {
      setSnack({
        open: true,
        message: err.response?.data?.message || err.message || 'Could not update name',
        type: 'error'
      });
    } finally {
      setNameLoading(false);
    }
  };

  const handleSnackClose = () => setSnack({ ...snack, open: false });

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        bgcolor: gradientMain,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress size={64} sx={{ color: '#fff' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{
        minHeight: '100vh',
        width: '100%',
        bgcolor: gradientMain,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Alert
          severity="error"
          icon={<ErrorIcon fontSize="large" />}
          variant="filled"
          sx={{
            fontSize: 22,
            p: 3,
            maxWidth: 440,
            width: '100%'
          }}>
          <Typography variant="h5" color="inherit" mb={1}>
            Error loading profile
          </Typography>
          <Typography color="inherit">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: gradientMain,
        width: '100%',
        overflowX: 'hidden',
        py: 4
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, md: 4 },
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Grid container spacing={3} justifyContent="center">
          {/* Left Side - Profile Information */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={3}
              sx={{
                height: '100%',
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: 'rgba(255,255,255,0.95)',
                boxShadow: '0 12px 38px 0 rgba(30,30,100,0.17)',
                backdropFilter: 'blur(11px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3, flexShrink: 0 }}>
                <Avatar
                  sx={{
                    width: 92,
                    height: 92,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.dark',
                    boxShadow: '0 4px 22px 0 rgba(10,22,100,0.09)'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 54, color: '#fff' }} />
                </Avatar>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="primary.main"
                  sx={{
                    letterSpacing: 1.1,
                    wordBreak: 'break-word',
                    fontSize: { xs: 24, sm: 26 }
                  }}
                >
                  {profile?.name || 'Your Name'}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  mb={1}
                  sx={{ fontWeight: 500 }}
                >
                  {profile?.role || 'User'} Profile
                </Typography>
                <Divider
                  sx={{
                    width: 48,
                    mx: 'auto',
                    height: 4,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                    my: 1
                  }}
                />
              </Box>

              <List dense sx={{ width: '100%', overflow: 'auto', flexGrow: 1 }}>
                <ListItem>
                  <ListItemIcon>
                    <Badge color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="User ID"
                    secondary={profile?._id || 'N/A'}
                    secondaryTypographyProps={{
                      fontSize: 13,
                      color: 'text.secondary',
                      sx: { wordBreak: 'break-word' }
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Number"
                    secondary={profile?.phone || 'N/A'}
                    secondaryTypographyProps={{
                      fontSize: 16,
                      color: 'text.primary'
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WalletIcon sx={{ color: '#16a085' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Wallet Balance"
                    secondary={
                      <Box display="inline-flex" alignItems="center" fontWeight={700} fontSize={18} color="#16a085">
                        <MonetizationOn sx={{ mr: 0.5, fontSize: 20 }} />
                        {`$${(profile?.wallet || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}`}
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Badge color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Account Role"
                    secondary={profile?.role || 'N/A'}
                    secondaryTypographyProps={{ fontWeight: 500, fontSize: 15, color: 'primary.dark' }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Account Created" secondary={formatDate(profile?.createdAt)} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <UpdateIcon sx={{ color: '#FF805D' }} />
                  </ListItemIcon>
                  <ListItemText primary="Last Updated" secondary={formatDate(profile?.updatedAt)} />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Right Side - Edit Section */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={3}
              sx={{
                height: '100%',
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: 'rgba(255,255,255,0.95)',
                boxShadow: '0 12px 38px 0 rgba(30,30,100,0.17)',
                backdropFilter: 'blur(11px)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Wallet Recharge Section */}
              <Box component="form" onSubmit={handleRecharge} sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
                  Wallet Recharge
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Add funds to your advertising wallet
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center">
                  <TextField
                    type="number"
                    label="Amount ($)"
                    size="medium"
                    value={walletValue}
                    required
                    disabled={walletLoading}
                    onChange={e => setWalletValue(e.target.value)}
                    sx={{
                      flexGrow: 1,
                      bgcolor: '#fcfcfc',
                      borderRadius: 2,
                      input: { fontWeight: 600 }
                    }}
                    inputProps={{ min: 1, max: 1000000, step: 1 }}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<WalletIcon />}
                    type="submit"
                    size="large"
                    sx={{
                      minWidth: 140,
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      borderRadius: 3,
                      letterSpacing: 1,
                      boxShadow: '0 4px 16px 0 rgba(16,180,130,0.08)',
                      transition: '0.2s',
                      '&:hover': {
                        bgcolor: 'success.dark',
                        boxShadow: '0 8px 22px 0 rgba(16,180,130,0.22)'
                      },
                      height: 56
                    }}
                    disabled={walletLoading || !walletValue}
                  >
                    {walletLoading ? <CircularProgress size={23} color="inherit" /> : "Recharge"}
                  </Button>
                </Stack>
              </Box>

              <Divider sx={{ my: 3, borderColor: '#78C1F3' }} />

              {/* Name Update Section */}
              <Box component="form" onSubmit={handleNameUpdate} sx={{ mt: 2 }}>
                <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
                  Update Profile
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Change your display name
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center">
                  <TextField
                    size="medium"
                    label="Your Name"
                    value={nameValue}
                    required
                    disabled={nameLoading}
                    onChange={e => setNameValue(e.target.value)}
                    sx={{
                      flexGrow: 1,
                      bgcolor: '#fcfcfc',
                      borderRadius: 2,
                      input: { fontWeight: 600 }
                    }}
                    inputProps={{ maxLength: 30 }}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Edit />}
                    type="submit"
                    size="large"
                    sx={{
                      minWidth: 140,
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: 'capitalize',
                      letterSpacing: 1,
                      borderWidth: 2,
                      borderColor: 'primary.main',
                      boxShadow: '0 3px 12px 0 rgba(90,110,220,0.11)',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: '#fff',
                        boxShadow: '0 8px 24px 0 rgba(90,110,220,0.16)'
                      },
                      height: 56
                    }}
                    disabled={nameLoading || !nameValue || nameValue === profile?.name}
                  >
                    {nameLoading ? <CircularProgress size={20} color="inherit" /> : "Update"}
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Snackbar Notifications */}
        <Snackbar
          open={snack.open}
          onClose={handleSnackClose}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          TransitionComponent={Slide}
        >
          <Alert
            onClose={handleSnackClose}
            severity={snack.type}
            variant="filled"
            sx={{ fontWeight: 500, alignItems: 'center', fontSize: 17 }}
            iconMapping={{
              success: <CheckCircle sx={{ fontSize: 28 }} />,
              error: <ErrorIcon sx={{ fontSize: 28 }} />
            }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ProfilePage;
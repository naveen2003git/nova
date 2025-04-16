import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Fab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { getUserProfile, profileUpdate } from '../../Utlies/service';
import { ThemeContext } from '../../ThemeContext/ThemeContext';

const Profile = () => {
  const themes = useContext(ThemeContext)
  const [profile, setProfile] = useState({
    fullName: '',
    dob: '',
    mobile: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [mobileError, setMobileError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
        const hasData = data.fullName || data.dob || data.mobile;
        setIsEditing(!hasData); // start in edit mode if no data
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      await profileUpdate(profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mobile') {
      const onlyDigits = value.replace(/\D/g, '');
      if (onlyDigits.length <= 10) {
        setProfile((prev) => ({ ...prev, mobile: onlyDigits }));
      }

      if (onlyDigits.length !== 10) {
        setMobileError('Mobile number must be exactly 10 digits');
      } else {
        setMobileError('');
      }
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Profile Information
        </Typography>

        {isEditing ? (
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
            <TextField
              label="Email"
              value={profile.email}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Full Name"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Date of Birth"
              name="dob"
              type="date"
              value={profile.dob}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Mobile Number"
              name="mobile"
              value={profile.mobile}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!!mobileError}
              helperText={mobileError}
            />
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              
              onClick={handleUpdate}
              fullWidth
              sx={{ mt: 3, borderRadius: 2, py: 1.2, fontWeight: 500 , background:themes.primary}}
              disabled={!!mobileError}
            >
              Save Profile
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 3 }}>
            <ProfileField label="Email" value={profile.email} />
            <ProfileField label="Full Name" value={profile.fullName} />
            <ProfileField label="Date of Birth" value={profile.dob} />
            <ProfileField label="Mobile Number" value={profile.mobile} />
          </Box>
        )}
      </Box>

      {/* FAB for Edit */}
      {!isEditing && (
        <Fab
          
          aria-label="edit"
          onClick={() => setIsEditing(true)}
          sx={{
            background:themes.primary,
            color:themes.text,
            position: 'fixed',
            bottom: 32,
            
            right: 32,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            "&:hover":{
              color:themes.primary
            }
          }}
        >
          <EditIcon />
        </Fab>
      )}
    </Container>
  );
};

const ProfileField = ({ label, value }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2" color="textSecondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={500}>
      {value || '-'}
    </Typography>
  </Box>
);

export default Profile;

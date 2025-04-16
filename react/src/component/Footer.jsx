import React, { useContext } from 'react';
import { Box, Typography, Link, Grid, Divider } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, WhatsApp } from '@mui/icons-material';
import { ThemeContext } from '../Admin/ThemeContext/ThemeContext';

const Footer = () => {
  const themes = useContext(ThemeContext);
  return (
    <Box sx={{ bgcolor: themes.background, py: 6, mt: 6, borderTop: 1, borderColor: themes.primary, px: 10 }}>
      <Grid container spacing={4} justifyContent="space-between" alignItems="center">
        {/* Left Section */}
        <Grid item xs={12} sm={4} md={4}>
          <Typography variant="h6" color={themes.primary} sx={{ mb: 2, fontWeight: 600 }}>
            Quick Links
          </Typography>
          <Box>
            <Link href="/user/terms-of-service" color="text.secondary" sx={{ display: 'block', mb: 1, '&:hover': { color: themes.primary } }}>
              Terms of Service
            </Link>
            <Link href="/user/privacy-policy" color="text.secondary" sx={{ display: 'block', mb: 1, '&:hover': { color: themes.primary } }}>
              Privacy Policy
            </Link>
            <Link href="/user/faq" color="text.secondary" sx={{ display: 'block', mb: 1, '&:hover': { color: themes.primary } }}>
              FAQ
            </Link>
          </Box>
        </Grid>

        {/* Center Section */}
        <Grid item xs={12} sm={4} md={4}>
          <Typography variant="h6" color={themes.primary}sx={{ mb: 2, fontWeight: 600 }}>
            Social Media
          </Typography>
          <Box>
            <Link href="https://facebook.com" color="text.secondary" sx={{ display: 'block', mb: 1, '&:hover': { color: themes.primary } }}>
              <Facebook sx={{ mr: 1 }} />
              Facebook
            </Link>
            <Link href="https://instagram.com" color="text.secondary" sx={{ display: 'block', mb: 1, '&:hover': { color: themes.primary } }}>
              <Instagram sx={{ mr: 1 }} />
              Instagram
            </Link>
            <Link href="https://whatsapp.com" color="text.secondary" sx={{ display: 'block', mb: 1, '&:hover': { color: themes.primary } }}>
              <WhatsApp sx={{ mr: 1 }} />
              Whatsapp
            </Link>
          </Box>
        </Grid>

        {/* Right Section */}
        <Grid item xs={12} sm={4} md={4}>
          <Typography variant="h6" color={themes.primary} sx={{ mb: 2, fontWeight: 600 }}>
            Contact Us
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Email:</strong> novaframesdev@gmail.com
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Phone:</strong> +91 8637670543
          </Typography>
        </Grid>
      </Grid>

      {/* Footer Bottom */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="body2" color={themes.primary} align="center" sx={{ fontWeight: 500 }}>
        © 2025 Your Company. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;

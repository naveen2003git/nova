import React, { useContext } from 'react';
import { Box, Typography, Container, Grid, Divider, IconButton, Button, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { 
  Facebook, 
  Instagram, 
  WhatsApp, 
  Email, 
  Phone, 
  KeyboardArrowUp 
} from '@mui/icons-material';
import { ThemeContext } from '../ThemeContext/ThemeContext';

const Footer = () => {
  const themes = useContext(ThemeContext);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Styled link component for reusability
  const FooterLink = ({ href, icon, children }) => (
    <Box
      component="a"
      href={href}
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: 'text.secondary',
        textDecoration: 'none',
        mb: 1.5,
        transition: 'all 0.2s ease',
        '&:hover': { 
          color: themes.primary,
          transform: 'translateX(4px)',
        }
      }}
    >
      {icon && (
        <Box component="span" sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
      )}
      <Typography variant="body2">{children}</Typography>
    </Box>
  );

  return (
    <Box 
      component="footer"
      sx={{ 
        bgcolor: themes.background,
        borderTop: `1px solid ${themes.primary}20`, // 20% opacity border
        position: 'relative',
        pt: 8,
        pb: 4,
        mt: 8
      }}
    >
      {/* Back to top button */}
      <Box
        sx={{
          position: 'absolute',
          top: -25,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <IconButton
          onClick={scrollToTop}
          aria-label="back to top"
          sx={{
            bgcolor: themes.primary,
            color: '#fff',
            width: 50,
            height: 50,
            '&:hover': {
              bgcolor: themes.primary,
              opacity: 0.9,
              transform: 'translateY(-5px)',
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
          }}
        >
          <KeyboardArrowUp fontSize="medium" />
        </IconButton>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={5} sx={{justifyContent:'space-between'}}>
          {/* Company section */}
          <Grid item xs={12} sm={6} md={4} paddingLeft={5}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                color: themes.primary, 
                fontWeight: 700, 
                mb: 3,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  bgcolor: themes.primary,
                }
              }}
            >
              NOVA FRAMES
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 3, maxWidth: 300, lineHeight: 1.7 }}
            >
              We craft beautiful digital experiences and innovative solutions with a focus on quality, usability and performance.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <IconButton 
                href="https://facebook.com" 
                aria-label="Facebook" 
                size="small"
                sx={{ 
                  color: themes.primary,
                  '&:hover': { 
                    transform: 'translateY(-3px)',
                    bgcolor: `${themes.primary}10` 
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton 
                href="https://instagram.com" 
                aria-label="Instagram"
                size="small"
                sx={{ 
                  color: themes.primary,
                  '&:hover': { 
                    transform: 'translateY(-3px)',
                    bgcolor: `${themes.primary}10` 
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton 
                href="https://whatsapp.com" 
                aria-label="WhatsApp"
                size="small"
                sx={{ 
                  color: themes.primary,
                  '&:hover': { 
                    transform: 'translateY(-3px)',
                    bgcolor: `${themes.primary}10` 
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <WhatsApp fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links section */}
          <Grid item xs={12} sm={6} md={2} paddingLeft={5}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: themes.primary, 
                fontWeight: 700, 
                mb: 3,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  bgcolor: themes.primary,
                }
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink href="/user/terms-of-service">
                Terms of Service
              </FooterLink>
              <FooterLink href="/user/privacy-policy">
                Privacy Policy
              </FooterLink>
              <FooterLink href="/user/faq">
                FAQ
              </FooterLink>
            </Box>
          </Grid>

          {/* //Services section
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: themes.primary, 
                fontWeight: 700, 
                mb: 3,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  bgcolor: themes.primary,
                }
              }}
            >
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink href="/services/web-development">
                Web Development
              </FooterLink>
              <FooterLink href="/services/mobile-apps">
                Mobile Apps
              </FooterLink>
              <FooterLink href="/services/ui-ux-design">
                UI/UX Design
              </FooterLink>
              <FooterLink href="/services/consulting">
                Consulting
              </FooterLink>
              <FooterLink href="/services/support">
                Support
              </FooterLink>
            </Box>
          </Grid> */}

          {/* Contact section */}
          <Grid item xs={12} sm={6} md={4} paddingLeft={5}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: themes.primary, 
                fontWeight: 700, 
                mb: 3,
                position: 'relative',
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 40,
                  height: 3,
                  bgcolor: themes.primary,
                }
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FooterLink
                href="mailto:novaframesdev@gmail.com"
                icon={<Email fontSize="small" />}
              >
                novaframesdev@gmail.com
              </FooterLink>
              <FooterLink
                href="tel:+918637670543"
                icon={<Phone fontSize="small" />}
              >
                +91 8637670543
              </FooterLink>
            </Box>
            
            {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Subscribe to our newsletter
            </Typography>
            <Box 
              component="form" 
              sx={{ 
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: 1
              }}
            >
              <Box
                component="input"
                placeholder="Your email address"
                sx={{
                  flex: '1 1 auto',
                  border: `1px solid ${themes.primary}40`,
                  borderRadius: 1,
                  p: 1,
                  outline: 'none',
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  '&:focus': {
                    borderColor: themes.primary,
                  }
                }}
              />
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: themes.primary,
                  color: '#fff',
                  '&:hover': {
                    bgcolor: themes.primary,
                    opacity: 0.9,
                  }
                }}
              >
                Subscribe
              </Button>
            </Box> */}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: `${themes.primary}20` }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 Nova Frames. All Rights Reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography 
              variant="body2" 
              component="a" 
              href="/sitemap"
              sx={{ 
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { color: themes.primary }
              }}
            >
              Sitemap
            </Typography>
            <Typography 
              variant="body2" 
              component="a" 
              href="/accessibility"
              sx={{ 
                color: 'text.secondary', 
                textDecoration: 'none',
                '&:hover': { color: themes.primary }
              }}
            >
              Accessibility
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
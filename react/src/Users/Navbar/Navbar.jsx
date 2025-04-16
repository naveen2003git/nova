import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
  Container,
  Avatar,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  ListItemIcon,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Home,
  Info,
  ShoppingCart,
  ListAlt,
  Logout,
  Login,
  Person,
} from "@mui/icons-material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { auth } from "../../Utlies/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ThemeContext } from "../../ThemeContext/ThemeContext";

const Navbar = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const themes = useContext(ThemeContext)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const navLinks = [
    { text: "Home", path: "/", icon: <Home /> },
    { text: "About", path: "/user/about", icon: <Info /> },
    { text: "Cart", path: "/user/AddToCartPage", icon: <ShoppingCart /> },
    { text: "Orders", path: "/user/orders", icon: <ListAlt /> },
  ];

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await signOut(auth);
      navigate("/", { replace: true });
      window.location.reload();
      
    } catch (error) {
      console.error(error.message);
    }
  };
  

  const handleProfile = () => navigate("/user/profile");
  const handleLogin = () => navigate("/login");

  const navButtonStyle = {
    color: themes.text,
    fontWeight: 500,
    borderRadius: 2,
    px: 2,
    py: 1,
    transition: "0.3s",
    "&:hover": {
      backgroundColor: themes.background,
      color: themes.primary,
      transform: "scale(1.05)",
    },
  };

  return (
    <>
      <AppBar position="sticky" sx={{background: themes.primary}} elevation={4}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Left (Logo or Hamburger Menu) */}
            <Box display="flex" alignItems="center">
              {isMobile && (
                <IconButton color="inherit" onClick={toggleDrawer(true)}>
                  <MenuIcon />
                </IconButton>
              )}
              {!isMobile && (
                <Typography
                  variant="h5"
                  component={Link}
                  to="/"
                  sx={{ textDecoration: "none", color: "white", fontWeight: "bold" }}
                >
                  NovaZon
                </Typography>
              )}
            </Box>

            {/* Center (Logo for mobile) */}
            {isMobile && (
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{ textDecoration: "none", color: "white", fontWeight: "bold" }}
              >
                NovaZon
              </Typography>
            )}

            {/* Right (Links / User Icon) */}
            <Box display="flex" alignItems="center" gap={2}>
              {!isMobile &&
                navLinks.map((item) => (
                  <Button
                    key={item.text}
                    component={Link}
                    to={item.path}
                    sx={navButtonStyle}
                  >
                    {item.text}
                  </Button>
                ))}

              {user ? (
                <Tooltip title={user.email || "Account"}>
                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ p: 0 }}
                    aria-controls={menuAnchor ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={menuAnchor ? "true" : undefined}
                  >
                    <Avatar sx={{ bgcolor: "white", color: themes.primary }}>
                      <AccountCircle />
                    </Avatar>
                  </IconButton>

                </Tooltip>
              ) : (
                <Button onClick={handleLogin} sx={navButtonStyle}>
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>

        {/* Profile Menu */}
        <Menu
          id="account-menu"
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleProfile}>
            <ListItemIcon><Person /></ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><Logout /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ p: 2, fontWeight: "bold" }}>
            MyShop Menu
          </Typography>
          <Divider />
          <List>
            {navLinks.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    "&:hover": {
                      backgroundColor: themes.primary,
                      color: themes.text,
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>

      <Outlet />
    </>
  );
};

export default Navbar;

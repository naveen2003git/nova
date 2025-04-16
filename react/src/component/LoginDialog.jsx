// src/components/LoginDialog.js
import React, { useContext } from "react";
import { Dialog, Box, Typography, Button, Divider, Stack, Slide } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../Admin/ThemeContext/ThemeContext";

// Slide transition for smooth entrance
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LoginDialog = ({ open, onClose }) => {
  const navigate = useNavigate();
  const themes = useContext(ThemeContext);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Transition} // Added slide transition
    >
      <Box sx={{ p: 4 }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <LoginIcon sx={{color:themes.primary,fontSize: 40}} />
          <Typography variant="h6" fontWeight={600}>
            Login Required
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to save items to your cart and enjoy a smoother shopping experience.
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" sx={{color:themes.primary, borderColor:themes.primary}} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{color:themes.text, backgroundColor:themes.primary}}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default LoginDialog;

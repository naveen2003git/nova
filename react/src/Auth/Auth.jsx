import React, { useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../Utlies/firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  CircularProgress,
  ThemeProvider,
  IconButton
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { ThemeContext } from "../Admin/ThemeContext/ThemeContext";


const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const isSignup = tabValue === 1;
  const themes = useContext(ThemeContext);

  useEffect(() => {
    // Clear form when switching tabs
    setEmail("");
    setPassword("");
    setConPassword("");
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [tabValue]);

  const handleAuth = async () => {
    if (isSignup && password !== conPassword) {
      setError("Passwords don't match!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;

        if (role === "admin") {
          const adminDoc = await getDoc(doc(db, "admin", "mainAdmin"));
          if (adminDoc.exists()) {
            throw new Error("Admin already exists");
          }

          await setDoc(doc(db, "admin", "mainAdmin"), {
            uid,
            email,
            role: "admin",
            createdAt: serverTimestamp(),
          });

          navigate("/admin/dashboard");
        } else {
          await setDoc(doc(db, "users", uid), {
            uid,
            email,
            role: "user",
            createdAt: Date.now(),
          });

          navigate("/");
        }
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;

        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          navigate("/");
        } else {
          const adminDoc = await getDoc(doc(db, "admin", "mainAdmin"));
          if (adminDoc.exists() && adminDoc.data().uid === uid) {
            navigate("/admin/dashboard");
          } else {
            throw new Error("User role not found");
          }
        }
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: themes.background,
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "4px",
              backgroundColor: themes.primary,
            },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ mb: 3, color: themes.primary }}
          >
            {isSignup ? "Create Account" : "Welcome Back"}
          </Typography>

          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{
              mb: 4,
              "& .MuiTabs-indicator": {
                backgroundColor: themes.primary, // Underline color
              },
            }}
          >
            <Tab
              label="Sign In"
              sx={{
                color: themes.primary,
                "&.Mui-selected": {
                  color: themes.primary, // Active tab text color
                  fontWeight: "bold",     // Optional: make it stand out
                },
              }}
            />
            <Tab
              label="Sign Up"
              sx={{
                color: themes.primary,
                "&.Mui-selected": {
                  color: themes.primary,
                  fontWeight: "bold",
                },
              }}
            />
          </Tabs>


          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAuth(); }} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: themes.primary }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {isSignup && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                value={conPassword}
                onChange={(e) => setConPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
            )}


            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                color: themes.text,
                backgroundColor: themes.primary
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isSignup ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </Button>

            {!isSignup && (
              <Box textAlign="center" mt={1}>
                <Button
                  onClick={handleResetPassword}
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    color: themes.primary,
                    borderColor: themes.primary,
                    borderRadius: 2,
                    p: 2,
                    fontWeight: 500,
                    transition: "all 0.3s ease",
                    '&:hover': {
                      backgroundColor: `${themes.primary}10`,
                    },
                  }}
                >
                  Forgot password?
                </Button>

              </Box>
            )}

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault(); // Prevents page jump
                    setTabValue(isSignup ? 0 : 1);
                  }}
                  style={{
                    color: themes.primary,
                    marginLeft: '8px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    textTransform: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </a>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Auth;
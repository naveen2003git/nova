// Same imports (no change)
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
  IconButton
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { ThemeContext } from "../ThemeContext/ThemeContext";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const isSignup = tabValue === 1;
  const themes = useContext(ThemeContext);

  useEffect(() => {
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
        background: `linear-gradient(135deg, ${themes.primary}22, ${themes.primary}44)`,
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            backdropFilter: "blur(12px)",
            backgroundColor: "#ffffffcc",
            p: 5,
            borderRadius: 5,
            boxShadow: `0 8px 24px ${themes.primary}33`,
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${themes.primary}22`
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ color: themes.primary, fontWeight: 600, mb: 2 }}
          >
            {isSignup ? "Create Account" : "Welcome Back"}
          </Typography>

          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            centered
            textColor="primary"
            indicatorColor="primary"
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: "16px",
              }
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Sign Up" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleAuth();
            }}
          >
            <TextField
              label="Email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
              sx={{ borderRadius: 2 }}
            />

            <TextField
              label="Password"
              fullWidth
              required
              margin="normal"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {isSignup && (
              <TextField
                label="Confirm Password"
                fullWidth
                required
                margin="normal"
                type={showConfirmPassword ? "text" : "password"}
                value={conPassword}
                onChange={(e) => setConPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                backgroundColor: themes.primary,
                color: "#fff",
                borderRadius: 3,
                "&:hover": {
                  backgroundColor: `${themes.primary}dd`,
                  boxShadow: `0 0 12px ${themes.primary}55`,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isSignup ? "Create Account" : "Sign In"}
            </Button>

            {!isSignup && (
              <Box mt={2} textAlign="center">
                <Button
                  variant="text"
                  onClick={handleResetPassword}
                  sx={{
                    fontSize: "0.9rem",
                    color: themes.primary,
                    textTransform: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot Password?
                </Button>
              </Box>
            )}

            <Box mt={4} textAlign="center">
              <Typography variant="body2">
                {isSignup ? "Already have an account?" : "Don't have an account?"}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setTabValue(isSignup ? 0 : 1);
                  }}
                  style={{
                    color: themes.primary,
                    marginLeft: 8,
                    fontWeight: "bold",
                    cursor: "pointer",
                    textDecoration: "none",
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

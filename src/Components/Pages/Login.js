import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const FONT = "'Poppins', sans-serif";

// ─── Theme ────────────────────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#6366F1" },
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
    text: { primary: "#0F172A", secondary: "#64748B" },
  },
  typography: {
    fontFamily: FONT,
  },
  shape: { borderRadius: 12 },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: { fontFamily: FONT },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: FONT,
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
          fontSize: 14,
          letterSpacing: 0.2,
          height: 46,
          background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
          boxShadow: "0 4px 24px rgba(99,102,241,0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #4338CA 0%, #4F46E5 100%)",
            boxShadow: "0 6px 28px rgba(99,102,241,0.45)",
          },
          "&.Mui-disabled": { opacity: 0.55 },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small", fullWidth: true },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            fontFamily: FONT,
            backgroundColor: "#F1F5F9",
            borderRadius: 10,
            fontSize: 14,
            "& fieldset": { borderColor: "#E2E8F0" },
            "&:hover fieldset": { borderColor: "#CBD5E1" },
            "&.Mui-focused fieldset": {
              borderColor: "#6366F1",
              boxShadow: "0 0 0 3px rgba(99,102,241,0.12)",
            },
          },
          "& input": { fontFamily: FONT },
          "& input::placeholder": { color: "#94A3B8", opacity: 1 },
          "& .MuiInputAdornment-root svg": { fontSize: 18, color: "#94A3B8" },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { fontFamily: FONT },
        message: { fontFamily: FONT },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: { fontFamily: FONT },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { fontFamily: FONT },
      },
    },
  },
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogin = async () => {
    const payload = {
      employeeemail: email,
      password: password,
    };
    setLoading(true);
    await axios
      .post("http://10.10.0.108:8080/login", payload)
      .then((res) => {
        console.log(res.data);
        // alert(res.data.message);
        if (res.data.message !== "Invalid email or password") {
          sessionStorage.setItem("employeeId", res.data.employeeId);
          sessionStorage.setItem("departmentId", res.data.departmentId);
          sessionStorage.setItem("roleId", res.data.roleId);
          sessionStorage.setItem("portal_role", res.data.employeeRole);
          sessionStorage.setItem("employeeName", res.data.employeeName);

          if (res.data.employeeRole == "Admin") {
            navigate("/Users");
            window.location.reload();
          } else {
            navigate("/TaskMainPage");
            window.location.reload();
          }
        } else {
          setErrorMessage(res.data.message);
          setOpenDialog(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response?.data?.message || "Something went wrong");
        setOpenDialog(true);
        setLoading(false);

        // alert("Email or Password are incorrect!");
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          fontFamily: FONT,
          bgcolor: "#F8FAFC",
        }}
      >
        {/* ── LEFT BRAND PANEL ── */}
        <Box
          sx={{
            width: { xs: "100%", md: "60%" },
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: "48px 56px",
            background:
              "linear-gradient(160deg, #1E2A3A 0%, #1A2436 50%, #162030 100%)",
            borderRight: "none",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 520,
              height: 520,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
              top: -120,
              left: -160,
              pointerEvents: "none",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
              bottom: -100,
              right: -80,
              pointerEvents: "none",
            },
          }}
        >
          {/* Logo */}
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 8 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AccessTimeOutlinedIcon sx={{ color: "#fff", fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#E2E8F0",
                    letterSpacing: "-0.3px",
                  }}
                >
                  TimeTrack Pro
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONT,
                    fontSize: 11,
                    color: "#64748B",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Enterprise Edition
                </Typography>
              </Box>
            </Box>

            {/* Headline */}
            <Typography
              component='h1'
              sx={{
                fontFamily: FONT,
                fontSize: 36,
                fontWeight: 700,
                color: "#E2E8F0",
                lineHeight: 1.25,
                letterSpacing: "-0.8px",
                mb: 2,
              }}
            >
              Every hour,
              <br />
              <Box
                component='span'
                sx={{
                  fontFamily: FONT,
                  background: "linear-gradient(90deg, #A5B4FC, #7DD3FC)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                accounted for.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontFamily: FONT,
                fontSize: 14,
                color: "#94A3B8",
                lineHeight: 1.7,
                maxWidth: 340,
              }}
            >
              A single platform for timesheets, approvals, and workforce
              reporting — built for teams that need precision without friction.
            </Typography>
          </Box>

          {/* Stats */}
          <Box
            sx={{ display: "flex", gap: 5, position: "relative", zIndex: 1 }}
          >
            {[
              { value: "24/7", label: "System availability" },
              { value: "< 1 min", label: "Average request processing" },
              { value: "100%", label: "Digital workflows" },
            ].map((s, i) => (
              <Box
                key={i}
                sx={{ display: "flex", gap: 5, alignItems: "stretch" }}
              >
                {i > 0 && (
                  <Box
                    sx={{
                      width: "1px",
                      background: "rgba(255,255,255,0.1)",
                      alignSelf: "stretch",
                      mr: -3,
                    }}
                  />
                )}
                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONT,
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#E2E8F0",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {s.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONT,
                      fontSize: 11,
                      fontWeight: 500,
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                    }}
                  >
                    {s.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── RIGHT FORM PANEL ── */}
        <Box
          sx={{
            width: { xs: "100%", md: "40%" },
            flexShrink: 0,
            minHeight: { xs: "100vh", md: "unset" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: "32px 24px", md: "48px 40px" },
            bgcolor: "#F8FAFC",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 360,
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6366F1",
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  mb: 1.2,
                }}
              >
                Secure Sign-in
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONT,
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#0F172A",
                  letterSpacing: "-0.4px",
                  mb: 0.75,
                }}
              >
                Welcome back
              </Typography>
              <Typography
                sx={{ fontFamily: FONT, fontSize: 13, color: "#64748B" }}
              >
                Use your corporate credentials to continue
              </Typography>
            </Box>

            {/* Error */}
            {error && (
              <Alert
                severity='error'
                sx={{
                  mb: 2,
                  fontSize: 13,
                  fontFamily: FONT,
                  borderRadius: "8px",
                  bgcolor: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#FCA5A5",
                  "& .MuiAlert-icon": { color: "#FCA5A5" },
                  "& .MuiAlert-message": { fontFamily: FONT },
                }}
              >
                {error}
              </Alert>
            )}

            {/* Email */}
            <Box sx={{ mb: 2 }}>
              <Typography
                component='label'
                sx={{
                  fontFamily: FONT,
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                  mb: 0.75,
                }}
              >
                Work Email
              </Typography>
              <TextField
                type='email'
                placeholder='you@company.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete='email'
                inputProps={{ style: { fontFamily: FONT } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <EmailOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ mb: 0.5 }}>
              <Typography
                component='label'
                sx={{
                  fontFamily: FONT,
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                  mb: 0.75,
                }}
              >
                Password
              </Typography>
              <TextField
                type={showPw ? "text" : "password"}
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete='current-password'
                inputProps={{ style: { fontFamily: FONT } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => setShowPw((v) => !v)}
                        edge='end'
                        size='small'
                        sx={{ color: "#94A3B8" }}
                      >
                        {showPw ? (
                          <VisibilityOffOutlinedIcon fontSize='small' />
                        ) : (
                          <VisibilityOutlinedIcon fontSize='small' />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Forgot password */}
            <Box sx={{ textAlign: "right", mb: 2.5 }}>
              <Link
                href='/forgot-password'
                underline='hover'
                sx={{ fontFamily: FONT, fontSize: 12, color: "#6366F1" }}
              >
                Forgot password?
              </Link>
            </Box>

            {/* Submit */}
            <Button
              fullWidth
              variant='contained'
              onClick={handleLogin}
              disabled={loading}
              disableElevation
              sx={{ fontFamily: FONT }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontFamily: FONT,
                  }}
                >
                  <CircularProgress size={16} sx={{ color: "#fff" }} />
                  <Typography
                    sx={{
                      fontFamily: FONT,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    Signing in…
                  </Typography>
                </Box>
              ) : (
                "Sign in"
              )}
            </Button>

            {/* Footer */}
            <Typography
              sx={{
                fontFamily: FONT,
                mt: 3.5,
                textAlign: "center",
                fontSize: 12,
                color: "#94A3B8",
                lineHeight: 1.7,
              }}
            >
              Having trouble?{" "}
              <Link
                href='mailto:it@company.com'
                underline='hover'
                sx={{ fontFamily: FONT, color: "#818CF8" }}
              >
                Contact IT Support
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Login Failed</DialogTitle>

        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} variant='contained'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

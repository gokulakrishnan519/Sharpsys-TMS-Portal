import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DoneIcon from "@mui/icons-material/Done";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const FONT = "'Poppins', sans-serif";
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

// ---------- OtpInput component ----------
function OtpInput({ length = 6, onComplete }) {
  const [values, setValues] = useState(Array(length).fill(""));
  const inputsRef = useRef([]);

  const focusInput = (idx) => {
    if (idx >= 0 && idx < length) inputsRef.current[idx]?.focus();
  };

  const handleChange = (idx, e) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    const next = [...values];
    next[idx] = val;
    setValues(next);

    if (val && idx < length - 1) {
      focusInput(idx + 1);
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !values[idx]) {
      focusInput(idx - 1);
    } else if (e.key === "ArrowLeft") {
      focusInput(idx - 1);
    } else if (e.key === "ArrowRight") {
      focusInput(idx + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length);
    const next = Array(length).fill("");
    text.split("").forEach((ch, i) => (next[i] = ch));
    setValues(next);
    focusInput(Math.min(text.length, length - 1));
    if (text.length === length) onComplete?.(text);
  };
  const otp = values.join("");

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", gap: 8 }}>
        {values.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            style={{
              width: 40,
              height: 48,
              textAlign: "center",
              fontSize: 20,
              border: "1px solid #ccc",
              borderRadius: 8,
            }}
          />
        ))}
      </div>
      <Button
        variant="contained"
        onClick={() => otp.length === length && onComplete(otp)}
        startIcon={<DoneIcon />}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          px: 3,
          py: 1,
          fontWeight: 600,
          mt: 2,
          background: "#ffc400",
        }}
      >
        Verify
      </Button>
    </ThemeProvider>
  );
}

// ---------- ForgetPassword component ----------
function ForgetPassword({ forgetPw }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  // password
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [showotpbar, setShowotpbar] = useState(false);

  // Validation helper
  const validatePasswords = (
    newPassword = password,
    newConfirmPassword = confirmPassword,
  ) => {
    if (!newPassword) {
      setPasswordError("Password is required");
      return false;
    }

    if (!newConfirmPassword) {
      setPasswordError("Confirm Password is required");
      return false;
    }

    if (newPassword !== newConfirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    setPasswordError("");
    return true;
  };

  // validate email
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmed = value.trim();
    if (!trimmed) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(trimmed)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  //otp generation API
  const otpgeneration = async () => {
    if (!validateEmail(email)) return;
    setErrorMessage("");
    const payload = { email: email.trim() };
    await axios
      .post("http://10.10.0.108:8000/auth/forgotpassword", payload)
      .then(() => {
        setMessage("Otp Sent!");
        setShowotpbar(true);
      })
      .catch((err) => {
        console.log(err);
        setMessage("");
        setErrorMessage(err.response?.data?.message || "Something went wrong");
      });
  };

  //verify otp API
  const handleOtpComplete = async (code) => {
    if (code.length !== 6) {
      setErrorMessage("Please enter the 6-digit OTP");
      return;
    }
    setErrorMessage("");
    const payload = {
      email: email.trim(),
      otp: code,
    };

    await axios
      .post("http://10.10.0.108:8000/auth/verifyotp", payload)
      .then((res) => {
        setMessage(res.data.message || "OTP verified");
        setShowotpbar(false);
        setShowPw(true);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response?.data?.detail || "Something went wrong");
      });
  };

  //reset API
  const reset = async () => {
    if (!validatePasswords(password, confirmPassword)) {
      return;
    }
    setErrorMessage("");
    const payload = {
      email: email.trim(),
      new_password: password,
    };
    await axios
      .post("http://10.10.0.108:8000/auth/resetpassword", payload)
      .then((res) => {
        setMessage(
          typeof res.data === "string"
            ? res.data
            : "Password reset successful!",
        );
        setPassword("");
        setConfirmPassword("");
        setShowPw(false);
        forgetPw();
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(err.response?.data?.message || "Something went wrong");
      });
  };

  return (
    <ThemeProvider theme={theme}>
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
            position: "absolute",
            top: 2,
            left: 2,
            p: 1,
            cursor: "pointer",
          }}
        >
          <Link
            onClick={() => {
              forgetPw();
            }}
          >
            <ArrowBackIcon />
          </Link>
        </Box>
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box sx={{ mb: 4 }}>
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
              Reset Password
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2, fontFamily: FONT }}>
              {errorMessage}
            </Alert>
          )}
          {message && !errorMessage && (
            <Alert severity="success" sx={{ mb: 2, fontFamily: FONT }}>
              {message}
            </Alert>
          )}

          {showotpbar ? (
            <OtpInput length={6} onComplete={handleOtpComplete} />
          ) : (
            !showPw && (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    component="label"
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
                    Enter Your Email
                  </Typography>
                  <TextField
                    type="email"
                    placeholder="Enter Your Registered Mail"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    onBlur={(e) => validateEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                    autoComplete="email"
                    fullWidth
                    inputProps={{ style: { fontFamily: FONT } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={otpgeneration}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Send OTP
                </Button>
              </Box>
            )
          )}

          {showPw && (
            <Box>
              {/* New Password */}
              <Box sx={{ mb: 2 }}>
                <Typography
                  component="label"
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
                  New Password
                </Typography>
                <TextField
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPassword(value);
                    if (confirmPassword) {
                      validatePasswords(value, confirmPassword);
                    }
                  }}
                  autoComplete="new-password"
                  inputProps={{ style: { fontFamily: FONT } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPw((v) => !v)}
                          edge="end"
                          size="small"
                          sx={{ color: "#94A3B8" }}
                        >
                          {showPw ? (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          ) : (
                            <VisibilityOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Confirm Password — sibling of New Password, not nested inside it */}
              <Box sx={{ mb: 0.5 }}>
                <Typography
                  component="label"
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
                  Confirm Password
                </Typography>
                <TextField
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfirmPassword(value);
                    validatePasswords(password, value);
                  }}
                  onBlur={() => validatePasswords(password, confirmPassword)}
                  error={!!passwordError}
                  helperText={passwordError}
                  autoComplete="new-password"
                  inputProps={{ style: { fontFamily: FONT } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPw((v) => !v)}
                          edge="end"
                          size="small"
                          sx={{ color: "#94A3B8" }}
                        >
                          {showConfirmPw ? (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          ) : (
                            <VisibilityOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Button
                variant="contained"
                onClick={reset}
                startIcon={<RestartAltIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  mt: 2,
                  background: "#7e57c2",
                }}
              >
                Reset
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default ForgetPassword;

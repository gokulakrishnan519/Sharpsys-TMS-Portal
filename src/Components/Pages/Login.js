import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6366F1" },
    background: { default: "#0F172A", paper: "#1E293B" },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

const DEMO_ID = "admin";
const DEMO_PW = "1234";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    const payload = {
      employeeemail: email,
      password: password,
    };

    await axios
      .post("http://10.10.0.47:7000/login", payload)
      .then((res) => {
        console.log(res.data);
        // alert(res.data.message);
        navigate("/Users");
      })
      .catch((err) => {
        console.log(err);
        // alert("Email or Password are incorrect!");
      });
    // navigate("/Users");

    // setError("");
    // setLoading(true);
    // await new Promise((r) => setTimeout(r, 1500));
    // setLoading(false);
    // if (employeeId === DEMO_ID && password === DEMO_PW) {
    //   alert("Login Success");
    // } else {
    //   setError("Invalid Employee ID or Password");
    // }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 360,
            background: "rgba(30,41,59,0.95)",
            borderRadius: "18px",
            border: "1px solid rgba(99,102,241,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Logo */}
            <Box textAlign="center" mb={3}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 1.5,
                }}
              >
                <AccessTimeOutlinedIcon sx={{ color: "#fff", fontSize: 26 }} />
              </Box>

              <Typography variant="h6" fontWeight={700} color="#fff">
                TimeTrack Pro
              </Typography>

              <Typography variant="body2" sx={{ color: "#94A3B8", mt: 0.5 }}>
                Timesheet Management
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "#CBD5E1", mb: 2 }}>
              Sign in to continue
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Employee ID */}
            <TextField
              fullWidth
              size="small"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlinedIcon
                      sx={{ color: "#64748B", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              fullWidth
              size="small"
              placeholder="Password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#64748B", fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw(!showPw)}>
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

            {/* Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: "10px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

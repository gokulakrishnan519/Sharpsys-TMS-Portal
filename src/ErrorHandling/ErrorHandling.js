import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WifiOffIcon from "@mui/icons-material/WifiOff";

export default function ErrorHandling() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Wifi Image */}
      <WifiOffIcon sx={{ fontSize: 120, color: "#9e9e9e", mb: 2 }} />

      <Typography
        variant='h3'
        fontWeight='bold'
        sx={{ fontFamily: "Poppins, sans-serif", color: "#2e2e2e" }}
      >
        {sessionStorage.getItem("errormessge")}
      </Typography>

      <Typography
        variant='h6'
        sx={{ mb: 2, fontFamily: "Poppins, sans-serif", color: "#2e2e2e" }}
      >
        Please check your internet connection and try again.
      </Typography>

      <Button
        variant='contained'
        onClick={() => navigate("/Users")}
        sx={{ fontFamily: "Poppins, sans-serif" }}
      >
        Refresh
      </Button>
    </Box>
  );
}

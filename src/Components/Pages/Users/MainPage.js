import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Navbar from "../../../Navbars/Navbar";
import BottomTablePage from "./BottomTablePage";
import UserContext from "../../../UseContext/UserContext";
import { useContext } from "react";

const stats = [
  {
    label: "Total Users",
    value: "-",
    iconBg: "#e0f4fb",
    iconColor: "#29b6d8",
    valuColor: "#29b6d8",
    cardBg: "#e8f7fc",
    borderColor: "#c5eaf5",
  },
  {
    label: "Active Clients",
    value: "-",
    iconBg: "#ede8f7",
    iconColor: "#9c7ed6",
    valuColor: "#9c7ed6",
    cardBg: "#f0eaf9",
    borderColor: "#ddd5f0",
  },
  {
    label: "Total Projects",
    value: "-",
    iconBg: "#fde8e8",
    iconColor: "#e05c5c",
    valuColor: "#e05c5c",
    cardBg: "#fff",
    borderColor: "#e8e8e8",
  },
  {
    label: "Avg Hours per Client",
    value: "-",
    iconBg: "#e0f4fb",
    iconColor: "#29b6d8",
    valuColor: "#29b6d8",
    cardBg: "#fff",
    borderColor: "#e8e8e8",
  },
];

function StatCard({ stat }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: `1.5px solid ${stat.borderColor}`,
        backgroundColor: stat.cardBg,
        position: "relative",
        overflow: "visible",
        pt: 3,
        minWidth: 150,
      }}
    >
      {/* Icon circle: 44px tall, top: -22px = exactly 50% outside, 50% inside */}
      <Box
        sx={{
          position: "absolute",
          top: -22,
          left: "50%",
          transform: "translateX(-50%)",
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: stat.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid ${stat.iconColor}33`,
          zIndex: 1,
        }}
      >
        <PersonIcon sx={{ color: stat.iconColor, fontSize: 24 }} />
      </Box>

      <CardContent
        sx={{
          textAlign: "center",
          pt: 2,
          pb: "16px !important",
          px: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 36,
            fontWeight: 700,
            color: stat.valuColor,
            lineHeight: 1.1,
            mb: 0.5,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {stat.value}
        </Typography>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 500,
            color: "#8a8fa8",
            lineHeight: 1.3,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {stat.label}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function MainPage() {
  const { Loading, setLoading } = useContext(UserContext);

  return (
    <div>
      {Loading ? (
        <Loading />
      ) : (
        <Navbar>
          <Box
            sx={{
              p: 2,
            }}
          >
            <Grid container spacing={3} justifyContent='center'>
              {stats.map((stat) => (
                <Grid item xs={12} sm={6} md={3} key={stat.label}>
                  <Box sx={{ pt: "22px" }}>
                    <StatCard stat={stat} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box
            sx={{
              p: 2,
            }}
          >
            <BottomTablePage />
          </Box>
        </Navbar>
      )}
    </div>
  );
}

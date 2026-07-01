import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import Navbar from "../../../Navbars/Navbar";
import BottomTablePage from "./BottomTablePage";
import UserContext from "../../../UseContext/UserContext";
import { useContext, useEffect, useState } from "react";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import WorkOutlineOutlined from "@mui/icons-material/WorkOutlineOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import Loading from "../../../Loading/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    label: "Total Users",
    key: "totalEmployees",
    // value: "-",
    iconBg: "#dbeeff",
    iconColor: "#185FA5",
    valueColor: "#185FA5",
    borderColor: "#185FA5",
    cardGradient: "linear-gradient(135deg, #B5D4F4 0%, #F0F7FF 100%)",
    accentColor: "#378ADD",
    Icon: PeopleAltOutlined,
  },
  {
    label: "Active Clients",
    key: "totalClients",
    // value: "-",
    iconBg: "#e8e6fd",
    iconColor: "#534AB7",
    valueColor: "#534AB7",
    borderColor: "#534AB7",
    cardGradient: "linear-gradient(135deg, #CECBF6 0%, #F5F3FF 100%)",
    accentColor: "#7F77DD",
    Icon: WorkOutlineOutlined,
  },
  {
    label: "Total Departments",
    key: "totalDepartments",
    // value: "-",
    iconBg: "#fde8e8",
    iconColor: "#993C1D",
    valueColor: "#993C1D",
    borderColor: "#993C1D",
    cardGradient: "linear-gradient(135deg, #F5C4B3 0%, #FFF5F2 100%)",
    accentColor: "#D85A30",
    Icon: BusinessOutlined,
  },
  {
    label: "Active Projects",
    key: "totalProjects",
    // value: "-",
    iconBg: "#d8f5ea",
    iconColor: "#0F6E56",
    valueColor: "#0F6E56",
    borderColor: "#0F6E56",
    cardGradient: "linear-gradient(135deg, #9FE1CB 0%, #F0FBF6 100%)",
    accentColor: "#1D9E75",
    Icon: AccountTreeIcon,
  },
];
function StatCard({ stat, value }) {
  const { Icon } = stat;
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "18px",
        // border: `1px solid ${stat.borderColor}26`,
        background: stat.cardGradient,
        position: "relative",
        overflow: "visible",
        pt: 3,
        minWidth: 160,
        boxShadow: `0 1px 2px rgba(16,24,40,0.04), 0 8px 20px -6px ${stat.borderColor}29`,
        transition: "transform 200ms ease, box-shadow 200ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `0 1px 2px rgba(16,24,40,0.06), 0 14px 28px -8px ${stat.borderColor}3D`,
        },
      }}
    >
      {/* Icon badge: floating, layered for depth rather than a flat outline */}
      <Box
        sx={{
          position: "absolute",
          top: -22,
          left: "50%",
          transform: "translateX(-50%)",
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 0 4px ${stat.cardGradient ? "#ffffff" : "#fff"}, 0 4px 10px -2px ${stat.borderColor}40, 0 2px 4px rgba(16,24,40,0.06)`,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: stat.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon sx={{ color: stat.iconColor, fontSize: 18 }} />
        </Box>
      </Box>

      <CardContent
        sx={{
          textAlign: "center",
          pt: 2.5,
          pb: "18px !important",
          px: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 34,
            fontWeight: 600,
            color: stat.valueColor,
            lineHeight: 1.1,
            mb: 0.5,
            letterSpacing: "-0.02em",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            fontSize: 12.5,
            fontWeight: 500,
            color: "#6B7280",
            lineHeight: 1.3,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {stat.label}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function TaskMainPage() {
  const { loading, setLoading } = useContext(UserContext);
  const [value, setValue] = useState({});

  const navigate = useNavigate();

  const fetchTotalvalues = async () => {
    setLoading(true);
    await axios
      .get("http://10.10.0.108:8000/homekpis")
      .then((res) => {
        console.log(res.data);
        setValue(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        navigate("/ErrorHandling");
      });
  };
  useEffect(() => {
    fetchTotalvalues();
  }, []);

  const handleLoadingFalse = () => {
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Navbar>
          <Box
            sx={{
              p: 2,
            }}
          >
            <Grid container spacing={3} justifyContent='center'>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={stat.label}>
                  <Box sx={{ pt: "22px" }}>
                    <StatCard stat={stat} value={value[stat.key] ?? "-"} />
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
            <BottomTablePage handleLoadingFalse={handleLoadingFalse} />
          </Box>
        </Navbar>
      )}
    </div>
  );
}

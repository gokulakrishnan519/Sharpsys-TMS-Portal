// import Gridcard from "../Gridcard";
import Gridcard from "./Gridcard";
import AddIcon from "@mui/icons-material/Add";
import Projectform from "./Projectform";
import orange from "../../../Images/orangeicon.png";
import purple from "../../../Images/purpleicon.png";
import green from "../../../Images/greenicon.png";
import Topcard from "./Topcard";
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import WorkOutlineOutlined from "@mui/icons-material/WorkOutlineOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import Loading from "../../../Loading/Loading";
import UserContext from "../../../UseContext/UserContext";
import React from "react";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  CardContent,
  Dialog,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../../Navbars/Navbar";
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
    label: "Total Projects",
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
        borderRadius: "16px",
        border: `1px solid ${stat.borderColor}33`,
        background: stat.cardGradient,
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
          border: `1px solid ${stat.iconColor}33`,
          zIndex: 1,
        }}
      >
        <Icon sx={{ color: stat.iconColor, fontSize: 24 }} />
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
            fontWeight: 500,
            color: stat.valueColor,
            lineHeight: 1.1,
            mb: 0.5,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {value}
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
function Success({ handleClose }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 4,
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "#f0fdf4",
            border: "2px solid #bbf7d0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
        >
          ✅
        </Box>

        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "15px",
            fontWeight: 600,
            color: "#16a34a",
          }}
        >
          Project Successfully Created!
        </Typography>

        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "13px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Go Back to Project Page
        </Typography>
        <Button
          onClick={handleClose}
          variant='contained'
          sx={{
            mt: 2,
            minWidth: 100,
            height: 38,
            borderRadius: "8px",
            textTransform: "none",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            backgroundColor: "#16a34a",
            boxShadow: "none",

            "&:hover": {
              backgroundColor: "#15803d",
              boxShadow: "none",
            },
          }}
        >
          OK
        </Button>
      </Box>
    </>
  );
}
function ProjectsPage() {
  // const [count, setCount] = useState(0);
  const [value, setValue] = useState([]);
  const navigate = useNavigate();
  const fetchTotalvalues = async () => {
    await axios
      .get("http://10.10.0.108:8000/homekpis")
      .then((res) => {
        console.log(res.data);
        setValue(res.data);
      })
      .catch((err) => {
        console.log(err);
        navigate("/ErrorHandling");
      });
  };
  useEffect(() => {
    fetchTotalvalues();
  }, []);

  const [open, setOpen] = useState(false);
  const [prjdetails, setPrjdetails] = useState([]);
  const [mode, setMode] = useState("add");
  const [selectedProject, setSelectedProject] = useState(null);
  const { loading, setLoading } = React.useContext(UserContext);
  // const navigate = useNavigate();
  const handleEdit = (project) => {
    console.log("Editing Project:", project);

    setSelectedProject(project);
    setMode("edit");
    setOpen(true);
  };
  // const handleAdd = () => {
  //   setSelectedProject(null);
  //   setMode("add");
  //   setOpen(true);
  // };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchProjectdetails = async () => {
    setLoading(true);
    await axios
      .get("http://10.10.0.108:8000/project/projectdetails")
      .then((res) => {
        console.log(res.data.projects);
        setPrjdetails(res.data.projects);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        navigate("/ErrorHandling");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjectdetails();
  }, []);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Navbar>
            {/* Main content */}
            <div style={{ width: "100%" }}>
              {/* <Typography
            variant='h6'
            sx={{
              fontFamily: "'Poppins', sans-serif",
              mt: 2,
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "#f5f7fb",
              p: 0.5,
            }}
          >
            Projects
          </Typography> */}
              {/* <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              padding: 20,
              gap: 8,
              backgroundColor: "white",
              marginTop: 55,
              // width: "50%",
              marginLeft: 14,
            }}
          >
            <Topcard
              num={24}
              title={"Total Users"}
              bgcolor="linear-gradient(135deg, #99dbf0, #99f7d4)"
              color={"#066770"}
              icon={green}
            />
            <Topcard
              num={30}
              title={"Active client"}
              bgcolor={"#f4ebf7"}
              color={"#815f8c"}
              icon={purple}
            />
            <Topcard
              num={21}
              title={"Total Projects "}
              bgcolor={"white"}
              color={"#d9753b"}
              icon={orange}
            />
            <Topcard
              num={18}
              title={"Avg Hour Per Client"}
              bgcolor={"white"}
              color={"#07d1f0"}
              icon={green}
            />
          </div> */}
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
                  paddingX: 3,
                  paddingBottom: 3,
                  backgroundColor: "white",
                  borderRadius: 5,
                  marginTop: 3,
                  marginX: 2,
                  // width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    // padding: "10px",
                    alignItems: "center",
                    borderRadius: "15px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Ongoing Projects
                  </h2>
                  <Button
                    onClick={handleOpen}
                    sx={{
                      color: "white",
                      background: "#ff2d55",
                      borderRadius: "12px",
                      px: 2.2,
                      py: 0.8,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      fontFamily: "Poppins, sans-serif",
                      boxShadow: "none",

                      "&:hover": {
                        background: "#e3264b",
                        boxShadow: "none",
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: "1rem" }} />
                    New Project
                  </Button>
                </div>

                <Box
                  sx={{
                    display: "grid",
                    // gridTemplateColumns: "1fr 1fr",
                    columnGap: "15px",
                    rowGap: "10px",
                    gridTemplateColumns: {
                      xs: "1fr",
                      // sm: "1fr 1fr",
                      md: "1fr 1fr ",
                      lg: "1fr 1fr",
                    },
                  }}
                >
                  {prjdetails.map((prj) => (
                    <Gridcard
                      key={prj.ProjectID}
                      project={prj}
                      title={prj.ProjectName}
                      priority={prj.Priority}
                      s_date={prj.StartDate}
                      e_date={prj.EndDate}
                      client={prj.ClientName}
                      project_manager={prj.ProjectLead}
                      sla={prj.SLAConfiguration}
                      assigned={prj.AssignedTo}
                      onEdit={handleEdit}
                    />
                  ))}
                </Box>

                {/* <Gridcard title={"Vendor Portal"} p_value={"85"} />
            <Gridcard title={"Vendor admin Portal"} p_value={"23"} />
            <Gridcard title={"Sharp Desk"} p_value={"65"} /> */}
              </Box>
            </div>
            <Projectform
              open={open}
              handleClose={handleClose}
              selectedProject={selectedProject}
              mode={mode}
              refreshProjects={fetchProjectdetails}
              onSuccess={() => setShowSuccess(true)}
            />
            <Dialog
              open={showSuccess}
              onClose={() => setShowSuccess(false)}
              maxWidth='xs'
              fullWidth
            >
              {/* <Success onClose={() => setShowSuccess(false)} /> */}
              <Success handleClose={() => setShowSuccess(false)} />
            </Dialog>
          </Navbar>
        </>
      )}
    </div>
  );
}

export default ProjectsPage;

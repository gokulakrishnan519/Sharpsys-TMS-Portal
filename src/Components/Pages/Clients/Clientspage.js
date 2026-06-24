import orange from "../../../Images/orangeicon.png";
import purple from "../../../Images/purpleicon.png";
import green from "../../../Images/greenicon.png";
import Topcard from "../Clients/Topcard";
import UserContext from "../../../UseContext/UserContext";
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../../Loading/Loading";
// import UserContext from "../../../UseContext/UserContext";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  Grid,
  CardContent,
  Dialog,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Clientform from "./Clientform";
// import { useState } from "react";
// import ClientTable from "./ClientTable";
import Navbar from "../../../Navbars/Navbar";
import PersonIcon from "@mui/icons-material/Person";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import WorkOutlineOutlined from "@mui/icons-material/WorkOutlineOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";

// import { Box, Typography, Avatar, Button } from "@mui/material";

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
          Client Successfully Created!
        </Typography>

        <Typography
          sx={{
            fontFamily: "Poppins",
            fontSize: "13px",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Go Back to Client Page
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

function Clientpage() {
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState([]);
  // const navigate = useNavigate();
  const { loading, setLoading } = React.useContext(UserContext);
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

  // Fetch Data
  const fetchClients = async () => {
    setLoading(true);
    await axios
      .get("http://10.10.0.108:8000/clientlist")
      .then((res) => {
        console.log(res.data);

        setClient(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        navigate("/ErrorHandling");
      });
  };

  // Runs Once When Component Loads
  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [showSuccess, setShowSuccess] = useState(false);
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Navbar>
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
            Clients
          </Typography> */}
              {/* <Box
            style={{
              display: "flex",
              flexWrap: "wrap",
              padding: 20,
              gap: 8,
              backgroundColor: "white",
              marginTop: 80,
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
          </Box> */}

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
                  // padding: 3,
                  backgroundColor: "white",
                  borderRadius: 3,
                  marginTop: 3,
                  marginX: 2,
                  // marginRight: 3,
                  // justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    // paddingX: "10px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    alignItems: "center",
                    // px: 3,
                    // py: 2,
                  }}
                >
                  <h2
                    style={{
                      fontSize: "20px",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Clients
                  </h2>
                  <Button
                    onClick={handleOpen}
                    sx={{
                      color: "white",
                      background: "#ff2d55",
                      borderRadius: "10px",
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
                    New Clients
                  </Button>
                </div>
                {/* <ClientTable /> */}
                <TableContainer
                  component={Paper}
                  sx={{
                    width: "100%",
                    overflowX: "auto",
                    boxShadow: "none",
                  }}
                >
                  <Table
                    size='small'
                    sx={{
                      minWidth: { xs: 400, sm: 500, md: "100%" }, // adjust as needed
                      "& .MuiTableCell-root": {
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: {
                          xs: "10px",
                          sm: "11px",
                          md: "12px",
                        },
                        whiteSpace: "nowrap", // prevents content wrapping
                        py: { xs: 0.5, sm: 1 },
                      },
                    }}
                  >
                    {/* Header */}
                    <TableHead sx={{ backgroundColor: "#f5f7fb" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Company Name
                        </TableCell>

                        <TableCell
                          align='center'
                          sx={{
                            fontWeight: 600,
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Industry
                        </TableCell>

                        <TableCell
                          align='center'
                          sx={{
                            fontWeight: 600,
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Email
                        </TableCell>

                        <TableCell
                          align='center'
                          sx={{
                            fontWeight: 600,
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Contact Person
                        </TableCell>

                        <TableCell
                          align='center'
                          sx={{
                            fontWeight: 600,
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Phone Number
                        </TableCell>

                        <TableCell
                          align='center'
                          sx={{
                            fontWeight: 600,
                            borderRight: "1px solid #e5e7eb",
                          }}
                        >
                          Location
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    {/* Body */}
                    <TableBody>
                      {client.map((item) => (
                        <TableRow key={item.ClientID}>
                          <TableCell>{item.CompanyName}</TableCell>

                          <TableCell align='center'>{item.Industry}</TableCell>

                          <TableCell align='center'>{item.Email}</TableCell>

                          <TableCell align='center'>
                            {item.ContactPerson}
                          </TableCell>

                          <TableCell align='center'>
                            {item.PhoneNumber}
                          </TableCell>

                          <TableCell align='center'>{item.Location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </div>
            <Clientform
              open={open}
              handleClose={handleClose}
              refreshClient={fetchClients}
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

export default Clientpage;

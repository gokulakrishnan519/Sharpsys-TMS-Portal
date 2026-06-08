// import React from "react";
import Topcard from "./Topcard";

import orange from "../../../Images/orangeicon.png";
import purple from "../../../Images/purpleicon.png";
import green from "../../../Images/greenicon.png";
import Charts from "./Charts";

import React from "react";
import {
  Avatar,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Progress from "./Progress";
import Gridcard from "../Projects/Gridcard";
import Navbar from "../../../Navbars/Navbar";

const avatarThemes = [
  { bg: "#FCE4EC", text: "#C2185B" },
  { bg: "#F3E5F5", text: "#7B1FA2" },
  { bg: "#E3F2FD", text: "#1976D2" },
  { bg: "#E0F2F1", text: "#00796B" },
  { bg: "#E8F5E9", text: "#388E3C" },
  { bg: "#FFF8E1", text: "#F57F17" },
  { bg: "#FBE9E7", text: "#D84315" },
  { bg: "#EFEBE9", text: "#5D4037" },
];

const getAvatarTheme = (name) => {
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarThemes.length;

  return avatarThemes[index];
};

const name1 = "Benita Rebacal";
const name2 = "Gokulakrishnan ";
function Dashboard(props) {
  return (
    <>
      <Navbar>
        <Typography
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
          Dashboard
        </Typography>
        <Box
          sx={{
            p: 2,
            height: "auto",
            boxShadow: "none",
            mt: 2,
          }}
        >
          <Grid container spacing={2} sx={{ height: "100%" }}>
            {/* LEFT COLUMN */}
            <Grid size={8}>
              <Grid
                container
                direction='column'
                spacing={2}
                sx={{ height: "100%" }}
              >
                {/* TOP BOX */}
                <Grid size={12} sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      padding: 2,
                      gap: 1,
                      backgroundColor: "white",
                      // width: "95%",
                      borderRadius: "12px",
                    }}
                  >
                    <Topcard
                      num={843}
                      title={"Billable hrs(MTD) "}
                      bgcolor='linear-gradient(135deg, #99dbf0, #99f7d4)'
                      color={"#066770"}
                      icon={green}
                    />
                    <Topcard
                      num={72}
                      title={"Utilization Rate "}
                      bgcolor={"#f4ebf7"}
                      color={"#066770"}
                      icon={purple}
                    />
                    <Topcard
                      num={3}
                      title={"SLA Branches "}
                      bgcolor='white'
                      color={"#066770"}
                      icon={orange}
                    />
                    <Topcard
                      num={11}
                      title={"Pending Approvals "}
                      bgcolor='white'
                      color={"#066770"}
                      icon={green}
                    />
                    <Topcard
                      num={74}
                      title={"Utilization Rate "}
                      bgcolor='white'
                      color={"#066770"}
                      icon={purple}
                    />
                  </Box>
                </Grid>

                {/* MIDDLE BOX */}
                <Grid
                  sx={{
                    flex: 2,
                    // border: "1px solid gray",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    // height: "70%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mx: 2,
                      mt: 1,
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Active Project
                    </Typography>
                    <Typography variant='caption'>
                      <a href='#'>View all project</a>
                    </Typography>
                  </Box>
                  <Box sx={{ padding: 1 }}>
                    <Box
                      sx={{
                        borderBottom: "1px solid lightgray",
                        padding: 2,
                      }}
                    >
                      {" "}
                      <Typography
                        variant='p'
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        Gate Entry
                      </Typography>
                      <Progress
                        p_value={80}
                        default_text={"SLA 7d / 2d Left"}
                        priority={"On Track"}
                        height={25}
                        gradient='linear-gradient(to right, #16abf0, #05f4cc92)'
                      />
                    </Box>
                    <Box
                      sx={{ borderBottom: "1px solid lightgray", padding: 2 }}
                    >
                      <Typography
                        variant='p'
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Vendor Portal
                      </Typography>
                      <Progress
                        p_value={70}
                        height={25}
                        default_text={"SLA 7d / 2d Left"}
                        priority={"Delayed"}
                        gradient='linear-gradient(to right, #ee5d14, #ffcc99)'
                      />
                    </Box>
                    <Box
                      sx={{ borderBottom: "1px solid lightgray", padding: 2 }}
                    >
                      <Typography
                        variant='p'
                        sx={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Vendor Admin Portal
                      </Typography>{" "}
                      <Progress
                        p_value={50}
                        height={25}
                        default_text={"SLA 7d / 2d Left"}
                        priority={"At Risk"}
                        gradient='linear-gradient(to right, #d4aafb, #d8b4fe)'
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* BOTTOM BOX */}
                <Grid
                  sx={{
                    flex: 1.3,
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: 1,
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{ fontFamily: "'Poppins', sans-serif", padding: "5px" }}
                  >
                    Team Utilization
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      padding: 1,
                    }}
                  >
                    <Box sx={{ width: "50%" }}>
                      {" "}
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Avatar
                          sx={{
                            backgroundColor: getAvatarTheme(name1).bg,
                            color: getAvatarTheme(name1).text,
                            height: "20px",
                            width: "20px",
                            fontSize: "10px",
                          }}
                        >
                          {name1
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()}
                        </Avatar>
                        <Typography>{name1}</Typography>
                      </Box>
                      <Progress
                        p_value={75}
                        height={10}
                        // default_text={"SLA 7d / 2d Left"}
                        gradient='linear-gradient(to right, #33cccc, #ccccff)'
                      />
                    </Box>
                    <Box sx={{ width: "50%" }}>
                      {" "}
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Avatar
                          sx={{
                            backgroundColor: getAvatarTheme(name2).bg,
                            color: getAvatarTheme(name2).text,
                            height: "20px",
                            width: "20px",
                            fontSize: "10px",
                          }}
                        >
                          {name2
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()}
                        </Avatar>
                        <Typography>{name2}</Typography>
                      </Box>
                      <Progress
                        p_value={75}
                        height={10}
                        // default_text={"SLA 7d / 2d Left"}
                        gradient='linear-gradient(to right, #33cccc, #ccccff)'
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            {/* RIGHT COLUMN */}
            <Grid size={4}>
              <Grid
                container
                direction='column'
                spacing={2}
                sx={{ height: "100%" }}
              >
                {/* TOP RIGHT */}
                <Grid sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      // width: "95%",
                      // padding: 1,
                      backgroundColor: "white",
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        paddingTop: 2,
                        // paddingLeft: 1,
                      }}
                    >
                      Billable VS Non Billable
                    </Typography>
                    <Charts />
                  </Box>
                </Grid>

                {/* BOTTOM RIGHT */}
                <Grid
                  sx={{
                    flex: 1.4,
                    borderRadius: "10px",
                    backgroundColor: "white",
                    p: 1,
                  }}
                >
                  <Typography
                    variant='h5'
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    SLA Breach Alert
                  </Typography>
                  <Box
                    sx={{
                      border: "1px solid red",
                      p: 1,
                      borderRadius: "10px",
                      margin: 1,
                      // height: "auto",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
                        {" "}
                        Gate Entry
                      </Typography>
                      <Typography
                        // variant="caption"
                        sx={{
                          backgroundColor: "#fdceceec",
                          color: "#FF2D2D",
                          padding: 0.5,
                          width: "60px",
                          borderRadius: "12px",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "10px",
                          textAlign: "center",
                          fontWeight: 500,
                        }}
                      >
                        At Risk
                      </Typography>
                    </Box>
                    <TableContainer sx={{ marginTop: 1 }}>
                      <Table size='small'>
                        <TableBody>
                          <TableRow
                            sx={{
                              "& td": {
                                borderBottom: "none",
                                padding: "4px 8px",
                                fontSize: "10px",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 500,
                                fontFamily: "'Poppins', sans-serif",
                              }}
                            >
                              Project Manager
                            </TableCell>
                            <TableCell
                              sx={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              Shakthi
                            </TableCell>
                          </TableRow>

                          <TableRow
                            sx={{
                              "& td": {
                                borderBottom: "none",
                                padding: "4px 8px",
                                fontSize: "10px",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 500,
                                fontFamily: "'Poppins', sans-serif",
                              }}
                            >
                              Task Owner
                            </TableCell>
                            <TableCell
                              sx={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              Arun
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Box
                    sx={{
                      border: "1px solid rgba(255, 115, 0, 0.5)",
                      p: 1,
                      borderRadius: "10px",
                      margin: 1,
                      height: "auto",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
                        Vendor Portal
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          backgroundColor: "#fdceceec",
                          color: "#FF2D2D",
                          padding: 0.5,
                          width: "60px",
                          borderRadius: "12px",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "10px",
                          textAlign: "center",
                          fontWeight: 500,
                        }}
                      >
                        At Risk
                      </Typography>
                    </Box>
                    <TableContainer sx={{ marginTop: 1 }}>
                      <Table size='small'>
                        <TableBody>
                          <TableRow
                            sx={{
                              "& td": {
                                borderBottom: "none",
                                padding: "4px 8px",
                                fontSize: "10px",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 500,
                                fontFamily: "'Poppins', sans-serif",
                              }}
                            >
                              Project Manager
                            </TableCell>
                            <TableCell
                              sx={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              Shakthi
                            </TableCell>
                          </TableRow>

                          <TableRow
                            sx={{
                              "& td": {
                                borderBottom: "none",
                                padding: "4px 8px",
                                fontSize: "10px",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 500,
                                fontFamily: "'Poppins', sans-serif",
                              }}
                            >
                              Task Owner
                            </TableCell>
                            <TableCell
                              sx={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              Arun
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Box
                    sx={{
                      border: "1px solid red",
                      p: 1,
                      borderRadius: "10px",
                      margin: 1,
                      height: "auto",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif" }}>
                        Vendor Admin Portal
                      </Typography>
                      <Typography
                        variant='caption'
                        sx={{
                          backgroundColor: "#fdceceec",
                          color: "#FF2D2D",
                          padding: 0.5,
                          width: "60px",
                          borderRadius: "12px",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "10px",
                          textAlign: "center",
                          fontWeight: 500,
                        }}
                      >
                        At Risk
                      </Typography>
                    </Box>
                    <TableContainer sx={{ marginTop: 1 }}>
                      <Table size='small'>
                        <TableBody>
                          <TableRow
                            sx={{
                              "& td": {
                                borderBottom: "none",
                                padding: "4px 8px",
                                fontSize: "10px",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 500,
                                fontFamily: "'Poppins', sans-serif",
                              }}
                            >
                              Project Manager
                            </TableCell>
                            <TableCell
                              sx={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              Shakthi
                            </TableCell>
                          </TableRow>

                          <TableRow
                            sx={{
                              "& td": {
                                borderBottom: "none",
                                padding: "4px 8px",
                                fontSize: "10px",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 500,
                                fontFamily: "'Poppins', sans-serif",
                              }}
                            >
                              Task Owner
                            </TableCell>
                            <TableCell
                              sx={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                              Arun
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Navbar>
    </>
  );
}

export default Dashboard;

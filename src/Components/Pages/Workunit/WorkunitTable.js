import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Avatar, Box } from "@mui/material";

export default function WorkunitTable() {
  // State
  const [datas, setDatas] = useState([]);
  const [client, setClient] = useState([]);
  const tableCell = {
    fontWeight: 600,
    width: "auto",
  };

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
  const priority = (x) => {
    let style = {};

    if (x === "High") {
      style = {
        color: "#d32f2f",
        backgroundColor: "#ffebee",
      };
    } else if (x === "Medium") {
      style = {
        color: "#ed6c02",
        backgroundColor: "#fff3e0",
      };
    } else if (x === "Low") {
      style = {
        color: "#2e7d32",
        backgroundColor: "#e8f5e9",
      };
    }

    return {
      ...style,
      borderRadius: "10px",
      width: "60px",
      textAlign: "center",
      padding: "2px 6px",
      marginRight: "2px",
      fontFamily: "'Poppins', sans-serif",
      fontSize: "10px",
      fontWeight: 500,
    };
  };

  const sla = (x) => {
    let style = {};

    if (x === "At Risk") {
      style = {
        color: "#d32f2f",
        backgroundColor: "#ffebee",
      };
    } else if (x === "Delayed") {
      style = {
        color: "#ed6c02",
        backgroundColor: "#fff3e0",
      };
    } else if (x === "On Track") {
      style = {
        color: "#2e7d32",
        backgroundColor: "#e8f5e9",
      };
    }

    return {
      ...style,
      borderRadius: "10px",
      width: "60px",
      textAlign: "center",
      padding: "2px 6px",
      marginRight: "2px",
      fontFamily: "'Poppins', sans-serif",
      fontSize: "10px",
      fontWeight: 500,
    };
  };

  const status = (x) => {
    let style = {};

    if (x === "Active") {
      style = {
        color: "#c15af5",
        backgroundColor: "#f2dafe",
      };
    } else if (x === "Resolved") {
      style = {
        color: "#02c2ed",
        backgroundColor: "#d7f1fc",
      };
    } else if (x === "Completed") {
      style = {
        color: "#2e7d32",
        backgroundColor: "#e8f5e9",
      };
    } else if (x === "On Hold") {
      style = {
        color: "#3b3c3b",
        backgroundColor: "#f4f8f4d3",
      };
    }

    return {
      ...style,
      borderRadius: "10px",
      width: "60px",
      textAlign: "center",
      padding: "2px 6px",
      marginRight: "2px",
      fontFamily: "'Poppins', sans-serif",
      fontSize: "10px",
      fontWeight: 500,
    };
  };

  const rows = [
    {
      id: "TKT1001",
      title: "Login Authentication Issue",
      project: "ERP Migration",
      client: "ABC Manufacturing",
      assignee: "Aravindhan",
      category: "Software",
      priority: "High",
      sla: "At Risk",
      status: "Active",
      createdBy: "Rima",
      lastUpdate: "25/05/2026",
    },
    {
      id: "TKT1002",
      title: "Dashboard UI Enhancement",
      project: "Quote Engine",
      client: "Delta Electronics",
      assignee: "Benita",
      category: "UI/UX",
      priority: "Medium",
      sla: "Delayed",
      status: "Resolved",
      createdBy: "Madhura",
      lastUpdate: "24/05/2026",
    },
    {
      id: "TKT1003",
      title: "API Integration Failure",
      project: "SharpFlow",
      client: "Nova Tech",
      assignee: "Karthik",
      category: "Integration",
      priority: "Low",
      sla: "On Track",
      status: "On Hold",
      createdBy: "Rima",
      lastUpdate: "23/05/2026",
    },
    {
      id: "TKT1004",
      title: "Invoice PDF Alignment",
      project: "E-Invoicing",
      client: "Vision Pvt Ltd",
      assignee: "Harini",
      category: "Finance",
      priority: "Low",
      sla: "At Risk",
      status: "Resolved",
      createdBy: "Aravindhan",
      lastUpdate: "22/05/2026",
    },
    {
      id: "TKT1005",
      title: "Material Master Import",
      project: "D365 F&O",
      client: "Sigma Industries",
      assignee: "Madura",
      category: "Data Migration",
      priority: "High",
      sla: "Delayed",
      status: "Completed",
      createdBy: "Benita",
      lastUpdate: "25/05/2026",
    },
    {
      id: "TKT1006",
      title: "RFQ Approval Workflow",
      project: "Procurement Portal",
      client: "Zen Components",
      assignee: "Sathish",
      category: "Workflow",
      priority: "Medium",
      sla: "Delayed",
      status: "Active",
      createdBy: "Rima",
      lastUpdate: "21/05/2026",
    },
    {
      id: "TKT1007",
      title: "Email Notification Delay",
      project: "CRM System",
      client: "Prime Solutions",
      assignee: "Nivetha",
      category: "Communication",
      priority: "High",
      sla: "On Track",
      status: "Resolved",
      createdBy: "Madhura",
      lastUpdate: "24/05/2026",
    },
    {
      id: "TKT1008",
      title: "Production Routing Error",
      project: "Manufacturing ERP",
      client: "HiQ Circuits",
      assignee: "Dinesh",
      category: "Production",
      priority: "Medium",
      sla: "On Track",
      status: "Completed",
      createdBy: "Aravindhan",
      lastUpdate: "25/05/2026",
    },
    {
      id: "TKT1009",
      title: "Vendor Portal Access",
      project: "Supplier Management",
      client: "Global PCB",
      assignee: "Priya",
      category: "Security",
      priority: "Medium",
      sla: "At Risk",
      status: "On Hold",
      createdBy: "Benita",
      lastUpdate: "20/05/2026",
    },
    {
      id: "TKT1010",
      title: "PO Download Issue",
      project: "Purchase Module",
      client: "Orbit Systems",
      assignee: "Kavin",
      category: "Procurement",
      priority: "High",
      sla: "On Track",
      status: "Resolved",
      createdBy: "Rima",
      lastUpdate: "25/05/2026",
    },
  ];

  // Fetch Data
  const fetchClients = () => {
    axios
      .get("http://10.10.0.70:8000/client/details")
      .then((res) => {
        console.log(res.data);

        setClient(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Runs Once When Component Loads
  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{
        height: "100%",
        width: "100%",
        // overflowY: "auto",
        // borderRadius: "10px",
        boxShadow: "none",
      }}
    >
      <Table
        // stickyHeader
        size="small"
        sx={{
          // minWidth: 1200,
          tableLayout: "auto",
          "& .MuiTableCell-root": {
            fontFamily: "'Poppins', sans-serif",
            fontSize: "10px",
            // whiteSpace: "nowrap",
          },
          // tableLayout: "auto",
        }}
      >
        {/* Header */}
        <TableHead
          sx={{
            "& .MuiTableCell-root": {
              backgroundColor: "#dfe9fb",
              color: "#1f2937",
              borderRight: "0.5px solid lightgray",
            },
          }}
        >
          <TableRow>
            <TableCell align="center" sx={tableCell}>
              ID
            </TableCell>

            <TableCell align="center" sx={tableCell}>
              Title
            </TableCell>

            <TableCell align="center" sx={tableCell}>
              Project
            </TableCell>

            <TableCell align="center" sx={tableCell}>
              Client
            </TableCell>

            <TableCell align="center" sx={tableCell}>
              Assignee
            </TableCell>

            <TableCell sx={tableCell}>ProductCategory</TableCell>
            <TableCell align="center" sx={tableCell}>
              Priority
            </TableCell>
            <TableCell align="center" sx={tableCell}>
              SLA
            </TableCell>
            <TableCell align="center" sx={tableCell}>
              Status
            </TableCell>
            <TableCell align="center" sx={tableCell}>
              Created By
            </TableCell>
            <TableCell align="center" sx={tableCell}>
              LastUpdate
            </TableCell>
          </TableRow>
        </TableHead>

        {/* Body */}
        <TableBody>
          {rows.map((item) => (
            <TableRow key={item.id}>
              <TableCell sx={{ height: "30px" }}>{item.id}</TableCell>

              <TableCell align="center">{item.title}</TableCell>

              <TableCell align="center">{item.project}</TableCell>

              <TableCell align="center">{item.client}</TableCell>

              <TableCell align="center">
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Avatar
                    sx={{
                      backgroundColor: getAvatarTheme(item.assignee).bg,
                      color: getAvatarTheme(item.assignee).text,
                      height: "20px",
                      width: "20px",
                      fontSize: "10px",
                    }}
                  >
                    {item.assignee
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </Avatar>
                  {item.assignee}
                </Box>
              </TableCell>

              <TableCell align="center">{item.category}</TableCell>

              <TableCell align="center" sx={tableCell}>
                <Box sx={priority(item.priority)}>{item.priority}</Box>
              </TableCell>

              <TableCell align="center">
                <Box sx={sla(item.sla)}>{item.sla}</Box>
              </TableCell>

              <TableCell align="center">
                <Box sx={status(item.status)}>{item.status}</Box>
              </TableCell>

              {/* <TableCell align="center">{item.status}</TableCell> */}

              <TableCell align="center">
                <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <Avatar
                    sx={{
                      // backgroundColor: getAvatarColor(item.createdBy),
                      backgroundColor: getAvatarTheme(item.createdBy).bg,
                      color: getAvatarTheme(item.createdBy).text,
                      height: "20px",
                      width: "20px",
                      fontSize: "10px",
                    }}
                  >
                    {item.createdBy
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </Avatar>
                  {item.createdBy}
                </Box>
              </TableCell>

              <TableCell align="center">{item.lastUpdate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

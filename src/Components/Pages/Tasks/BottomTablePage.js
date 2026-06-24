import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Button,
  Modal,
  Grid,
  Dialog,
  Autocomplete,
  TextField,
} from "@mui/material";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import UserCreationModal from "./Modal/TaskCreationModal";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Loading/Loading";
import UserContext from "../../../UseContext/UserContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: "90%",
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  boxShadow: 24,
  p: 3,
  borderRadius: "10px",
};

export default function UserManagementHeader(props) {
  const [viewType, setViewType] = useState("user");
  const [open, setOpen] = React.useState(false);
  const [userList, setUserList] = useState(null);
  const { loading, setLoading } = React.useContext(UserContext);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clients, setClients] = useState([]);
  const [clienId, setCliendId] = useState(null);

  const textFieldStyle = {
    "& .MuiInputBase-root": {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "12px",
      minHeight: "32px", // reduced height
      borderRadius: "3px",
      width: 150,
    },

    "& .MuiInputBase-input": {
      padding: "7px 10px", // smaller padding
    },

    "& .MuiFormHelperText-root": {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "10px",
      marginLeft: 0,
      marginTop: "2px",
    },

    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#d9d9d9",
      },

      "&:hover fieldset": {
        borderColor: "#bdbdbd",
      },

      "&.Mui-focused fieldset": {
        borderColor: "rgb(16, 130, 237)",
        borderWidth: "1px",
      },
    },
  };

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      setViewType(newValue);
    }
  };

  const taskListpage = async () => {
    try {
      const res = await axios.get("http://10.10.0.108:8000/userlist");

      setUserList(res.data);
      props.handleLoadingFalse();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";

      console.log(err);

      sessionStorage.setItem("errormessge", errorMessage);
      navigate("/ErrorHandling");
      props.handleLoadingFalse();
    } finally {
      props.handleLoadingFalse();
    }
  };

  // useEffect(() => {
  //   userListpage();
  // }, []);

  useEffect(() => {
    taskListpage();
  }, []);

  const taskList = [
    {
      project: "Employee Management System",
      projectmanager: "John David",
      data: [
        {
          taskid: "TSK-001",
          task: "Create Login API",
          status: "Completed",
          createdby: "Gokul",
          datetime: "11-Jun-2026 10:30 AM",
        },
        {
          taskid: "TSK-002",
          task: "Develop Dashboard UI",
          status: "In Progress",
          createdby: "Arun",
          datetime: "11-Jun-2026 11:15 AM",
        },
        {
          taskid: "TSK-003",
          task: "User Authentication",
          status: "Pending",
          createdby: "Priya",
          datetime: "11-Jun-2026 02:00 PM",
        },
        {
          taskid: "TSK-004",
          task: "Forgot Password Module",
          status: "Review",
          createdby: "Vignesh",
          datetime: "11-Jun-2026 04:15 PM",
        },
      ],
    },

    {
      project: "Attendance Management",
      projectmanager: "Saravanan",
      data: [
        {
          taskid: "TSK-005",
          task: "Attendance API",
          status: "Completed",
          createdby: "Kumar",
          datetime: "10-Jun-2026 09:30 AM",
        },
        {
          taskid: "TSK-006",
          task: "Leave Request Screen",
          status: "In Progress",
          createdby: "Deepa",
          datetime: "10-Jun-2026 11:00 AM",
        },
        {
          taskid: "TSK-007",
          task: "Permission Approval",
          status: "Pending",
          createdby: "Manoj",
          datetime: "10-Jun-2026 01:45 PM",
        },
        {
          taskid: "TSK-008",
          task: "Monthly Attendance Report",
          status: "Completed",
          createdby: "Rahul",
          datetime: "10-Jun-2026 05:20 PM",
        },
      ],
    },

    {
      project: "Project Management Portal",
      projectmanager: "Anand",
      data: [
        {
          taskid: "TSK-009",
          task: "Task Creation Module",
          status: "Completed",
          createdby: "Sneha",
          datetime: "09-Jun-2026 09:00 AM",
        },
        {
          taskid: "TSK-010",
          task: "Task Assignment",
          status: "In Progress",
          createdby: "Karthik",
          datetime: "09-Jun-2026 11:30 AM",
        },
        {
          taskid: "TSK-011",
          task: "Task Status Update",
          status: "Pending",
          createdby: "Harish",
          datetime: "09-Jun-2026 02:10 PM",
        },
        {
          taskid: "TSK-012",
          task: "Project Dashboard",
          status: "Review",
          createdby: "Divya",
          datetime: "09-Jun-2026 04:45 PM",
        },
      ],
    },

    {
      project: "Inventory Management",
      projectmanager: "Ramesh",
      data: [
        {
          taskid: "TSK-013",
          task: "Product List API",
          status: "Completed",
          createdby: "Ajith",
          datetime: "08-Jun-2026 09:40 AM",
        },
        {
          taskid: "TSK-014",
          task: "Stock Update Screen",
          status: "In Progress",
          createdby: "Meena",
          datetime: "08-Jun-2026 12:00 PM",
        },
        {
          taskid: "TSK-015",
          task: "Purchase Order Module",
          status: "Pending",
          createdby: "Suresh",
          datetime: "08-Jun-2026 03:15 PM",
        },
        {
          taskid: "TSK-016",
          task: "Supplier Report",
          status: "Completed",
          createdby: "Nisha",
          datetime: "08-Jun-2026 05:30 PM",
        },
      ],
    },

    {
      project: "CRM Application",
      projectmanager: "Vijay",
      data: [
        {
          taskid: "TSK-017",
          task: "Customer Registration",
          status: "Completed",
          createdby: "Ashok",
          datetime: "07-Jun-2026 10:15 AM",
        },
        {
          taskid: "TSK-018",
          task: "Lead Management",
          status: "In Progress",
          createdby: "Keerthi",
          datetime: "07-Jun-2026 12:45 PM",
        },
        {
          taskid: "TSK-019",
          task: "Email Notification",
          status: "Review",
          createdby: "Ravi",
          datetime: "07-Jun-2026 03:00 PM",
        },
        {
          taskid: "TSK-020",
          task: "Sales Analytics",
          status: "Pending",
          createdby: "Lakshmi",
          datetime: "07-Jun-2026 05:10 PM",
        },
      ],
    },
  ];

  const fetchClientnames = async () => {
    await axios
      .get("http://10.10.0.108:8000/dropdown/clientname")
      .then((res) => {
        console.log(res.data);
        setClients(res.data);
      })
      .catch((err) => {
        console.log(err);
        navigate("/ErrorHandling");
      });
  };

  useEffect(() => {
    fetchClientnames();
  }, []);

  return (
    <div>
      <Box
        sx={{
          background: "#ffff",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
          marginTop: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Title */}
          <Typography
            sx={{
              fontSize: "20px",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
            }}
          >
            Task Managment
          </Typography>

          {/* Right Side */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Filter */}
            <Box>
              {/* <IconButton
              sx={{
                width: 36,
                height: 36,
                border: "1px solid #dcdcdc",
                background: "#fff",
              }}
            >
              <FilterAltOutlinedIcon sx={{ fontSize: "1.1rem" }} />
            </IconButton> */}
            </Box>

            {/* Button */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* <Autocomplete
                options={clients || []}
                size='small'
                getOptionLabel={(option) => option?.CompanyName || ""}
                value={
                  clients.find((item) => item.CompanyId === clienId) || null
                }
                onChange={(event, newValue) => {
                  setCliendId(newValue ? newValue.CompanyId : "");
                }}
                isOptionEqualToValue={(option, value) =>
                  option.CompanyId === value.CompanyId
                }
                slotProps={{
                  paper: {
                    sx: {
                      "& .MuiAutocomplete-option": {
                        minHeight: 28,
                        fontSize: 12,
                        padding: "4px 10px",
                        fontFamily: "'Poppins', sans-serif",
                      },
                    },
                  },
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder='Select Client' />
                )}
                sx={textFieldStyle}
              /> */}
              <Button
                variant='contained'
                startIcon={<AddIcon sx={{ fontSize: "1rem" }} />}
                onClick={() => {
                  setOpen(true);
                }}
                sx={{
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
                New Task
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ background: "#f5f5f5" }}>
          {taskList &&
            taskList.map((section, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  overflow: "hidden",
                }}
              >
                {/* Section Header */}
                <Box
                  sx={{
                    background: "#d9d7e1",
                    px: 2,
                    py: 1.2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontSize: "20px",
                      color: "#2e2e2e",
                    }}
                  >
                    {section.project}
                  </Typography>

                  {section.projectmanager && (
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "12px",
                        color: "#2f2f2f",
                      }}
                    >
                      {section.projectmanager}
                    </Typography>
                  )}
                </Box>

                {/* Table */}
                <TableContainer>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headerStyle}>Task ID</TableCell>
                        <TableCell sx={headerStyle}>Task</TableCell>
                        <TableCell sx={headerStyle} align='center'>
                          Status
                        </TableCell>
                        <TableCell sx={headerStyle}>Created By</TableCell>
                        <TableCell sx={headerStyle}>
                          Create Date and Time
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {section.data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          <TableCell sx={cellStyle}>{row.taskid}</TableCell>
                          <TableCell sx={cellStyle}>{row.task}</TableCell>

                          <TableCell sx={cellStyle} align='center'>
                            <Chip
                              label={row.status}
                              size='small'
                              sx={{
                                width: 100,
                                fontWeight: 600,
                                fontFamily: "Poppins, sans-serif",
                                color:
                                  row.status === "Completed"
                                    ? "#15803d"
                                    : row.status === "In Progress"
                                      ? "#b45309"
                                      : "#b91c1c",
                                backgroundColor:
                                  row.status === "Completed"
                                    ? "#dcfce7"
                                    : row.status === "In Progress"
                                      ? "#fef3c7"
                                      : "#fee2e2",
                              }}
                            />
                          </TableCell>

                          <TableCell sx={cellStyle}>{row.createdby}</TableCell>
                          <TableCell sx={cellStyle}>{row.datetime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ))}
        </Box>

        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <UserCreationModal
                onSuccess={() => setShowSuccess(true)}
                handleClose={handleClose}
                refreshClient={taskListpage}
              />
            </Box>
          </Modal>
        </div>
      </Box>
    </div>
  );
}

const headerStyle = {
  fontFamily: "Poppins, sans-serif",
  fontWeight: 600,
  fontSize: "13px",
  color: "#2d2d2d",
  py: 1.2,
};

const cellStyle = {
  fontFamily: "Poppins, sans-serif",
  fontSize: "13px",
  color: "#333",
  borderBottom: "none",
  py: 1.2,
};

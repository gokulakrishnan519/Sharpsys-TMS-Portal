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
} from "@mui/material";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import UserCreationModal from "./Modal/UserCreationModal";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Loading/Loading";
import UserContext from "../../../UseContext/UserContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  boxShadow: 24,
  p: 3,
  borderRadius: "10px",
};

export default function UserManagementHeader() {
  const [viewType, setViewType] = useState("user");
  const [open, setOpen] = React.useState(false);
  const [userList, setUserList] = useState(null);
  const { Loading, setLoading } = React.useContext(UserContext);

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      setViewType(newValue);
    }
  };

  const userListpage = () => {
    setLoading(true);
    axios
      .get("http://10.10.0.47:7000/userlist")
      .then((res) => {
        console.log(res);
        setUserList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Login failed";

        console.log(err);
        // navigate("/ErrorHandling");
        sessionStorage.setItem("errormessge", errorMessage);
        setLoading(false);
      });
  };
  useEffect(() => {
    userListpage();
  }, []);

  return (
    <div>
      <Box
        sx={{
          background: "#ffff",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
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
              fontSize: "1.6rem",
              fontWeight: 600,
              color: "#2e2e2e",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            User Management
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
            <Box>
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
                New User
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ background: "#f5f5f5" }}>
          {userList &&
            userList.map((section, index) => (
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
                    {section.DepartmentName}
                  </Typography>

                  {section.handledBy && (
                    <Typography
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "12px",
                        color: "#2f2f2f",
                      }}
                    >
                      No
                    </Typography>
                  )}
                </Box>

                {/* Table */}
                <TableContainer>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headerStyle}>User ID</TableCell>
                        <TableCell sx={headerStyle}>User Name</TableCell>
                        <TableCell sx={headerStyle}>Role</TableCell>
                        <TableCell sx={headerStyle}>Responsibility</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {section.data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          <TableCell sx={cellStyle}>{row.EmployeeId}</TableCell>
                          <TableCell sx={cellStyle}>
                            {row.EmployeeName}
                          </TableCell>
                          <TableCell sx={cellStyle}>{row.RoleName}</TableCell>
                          <TableCell sx={cellStyle}>
                            {row.Responsibility}
                          </TableCell>
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
              <Grid
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpen(false);
                  userListpage();
                }}
              >
                <CloseOutlinedIcon />
              </Grid>
              <UserCreationModal />
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

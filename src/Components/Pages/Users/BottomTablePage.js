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
  TablePagination,
  TextField,
  Divider,
} from "@mui/material";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import UserCreationModal from "./Modal/UserCreationModal";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Loading/Loading";
import UserContext from "../../../UseContext/UserContext";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";

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

  // Fixed height with scroll
  maxHeight: "90vh",
  maxWidth: "50%",
  overflowY: "auto",

  border: "none",
  outline: "none",
};

export default function UserManagementHeader(props) {
  const [viewType, setViewType] = useState("user");
  const [open, setOpen] = React.useState(false);
  const [userList, setUserList] = useState(null);
  const { loading, setLoading } = React.useContext(UserContext);
  const [showSuccess, setShowSuccess] = useState(true);
  const [pageMap, setPageMap] = useState({});
  const [rowsPerPageMap, setRowsPerPageMap] = useState({});
  const navigate = useNavigate();
  const [searchMap, setSearchMap] = useState({});
  const handleChangePage = (sectionIndex, event, newPage) => {
    setPageMap((prev) => ({ ...prev, [sectionIndex]: newPage }));
  };

  const handleChangeRowsPerPage = (sectionIndex, event) => {
    setRowsPerPageMap((prev) => ({
      ...prev,
      [sectionIndex]: parseInt(event.target.value, 10),
    }));
    setPageMap((prev) => ({ ...prev, [sectionIndex]: 0 })); // reset to first page
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    userListpage();
    props.fetchTotalvalues();
  };
  const handleSearchChange = (sectionIndex, value) => {
    setSearchMap((prev) => ({
      ...prev,
      [sectionIndex]: value,
    }));

    // Reset to first page whenever search changes
    setPageMap((prev) => ({
      ...prev,
      [sectionIndex]: 0,
    }));
  };
  const textFieldStyle = {
    "& .MuiInputBase-root": {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "12px",
      minHeight: "32px", // reduced height
      // borderRadius: "3px",
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
        border: "none",
      },
    },
  };

  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      setViewType(newValue);
    }
  };

  const userListpage = async () => {
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
    userListpage();
  }, []);

  // const onSuccess = () => {
  //   setShowSuccess(true);
  //   alert("success modal open");
  // };

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
            userList.map((section, index) => {
              const page = pageMap[index] ?? 0;
              const rowsPerPage = rowsPerPageMap[index] ?? 10;
              const search = (searchMap[index] ?? "").toLowerCase();

              const filteredRows = section.data.filter((row) =>
                Object.values(row).join(" ").toLowerCase().includes(search),
              );

              const totalRows = filteredRows.length;

              const paginatedRows = filteredRows.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
              );
              return (
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
                    <TextField
                      fullWidth
                      size='small'
                      placeholder='Search...'
                      value={searchMap[index] ?? ""}
                      onChange={(e) =>
                        handleSearchChange(index, e.target.value)
                      }
                      sx={{
                        ...textFieldStyle,
                        background: "white",
                        borderRadius: "15px",
                        width: 150,
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <SearchIcon sx={{ fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />

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
                          <TableCell sx={headerStyle}>Employee Email</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {paginatedRows.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            <TableCell sx={cellStyle}>
                              {row.EmployeeId}
                            </TableCell>
                            <TableCell sx={cellStyle}>
                              {row.EmployeeName}
                            </TableCell>
                            <TableCell sx={cellStyle}>{row.RoleName}</TableCell>
                            <TableCell sx={cellStyle}>
                              {row.Responsibility}
                            </TableCell>
                            <TableCell sx={cellStyle}>
                              {row.EmployeeEmail}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      component='div'
                      count={totalRows}
                      page={page}
                      onPageChange={(event, newPage) =>
                        handleChangePage(index, event, newPage)
                      }
                      rowsPerPage={rowsPerPage}
                      onRowsPerPageChange={(event) =>
                        handleChangeRowsPerPage(index, event)
                      }
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      sx={{
                        borderTop: "1px solid #e5e7eb",
                        "& .MuiTablePagination-toolbar": {
                          fontFamily: "'Poppins', sans-serif",
                        },
                        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                          {
                            fontFamily: "'Poppins', sans-serif",
                          },
                      }}
                    />
                  </TableContainer>
                </Paper>
              );
            })}
        </Box>

        <div>
          <Modal
            open={open}
            aria-labelledby='modal-modal-title'
            aria-describedby='modal-modal-description'
          >
            <Box sx={style}>
              <UserCreationModal
                handleClose={handleClose}
                refreshClient={userListpage}
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

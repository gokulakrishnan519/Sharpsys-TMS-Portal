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
  TablePagination,
} from "@mui/material";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import UserCreationModal from "./Modal/TaskCreationModal";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Loading/Loading";
import UserContext from "../../../UseContext/UserContext";
import dayjs from "dayjs";

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
  overflowY: "auto",
  overflowX: "visible",
};

export default function UserManagementHeader(props) {
  const [open, setOpen] = React.useState(false);
  const [taskList, setTaskList] = useState(null);
  const { loading, setLoading } = React.useContext(UserContext);
  const [pageMap, setPageMap] = useState({});
  const [rowsPerPageMap, setRowsPerPageMap] = useState({});
  const [clients, setClients] = useState([]);

  const navigate = useNavigate();
  const [searchMap, setSearchMap] = useState({});
  const handleClose = () => setOpen(false);
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

  const taskListpage = async () => {
    try {
      const res = await axios.get("http://10.10.0.108:8000/tasks/display");

      setTaskList(res.data);
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

  useEffect(() => {
    taskListpage();
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
            taskList.map((section, index) => {
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
                <>
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
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

                        {section.projectmanager && (
                          <Typography
                            sx={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "12px",
                              color: "#2f2f2f",
                            }}
                          >
                            Manager:{section.projectmanager}
                          </Typography>
                        )}
                      </Box>
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
                            <TableCell sx={headerStyle}>Assigned By</TableCell>
                            <TableCell sx={headerStyle}>Assigned to</TableCell>
                            <TableCell sx={headerStyle}>Duration</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {paginatedRows.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              <TableCell sx={cellStyle}>{row.taskid}</TableCell>
                              <TableCell sx={cellStyle}>
                                {row.taskname}
                              </TableCell>

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

                              <TableCell sx={cellStyle}>
                                {row.assignedby}
                              </TableCell>
                              <TableCell sx={cellStyle}>
                                {row.assignedto}
                              </TableCell>
                              <TableCell sx={cellStyle}>
                                {dayjs(row.startdate).format("DD MMM YYYY")} to{" "}
                                {dayjs(row.duedate).format("DD MMM YYYY")}
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
                </>
              );
            })}
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

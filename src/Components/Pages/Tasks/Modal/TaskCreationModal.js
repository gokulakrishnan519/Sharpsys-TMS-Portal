import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Paper,
  DialogContent,
  Dialog,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Loading from "../../../../Loading/Loading";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const assignedByList = ["Gokul", "Arun", "Priya", "Vignesh", "Karthik"];

export default function TaskCreationModal({
  onSuccess,
  handleClose,
  refreshClient,
}) {
  // const [formData, setFormData] = useState({
  //   employerId: "",
  //   employerName: "",
  //   employerEmail: "",
  //   department: sessionStorage.getItem("departmentId"),
  //   role: sessionStorage.getItem("roleId"),
  //   responsibility: "",
  //   password: "",
  // });

  const [empoyeeRoleList, setEmployeeRolesList] = useState(null);
  const [employeeDepartmentList, setEmployeeDepartmentList] = useState(null);

  const [formData, setFormData] = useState({
    project: "",
    task: "",
    assignedBy: [],
    startDate: null,
    endDate: null,
  });

  const [errors, setErrors] = useState({
    project: "",
    task: "",
    assignedBy: "",
    startDate: null,
    endDate: null,
  });

  const [projectOption, setProjectOption] = useState([]);
  const [employeeOption, setEmployeeOption] = useState([]);

  const [loading, setLoading] = useState(false);

  const [successModal, setSuccessModal] = useState(false);
  const [taskId, setTaskId] = useState(null);

  // const navigate = useNavigate();

  console.log(empoyeeRoleList);

  const validateForm = () => {
    let temp = {};
    let valid = true;

    if (!formData.project) {
      temp.project = "Project is required";
      valid = false;
    }

    if (!formData.task.trim()) {
      temp.task = "Task is required";
      valid = false;
    }

    if (formData.assignedBy.length === 0) {
      temp.assignedBy = "Assigned to is required";
      valid = false;
    }

    setErrors(temp);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    console.log(formData);
    setLoading(true);
    const payload = {
      projectid: formData.project?.projectId,
      taskname: formData.task,
      taskdescription: "",
      assignedto: formData.assignedBy?.employeeId,
      assignedby: sessionStorage.getItem("employeeId"),
      priority: "High",
      status: "Open",
      startdate: dayjs(formData.startDate).format("YYYY-MM-DD"),
      duedate: dayjs(formData.endDate).format("YYYY-MM-DD"),
      estimatedHours: 0,
      actualHours: 0,
      remarks: "",
    };

    axios
      .post(`http://10.10.0.108:8000/tasks/create`, payload)
      .then((res) => {
        console.log(res.data);

        if (res.data?.message === "Task created successfully") {
          setTaskId(res.data.taskid);
          setSuccessModal(true);

          setFormData({
            project: "",
            task: "",
            assignedBy: [],
          });

          setErrors({});
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

    // API Call

    setFormData({
      project: "",
      task: "",
      assignedBy: [],
    });

    setErrors({});
  };

  // Get Project List
  const projectMaster = async () => {
    try {
      const response = await axios.get(
        "http://10.10.0.108:8000/project/projectdetails",
      );

      const projects = response.data.projects.map((item) => ({
        projectId: item.ProjectID,
        projectName: item.ProjectName,
      }));

      setProjectOption(projects);
    } catch (error) {
      console.error("Error fetching client names:", error);
    }
  };

  const employeeMaster = async () => {
    try {
      const response = await axios.get("http://10.10.0.108:8000/userlist");

      const employeeList = response.data.flatMap((department) =>
        department.data.map((employee) => ({
          employeeId: employee.EmployeeId,
          employeeName: employee.EmployeeName,
        })),
      );

      setEmployeeOption(employeeList);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    projectMaster();
    employeeMaster();
  }, []);

  return (
    <>
      {loading ? (
        <Grid
          sx={{
            minHeight: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "300px",
          }}
        >
          <CircularProgress aria-label='Loading…' />
        </Grid>
      ) : (
        <Grid>
          <Grid
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              cursor: "pointer",
            }}
            onClick={() => {
              handleClose();
            }}
          >
            <CloseOutlinedIcon />
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "#2e2e2e",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Task Creation Board
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "12px",
              border: "1px solid #e0e0e0",
              maxWidth: "650px",
            }}
          >
            <Grid container spacing={2}>
              {/* Project */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Typography
                  sx={{
                    mb: 0.8,
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Project
                </Typography>
                <Autocomplete
                  size='small'
                  options={projectOption}
                  value={formData.project}
                  getOptionLabel={(option) => option?.projectName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.projectId === value.projectId
                  }
                  onChange={(e, newValue) => {
                    setFormData({
                      ...formData,
                      project: newValue,
                    });

                    setErrors({
                      ...errors,
                      project: "",
                    });
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "13px",
                      height: "36px",
                    },
                    "& .MuiFormHelperText-root": {
                      fontFamily: "Poppins, sans-serif",
                      ml: 0,
                    },
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        "& .MuiAutocomplete-option": {
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "13px",
                        },
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder='Select Project'
                      error={!!errors.project}
                      helperText={errors.project}
                    />
                  )}
                />
              </Grid>

              {/* Task */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Typography
                  sx={{
                    mb: 0.8,
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Task
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  size='small'
                  placeholder='Enter Task'
                  value={formData.task}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      task: e.target.value,
                    });

                    setErrors({
                      ...errors,
                      task: "",
                    });
                  }}
                  error={!!errors.task}
                  helperText={errors.task}
                  sx={{
                    "& .MuiInputBase-root": {
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "13px",
                    },
                    "& .MuiFormHelperText-root": {
                      fontFamily: "Poppins, sans-serif",
                      ml: 0,
                    },
                  }}
                />
              </Grid>

              {/* Start Date & End Date */}
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Typography
                  sx={{
                    mb: 0.8,
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Start Date
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dayjs(formData.startDate)}
                    onChange={(newValue) => {
                      setFormData({
                        ...formData,
                        startDate: newValue,
                      });

                      setErrors({
                        ...errors,
                        startDate: "",
                      });
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        placeholder: "Select Start Date",
                        error: !!errors.startDate,
                        helperText: errors.startDate,
                        sx: {
                          "& .MuiInputBase-root": {
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "13px",
                            height: "36px",
                          },
                          "& .MuiFormHelperText-root": {
                            fontFamily: "Poppins, sans-serif",
                            ml: 0,
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Typography
                  sx={{
                    mb: 0.8,
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  End Date
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={dayjs(formData.endDate)}
                    onChange={(newValue) => {
                      setFormData({
                        ...formData,
                        endDate: newValue,
                      });

                      setErrors({
                        ...errors,
                        endDate: "",
                      });
                    }}
                    minDate={formData.startDate || undefined}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        placeholder: "Select End Date",
                        error: !!errors.endDate,
                        helperText: errors.endDate,
                        sx: {
                          "& .MuiInputBase-root": {
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "13px",
                            height: "36px",
                          },
                          "& .MuiFormHelperText-root": {
                            fontFamily: "Poppins, sans-serif",
                            ml: 0,
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Assigned By */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Typography
                  sx={{
                    mb: 0.8,
                    fontSize: "13px",
                    fontWeight: 500,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Assigned To
                </Typography>

                <Autocomplete
                  multiple
                  size='small'
                  options={employeeOption}
                  value={formData.assignedBy || []}
                  getOptionLabel={(option) => option.employeeName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.employeeId === value.employeeId
                  }
                  onChange={(e, value) => {
                    setFormData({
                      ...formData,
                      assignedBy: value,
                    });

                    setErrors({
                      ...errors,
                      assignedBy: "",
                    });
                  }}
                  sx={{
                    "& .MuiInputBase-root": {
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "13px",
                    },
                    "& .MuiFormHelperText-root": {
                      fontFamily: "Poppins, sans-serif",
                      ml: 0,
                    },
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        "& .MuiAutocomplete-option": {
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "13px",
                        },
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder='Select Employee(s)'
                      error={!!errors.assignedBy}
                      helperText={errors.assignedBy}
                    />
                  )}
                />
              </Grid>

              {/* Submit */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Button
                  onClick={handleSubmit}
                  variant='contained'
                  sx={{
                    color: "#fff",
                    background: "#ff2d55",
                    borderRadius: "10px",
                    px: 2.5,
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
                  Create Task
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Dialog
            open={successModal}
            onClose={() => setSuccessModal(false)}
            maxWidth='xs'
            fullWidth
            PaperProps={{
              sx: {
                fontFamily: "Poppins, sans-serif",
                borderRadius: 2,
              },
            }}
          >
            <DialogContent sx={{ textAlign: "center", py: 4 }}>
              <Typography
                variant='h6'
                sx={{
                  color: "success.main",
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Task Created Successfully
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "text.secondary",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Task ID: {taskId}
              </Typography>

              <Button
                variant='contained'
                sx={{
                  mt: 3,
                  fontFamily: "Poppins, sans-serif",
                }}
                onClick={() => setSuccessModal(false)}
              >
                OK
              </Button>
            </DialogContent>
          </Dialog>
        </Grid>
      )}
    </>
  );
}

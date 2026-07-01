import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";

// import { Box, Typography, TextField, MenuItem } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
export default function Projectform({
  open,
  handleClose,
  selectedProject,
  mode,
  refreshProjects,
  onSuccess,
  setMode,
}) {
  const [errors, setErrors] = useState({});
  const [formdata, setFormdata] = useState({
    project_name: "",
    client: "",
    description: "",
    project_manager: "",
    assigned_to: [],
    priority: "",
    sla_configuration: "",
    start_date: "",
    end_date: "",
  });
  const [employeeOption, setEmployeeOption] = useState([]);

  //edit
  useEffect(() => {
    if (mode === "edit" && selectedProject && employeeOption.length) {
      setFormdata({
        project_name: selectedProject.ProjectName || "",
        client: selectedProject.ClientName || "",
        description: selectedProject.ProjectDescription || "",

        project_manager:
          employeeOption.find(
            (emp) => emp.employeeName === selectedProject.ProjectLead,
          ) || null,

        assigned_to:
          employeeOption.filter((emp) =>
            selectedProject.assigned_to?.some(
              (item) => item.employeeId === emp.employeeId,
            ),
          ) || [],

        priority: selectedProject.Priority || "",
        sla_configuration: selectedProject.SLAConfiguration || "",
        start_date: selectedProject.StartDate || "",
        end_date: selectedProject.EndDate || "",
      });
    }
  }, [selectedProject, employeeOption, mode]);
  const navigate = useNavigate();

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!formdata.project_name.trim()) {
      newErrors.project_name = "Project name is required";
    }

    if (!formdata.client.trim()) {
      newErrors.client = "Client name is required";
    }

    if (!formdata.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formdata.project_manager) {
      newErrors.project_manager = "Project Manager is required";
    }

    if (formdata.assigned_to.length === 0) {
      newErrors.assigned_to = "Select the employee";
    }
    if (!formdata.priority.trim()) {
      newErrors.priority = "Select the priority";
    }
    if (!formdata.sla_configuration.trim()) {
      newErrors.sla_configuration = "Select the configuration";
    }

    if (!formdata.start_date.trim()) {
      newErrors.start_date = "Start Date is required";
    }

    if (!formdata.end_date.trim()) {
      newErrors.end_date = "End Date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

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

  //submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log(formdata);
      console.log("Mode:", mode);
      console.log("Selected Project:", selectedProject);
      const payload = {
        ...(mode === "edit" && {
          project_id: selectedProject?.ProjectID,
        }),
        project_name: formdata.project_name,
        client_name: formdata.client,
        project_description: formdata.description,
        project_lead: formdata.project_manager?.employeeName,
        assigned_to: formdata.assigned_to?.map((item) => item.employeeId) || [],
        priority: formdata.priority,
        sla_configuration: formdata.sla_configuration,
        start_date: formdata.start_date,
        end_date: formdata.end_date,
      };

      // console.log(payload);
      axios
        .post("http://10.10.0.108:8000/project/newproject", payload)
        .then((res) => {
          console.log(res.data);
          refreshProjects();
          onSuccess();
        })
        .catch((err) => {
          const errorMessage =
            err.response?.data?.message ||
            err.message ||
            "Something went wrong";

          console.log(err);

          sessionStorage.setItem("errormessge", errorMessage);
          navigate("/ErrorHandling");
        });
      // if (mode === "edit") {
      //   axios.put(
      //     `http://10.10.0.54:7000/project/${selectedProject.ProjectID}`,
      //     payload,
      //   );
      // } else {
      //   axios.post("http://10.10.0.54:7000/project/newproject", payload);
      // }
      handleClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const [clients, setClients] = useState([]);

  const priorities = ["High", "Medium", "Low"];
  const slaOptions = ["7 Days", "15 Days", "21 Days"];
  const projectManager = ["Javagal", "Hari"];
  const textFieldStyle = {
    "& .MuiInputBase-root": {
      fontFamily: "'Poppins', sans-serif",
      fontSize: "12px",
      minHeight: "32px", // reduced height
      borderRadius: "3px",
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
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    employeeMaster();
  }, []);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        // fullWidth
        maxWidth={false}
        sx={{
          position: "fixed",
          "& .MuiDialog-paper": {
            width: "600px", // change width here
            maxHeight: "95%",
            // borderRadius: "1px",
          },
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontSize: "20px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {mode === "edit" ? "Edit Project" : "Add Project"}
        </DialogTitle>
        <DialogContent>
          <Grid
            id='subscription-form'
            sx={{
              border: "0.2px solid #d9d9d9",
              padding: 2,
              borderRadius: "12px",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mb: 1,
              }}
            >
              {/* Project Name */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    // mb: 0.5,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Project Name
                </Typography>

                <TextField
                  fullWidth
                  name='project_name'
                  value={formdata.project_name}
                  error={!!errors.project_name}
                  helperText={errors.project_name}
                  onChange={handleChange}
                  size='small'
                  placeholder='Enter Project Name'
                  sx={textFieldStyle}
                />
              </Box>

              {/* Client */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    // mb: 0.5,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Client
                </Typography>

                <Autocomplete
                  disableClearable
                  options={clients}
                  size='small'
                  getOptionLabel={(option) => option.CompanyName || ""}
                  value={
                    clients.find(
                      (client) => client.CompanyName === formdata.client,
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setFormdata((prev) => ({
                      ...prev,
                      client: newValue?.CompanyName || "",
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      client: "",
                    }));
                  }}
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
                    <TextField
                      {...params}
                      placeholder='Select Client'
                      name='client'
                      value={formdata.client}
                      error={!!errors.client}
                      helperText={errors.client}
                      onChange={handleChange}
                    />
                  )}
                  sx={textFieldStyle}
                />
              </Box>
            </Box>

            {/* Description */}
            <Box sx={{ mb: 1 }}>
              <Typography
                sx={{ fontSize: 12, fontFamily: "'Poppins', sans-serif" }}
              >
                Description
              </Typography>

              <TextField
                fullWidth
                name='description'
                value={formdata.description}
                error={!!errors.description}
                helperText={errors.description}
                onChange={handleChange}
                // multiline
                rows={1}
                placeholder='Enter Description'
                size='small'
                sx={textFieldStyle}
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
                mb: 1,
              }}
            >
              {/* Project Manager */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    // mb: 0.5,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Project Manager
                </Typography>
                <Autocomplete
                  disableClearable
                  size='small'
                  options={employeeOption}
                  value={formdata.project_manager}
                  getOptionLabel={(option) => option?.employeeName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.employeeId === value.employeeId
                  }
                  onChange={(event, newValue) => {
                    setFormdata((prev) => ({
                      ...prev,
                      project_manager: newValue,
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      project_manager: "",
                    }));
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
                  sx={textFieldStyle}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder='Select Project Manager'
                      error={!!errors.project_manager}
                      helperText={errors.project_manager}
                    />
                  )}
                />

                {/* <Autocomplete
                  options={projectManager}
                  size="small"
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
                    <TextField
                      {...params}
                      placeholder="Select Project Manager"
                      name="project_manager"
                      value={formdata.project_manager}
                      error={!!errors.project_manager}
                      helperText={errors.project_manager}
                      onChange={handleChange}
                    />
                  )}
                  sx={textFieldStyle}
                /> */}
              </Box>
              {/* Assigned To */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    // mb: 0.5,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Assigned To
                </Typography>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  size='small'
                  options={employeeOption}
                  value={formdata.assigned_to || []}
                  getOptionLabel={(option) => option?.employeeName || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.employeeId === value.employeeId
                  }
                  onChange={(event, newValue) => {
                    setFormdata((prev) => ({
                      ...prev,
                      assigned_to: newValue,
                    }));

                    console.log(formdata);

                    setErrors((prev) => ({
                      ...prev,
                      assigned_to: "",
                    }));
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
                  sx={textFieldStyle}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder='Select Assigned Employees'
                      error={!!errors.assigned_to}
                      helperText={errors.assigned_to}
                    />
                  )}
                />

                {/* <Autocomplete
                  options={assignedUsers}
                  size="small"
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
                    <TextField
                      {...params}
                      placeholder="Select Project Manager"
                      name="assigned_to"
                      value={formdata.assigned_to}
                      error={!!errors.assigned_to}
                      helperText={errors.assigned_to}
                      onChange={handleChange}
                    />
                  )}
                  sx={textFieldStyle}
                /> */}
              </Box>

              {/* Priority */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    // mb: 0.5,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Priority
                </Typography>

                <Autocomplete
                  disableClearable
                  options={priorities}
                  value={formdata.priority}
                  size='small'
                  onChange={(event, newValue) => {
                    setFormdata((prev) => ({
                      ...prev,
                      priority: newValue || "",
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      priority: "",
                    }));
                  }}
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
                    <TextField
                      {...params}
                      placeholder='Select Priority'
                      name='priority'
                      value={formdata.priority}
                      error={!!errors.priority}
                      helperText={errors.priority}
                      onChange={handleChange}
                    />
                  )}
                  sx={textFieldStyle}
                />
              </Box>

              {/* SLA */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    // mb: 0.5,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  SLA Configuration
                </Typography>

                <Autocomplete
                  disableClearable
                  options={slaOptions}
                  size='small'
                  onChange={(event, newValue) => {
                    setFormdata((prev) => ({
                      ...prev,
                      sla_configuration: newValue || "",
                    }));

                    setErrors((prev) => ({
                      ...prev,
                      sla_configuration: "",
                    }));
                  }}
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
                    <TextField
                      {...params}
                      placeholder='Autofills According to Priority'
                      name='sla_configuration'
                      value={formdata.sla_configuration}
                      error={!!errors.sla_configuration}
                      helperText={errors.sla_configuration}
                      onChange={handleChange}
                    />
                  )}
                  sx={textFieldStyle}
                />
              </Box>

              {/* Start Date */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Start Date
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={
                      formdata.start_date ? dayjs(formdata.start_date) : null
                    }
                    onChange={(newValue) => {
                      setFormdata({
                        ...formdata,
                        start_date: newValue
                          ? newValue.format("YYYY-MM-DD")
                          : "",
                      });

                      setFormdata({
                        ...formdata,
                        end_date: "",
                      });

                      setErrors((prev) => ({
                        ...prev,
                        start_date: "",
                      }));
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!errors.start_date,
                        helperText: errors.start_date,
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            height: "32px",
                            fontSize: "12px",
                            fontFamily: "'Poppins', sans-serif",
                            "& fieldset": {
                              borderColor: "#d9d9d9",
                            },
                            "&:hover fieldset": {
                              borderColor: "#bdbdbd",
                            },
                            "&:hover fieldset": {
                              borderColor: "#bdbdbd",
                            },

                            "&.Mui-focused fieldset": {
                              borderColor: "rgb(16, 130, 237)",
                              borderWidth: "0.5px",
                            },
                          },
                          "& .MuiInputBase-input": {
                            padding: "6px 8px",
                          },
                          "& .MuiSvgIcon-root": {
                            fontSize: "16px",
                          },
                          "& .MuiPickersSectionList-root": {
                            fontSize: "12px !important",
                            fontFamily: "'Poppins', sans-serif",
                          },

                          "& .MuiPickersSectionList-section": {
                            fontSize: "12px !important",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              {/* End Date */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  End Date
                </Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    minDate={dayjs(formdata.start_date)}
                    value={formdata.end_date ? dayjs(formdata.end_date) : null}
                    onChange={(newValue) => {
                      setFormdata({
                        ...formdata,
                        end_date: newValue ? newValue.format("YYYY-MM-DD") : "",
                      });

                      setErrors((prev) => ({
                        ...prev,
                        end_date: "",
                      }));
                    }}
                    // sx={{
                    //   width: "100%",
                    //   "& .MuiInputBase-root": {
                    //     height: "32px",
                    //     fontSize: "12px",
                    //     fontFamily: "'Poppins', sans-serif",
                    //   },
                    //   "& .MuiInputBase-input": {
                    //     padding: "0 8px",
                    //   },
                    // }}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        error: !!errors.end_date,
                        helperText: errors.end_date,
                        sx: {
                          "& .MuiInputBase-root": {
                            height: "32px",
                            fontSize: "12px",
                            fontFamily: "'Poppins', sans-serif",
                          },

                          "& .MuiInputBase-input": {
                            fontSize: "12px !important",
                            padding: "6px 8px !important",
                          },

                          "& .MuiSvgIcon-root": {
                            fontSize: "16px",
                          },
                          "& .MuiPickersSectionList-root": {
                            fontSize: "12px !important",
                            fontFamily: "'Poppins', sans-serif",
                          },

                          "& .MuiPickersSectionList-section": {
                            fontSize: "12px !important",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
            <Button
              type='submit'
              onClick={handleSubmit}
              form='subscription-form'
              // color="error"
              variant='contained'
              sx={{
                width: "140px",
                borderRadius: "4px",
                backgroundColor: "#ff2d55",
                boxShadow: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "'Poppins', sans-serif",
                mt: 2,
                "&:hover": {
                  boxShadow: "none",
                  backgroundColor: "#e3264b", // Keeps the background color identical on hover
                },
                "&:active": {
                  boxShadow: "none",
                },
                "&:focus": {
                  boxShadow: "none",
                },
              }}
            >
              {mode === "edit" ? "Update Project" : "Create Project"}
            </Button>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{ fontSize: "14px", justifyContent: "center", padding: 2 }}
        >
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          {/* <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            color="error"
            sx={{
              width: "140px",
              borderRadius: "4px",
              color: "red",
              cursor: "pointer",
              fontSize: "12px",
              fontFamily:"Poppins,sans-serif"
            }}
          >
            <AttachFileIcon />
            Attach files
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => console.log(event.target.files)}
              multiple
            />
          </Button> */}
        </DialogActions>
        <CloseIcon
          sx={{ position: "absolute", top: 10, right: 10, cursor: "pointer" }}
          // onClick={handleClose}
          onClick={(e) => {
            handleClose(e);
            setErrors({});
            setMode("");
            setFormdata({
              project_name: "",
              client: "",
              description: "",
              project_manager: "",
              assigned_to: "",
              priority: "",
              sla_configuration: "",
              start_date: "",
              end_date: "",
            });
          }}
        />
      </Dialog>
    </React.Fragment>
  );
}

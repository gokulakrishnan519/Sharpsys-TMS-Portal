import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Paper,
  MenuItem,
  CircularProgress,
  Divider,
  Modal,
} from "@mui/material";
import axios from "axios";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
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

function Success({ handleClose }) {
  return (
    <Box
      sx={{
        width: 420,
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Poppins",
      }}
    >
      {/* Success Icon */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          bgcolor: "#ECFDF3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <CheckCircleRoundedIcon
          sx={{
            color: "#16A34A",
            fontSize: 42,
          }}
        />
      </Box>

      {/* Title */}
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 700,
          color: "#111827",
          fontFamily: "Poppins",
        }}
      >
        User Account Created
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          mt: 1,
          fontSize: 14,
          color: "#6B7280",
          textAlign: "center",
          lineHeight: 1.7,
          fontFamily: "Poppins",
        }}
      >
        The user account has been created successfully.
      </Typography>

      <Divider sx={{ width: "100%", my: 3 }} />

      {/* Email Info */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: "#F9FAFB",
          border: "1px solid #E5E7EB",
        }}
      >
        <MarkEmailReadRoundedIcon
          sx={{
            color: "#2563EB",
            fontSize: 28,
            mt: 0.2,
          }}
        />

        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 14,
              color: "#111827",
              fontFamily: "Poppins",
            }}
          >
            Email Sent
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: "#6B7280",
              lineHeight: 1.6,
              fontFamily: "Poppins",
            }}
          >
            A welcome email containing the login credentials and account
            activation details has been sent to the user's registered email
            address.
          </Typography>
        </Box>
      </Box>

      {/* Button */}
      <Button
        variant='contained'
        onClick={handleClose}
        sx={{
          mt: 4,
          width: "100%",
          height: 46,
          borderRadius: "10px",
          textTransform: "none",
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "Poppins",
          bgcolor: "#16A34A",
          boxShadow: "none",

          "&:hover": {
            bgcolor: "#15803D",
            boxShadow: "none",
          },
        }}
      >
        Back to User Management
      </Button>
    </Box>
  );
}

export default function UserCreationModal({ handleClose, refreshClient }) {
  const [formData, setFormData] = useState({
    employerId: "",
    employerName: "",
    employerEmail: "",
    department: "",
    role: "",
    responsibility: "",
    password: "",
    employee_role: "User",
  });

  const [errors, setErrors] = useState({});
  const [empoyeeRoleList, setEmployeeRolesList] = useState(null);
  const [employeeDepartmentList, setEmployeeDepartmentList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = {};

    // Employer ID
    if (!formData.employerId.trim()) {
      tempErrors.employerId = "Employer ID is required";
    }

    // Employer Name
    if (!formData.employerName.trim()) {
      tempErrors.employerName = "Employer Name is required";
    }

    // Employer Email
    if (!formData.employerEmail.trim()) {
      tempErrors.employerEmail = "Employer Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.employerEmail)
    ) {
      tempErrors.employerEmail = "Enter valid email";
    }

    // Department
    if (!formData.department) {
      tempErrors.department = "Department is required";
    }

    // Department
    if (!formData.role) {
      tempErrors.role = "Role is required";
    }

    // Responsibility
    if (!formData.responsibility.trim()) {
      tempErrors.responsibility = "Responsibility is required";
    }

    // Password
    if (!formData.password.trim()) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Minimum 6 characters required";
    }

    setErrors(tempErrors);

    // If no validation errors
    if (Object.keys(tempErrors).length === 0) {
      setLoading(true);

      const payload = {
        employee_id: formData.employerId,
        employee_name: formData.employerName,
        employee_email: formData.employerEmail,
        department_name: formData.department,
        role_name: formData.role,
        responsibility: formData.responsibility,
        password: formData.password,
        employee_role: formData.employee_role,
      };

      try {
        const response = await axios.post(
          "http://10.10.0.108:8000/user/creation",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        console.log("Success :", response.data);
        //
        if (response.data.message == "User created successfully") {
          setShowSuccess(true);
          // alert("hii");
          // alert(response.data.message);

          // Reset Form
          setFormData({
            employerId: "",
            employerName: "",
            employerEmail: "",
            department: null,
            role: null,
            responsibility: "",
            password: "",
            employee_role: "User",
          });
          setLoading(false);
        } else {
          alert(response.data.message);
          setLoading(false);
        }

        setErrors({});
      } catch (error) {
        console.log("Error :", error);
        setLoading(false);

        if (error.response) {
          alert(error.response.data.message || "Something went wrong");
        } else {
          alert("Server Error");
        }
      }
    }
  };

  const EmployeeRolesgetApi = () => {
    axios
      .get("http://10.10.0.108:8000/dropdown/rolename")
      .then((res) => {
        console.log(res);
        setEmployeeRolesList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const EmployeeDepartmentgetApi = () => {
    axios
      .get("http://10.10.0.108:8000/dropdown/departmentname")
      .then((res) => {
        console.log(res);
        setEmployeeDepartmentList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    EmployeeRolesgetApi();
    EmployeeDepartmentgetApi();
  }, []);

  console.log(empoyeeRoleList);

  return (
    <>
      {loading ? (
        <Grid
          sx={{
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "30vw",
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
              // width: "600px",
            }}
          >
            {/* Title */}
            <Typography
              sx={{
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "#2e2e2e",
                fontFamily: "Poppins, sans-serif",
                mb: 1,
              }}
            >
              User Creation
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
            <Box component='form' onSubmit={handleSubmit} autoComplete='off'>
              <Grid container spacing={2}>
                {/* Employer ID */}
                <Grid size={{ lg: 6, xs: 6, md: 6, sm: 6 }}>
                  <Typography
                    sx={{
                      mb: 0.8,
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Employee ID
                  </Typography>

                  <TextField
                    fullWidth
                    size='small'
                    placeholder='Employer ID'
                    value={formData.employerId}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        employerId: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        employerId: "",
                      });
                    }}
                    error={!!errors.employerId}
                    helperText={errors.employerId}
                    sx={{
                      "& .MuiInputBase-root": {
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "13px",
                        height: "36px",
                      },

                      "& .MuiInputBase-input": {
                        py: 1,
                      },

                      "& .MuiFormHelperText-root": {
                        fontFamily: "Poppins, sans-serif",
                        ml: 0,
                      },
                    }}
                  />
                </Grid>

                {/* Employer Name */}
                <Grid size={{ lg: 6, xs: 6, md: 6, sm: 6 }}>
                  <Typography
                    sx={{
                      mb: 0.8,
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Employee Name
                  </Typography>

                  <TextField
                    fullWidth
                    size='small'
                    placeholder='Employer Name'
                    value={formData.employerName}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        employerName: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        employerName: "",
                      });
                    }}
                    error={!!errors.employerName}
                    helperText={errors.employerName}
                    sx={{
                      "& .MuiInputBase-root": {
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "13px",
                        height: "36px",
                      },

                      "& .MuiInputBase-input": {
                        py: 1,
                      },

                      "& .MuiFormHelperText-root": {
                        fontFamily: "Poppins, sans-serif",
                        ml: 0,
                      },
                    }}
                  />
                </Grid>

                {/* Employer Email */}
                <Grid size={{ lg: 6, xs: 6, md: 12, sm: 12 }}>
                  <Typography
                    sx={{
                      mb: 0.8,
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Employee Email
                  </Typography>

                  <TextField
                    fullWidth
                    size='small'
                    placeholder='Employer Email'
                    value={formData.employerEmail}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        employerEmail: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        employerEmail: "",
                      });
                    }}
                    error={!!errors.employerEmail}
                    helperText={errors.employerEmail}
                    sx={{
                      "& .MuiInputBase-root": {
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "13px",
                        height: "36px",
                      },

                      "& .MuiInputBase-input": {
                        py: 1,
                      },

                      "& .MuiFormHelperText-root": {
                        fontFamily: "Poppins, sans-serif",
                        ml: 0,
                      },
                    }}
                  />
                </Grid>

                {/* Department */}
                <Grid size={{ lg: 6, xs: 6, md: 12, sm: 12 }}>
                  <Typography
                    sx={{
                      mb: 0.8,
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Department
                  </Typography>

                  <Autocomplete
                    disableClearable
                    size='small'
                    options={employeeDepartmentList || []}
                    value={formData.department || null}
                    onChange={(e, newValue) => {
                      setFormData({
                        ...formData,
                        department: newValue || "",
                      });

                      setErrors({
                        ...errors,
                        department: "",
                      });
                    }}
                    onBlur={() => {
                      const typedValue = formData.department;
                      // If what's currently set isn't a valid option, reject it
                      if (
                        typedValue &&
                        !employeeDepartmentList.includes(typedValue)
                      ) {
                        setFormData({ ...formData, department: "" });
                        setErrors({
                          ...errors,
                          department:
                            "Please select a valid department from the list",
                        });
                      }
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder='Select Department'
                        error={!!errors.department}
                        helperText={errors.department}
                        autoComplete='off'
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password",
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Department */}
                <Grid size={{ lg: 6, xs: 6, md: 12, sm: 12 }}>
                  <Typography
                    sx={{
                      mb: 0.8,
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Employee Role
                  </Typography>

                  <Autocomplete
                    disableClearable
                    size='small'
                    options={empoyeeRoleList || []}
                    value={formData.role || null}
                    onChange={(e, newValue) => {
                      setFormData({
                        ...formData,
                        role: newValue || "",
                      });

                      setErrors({
                        ...errors,
                        role: "",
                      });
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder='Select Role'
                        error={!!errors.role}
                        helperText={errors.role}
                      />
                    )}
                  />
                </Grid>

                {/* Responsibility */}
                <Grid size={{ lg: 6, xs: 6, md: 12, sm: 12 }}>
                  <Typography
                    sx={{
                      mb: 0.8,
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Responsibility
                  </Typography>

                  <TextField
                    fullWidth
                    size='small'
                    placeholder='Enter Responsibility'
                    value={formData.responsibility}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        responsibility: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        responsibility: "",
                      });
                    }}
                    error={!!errors.responsibility}
                    helperText={errors.responsibility}
                    sx={{
                      "& .MuiInputBase-root": {
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "13px",
                        height: "36px",
                      },

                      "& .MuiInputBase-input": {
                        py: 1,
                      },

                      "& .MuiFormHelperText-root": {
                        fontFamily: "Poppins, sans-serif",
                        ml: 0,
                      },
                    }}
                  />
                </Grid>

                {/* Password */}
                <Grid size={{ lg: 6, xs: 6, md: 12, sm: 12 }}>
                  <Typography
                    sx={{
                      mb: 0.8,
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Employee TMS Password
                  </Typography>

                  <TextField
                    fullWidth
                    type='password'
                    size='small'
                    placeholder='Enter Password'
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        password: "",
                      });
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{
                      "& .MuiInputBase-root": {
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "13px",
                        height: "36px",
                      },

                      "& .MuiInputBase-input": {
                        py: 1,
                      },

                      "& .MuiFormHelperText-root": {
                        fontFamily: "Poppins, sans-serif",
                        ml: 0,
                      },
                    }}
                  />
                </Grid>

                {/* User Role */}
                <Grid size={{ lg: 6, xs: 6, md: 12, sm: 12 }}>
                  <Typography
                    sx={{
                      mb: 0.8,
                      fontSize: "13px",
                      fontWeight: 500,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Portal Role
                  </Typography>

                  <TextField
                    select
                    fullWidth
                    size='small'
                    value={formData.employee_role || ""}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        employee_role: e.target.value,
                      });

                      setErrors({
                        ...errors,
                        employee_role: "",
                      });
                    }}
                    error={!!errors.role}
                    helperText={errors.role}
                    sx={{
                      "& .MuiInputBase-root": {
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "13px",
                        height: "36px",
                      },
                      "& .MuiInputBase-input": {
                        py: 1,
                      },
                      "& .MuiFormHelperText-root": {
                        fontFamily: "Poppins, sans-serif",
                        ml: 0,
                      },
                    }}
                  >
                    <MenuItem
                      value='Admin'
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "13px",
                      }}
                    >
                      Admin
                    </MenuItem>
                    <MenuItem
                      value='User'
                      sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "13px",
                      }}
                    >
                      User
                    </MenuItem>
                  </TextField>
                </Grid>

                {/* Submit Button */}
                <Grid size={{ lg: 12, xs: 12, md: 12, sm: 12 }}>
                  <Button
                    type='submit'
                    variant='contained'
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
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      )}

      <Modal
        open={showSuccess}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          {/* <Success onClose={() => setShowSuccess(false)} /> */}
          <Success
            handleClose={() => {
              setShowSuccess(false);
              handleClose();
              refreshClient();
            }}
          />
        </Box>
      </Modal>
    </>
  );
}

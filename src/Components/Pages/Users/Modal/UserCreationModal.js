import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Paper,
} from "@mui/material";
import axios from "axios";

export default function UserCreationModal({ onSuccess, handleClose }) {
  const [formData, setFormData] = useState({
    employerId: "",
    employerName: "",
    employerEmail: "",
    department: null,
    role: null,
    responsibility: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [empoyeeRoleList, setEmployeeRolesList] = useState(null);
  const [employeeDepartmentList, setEmployeeDepartmentList] = useState(null);

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
      const payload = {
        employee_id: formData.employerId,
        employee_name: formData.employerName,
        employee_email: formData.employerEmail,
        department_name: formData.department,
        role_name: formData.role,
        responsibility: formData.responsibility,
        password: formData.password,
      };

      try {
        const response = await axios.post(
          "http://10.10.0.47:7000/user/creation",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        console.log("Success :", response.data);
        handleClose();
        onSuccess();
        alert(response.data.message);

        // Reset Form
        setFormData({
          employerId: "",
          employerName: "",
          employerEmail: "",
          department: null,
          role: null,
          responsibility: "",
          password: "",
        });

        setErrors({});
      } catch (error) {
        console.log("Error :", error);

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
      .get("http://10.10.0.47:7000/dropdown/rolename")
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
      .get("http://10.10.0.47:7000/dropdown/departmentname")
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
    <Grid>
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
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Employer ID */}
            <Grid size={{ lg: 6, xs: 12, md: 12, sm: 12 }}>
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
                size="small"
                placeholder="Employer ID"
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
            <Grid size={{ lg: 6, xs: 12, md: 12, sm: 12 }}>
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
                size="small"
                placeholder="Employer Name"
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
            <Grid size={{ lg: 6, xs: 12, md: 12, sm: 12 }}>
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
                size="small"
                placeholder="Employer Email"
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
            <Grid size={{ lg: 6, xs: 12, md: 12, sm: 12 }}>
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
                size="small"
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
                    placeholder="Select Department"
                    error={!!errors.department}
                    helperText={errors.department}
                  />
                )}
              />
            </Grid>

            {/* Department */}
            <Grid size={{ lg: 6, xs: 12, md: 12, sm: 12 }}>
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
                size="small"
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
                    placeholder="Select Role"
                    error={!!errors.role}
                    helperText={errors.role}
                  />
                )}
              />
            </Grid>

            {/* Responsibility */}
            <Grid size={{ lg: 6, xs: 12, md: 12, sm: 12 }}>
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
                size="small"
                placeholder="Enter Responsibility"
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
            <Grid size={{ lg: 6, xs: 12, md: 12, sm: 12 }}>
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
                type="password"
                size="small"
                placeholder="Enter Password"
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

            {/* Submit Button */}
            <Grid size={{ lg: 12, xs: 12, md: 12, sm: 12 }}>
              <Button
                type="submit"
                variant="contained"
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
  );
}

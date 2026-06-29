import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import axios from "axios";
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
import { useNavigate } from "react-router-dom";
import Loading from "../../../Loading/Loading";

export default function Clientform({
  open,
  handleClose,
  refreshClient,
  onSuccess,
}) {
  // const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    email: "",
    contact_person: "",
    phone_number: "",
    location: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.contact_person.trim()) {
      newErrors.contact_person = "Contact person is required";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      console.log(formData);

      const payload = {
        company_name: formData.company_name,
        industry: formData.industry,
        email: formData.email,
        contact_person: formData.contact_person,
        phone_number: formData.phone_number,
        location: formData.location,
        address: formData.address,
      };
      setLoading(true);
      axios
        .post("http://10.10.0.108:8080/client/creation", payload)
        .then((res) => {
          console.log(res.data);
          refreshClient();
          handleClose();
          // setShowSuccess(true);
          onSuccess();
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          navigate("/ErrorHandling");
        });
    }
  };

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
            width: {
              xs: "95%", // Mobile
              sm: "80%", // Tablet
              md: "600px", // Laptop
              lg: "700px", // Desktop
            },
            maxHeight: "95%",
            borderRadius: "12px",
          },
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {loading ? (
          <Loading />
        ) : (
          <>
            <CloseIcon
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                cursor: "pointer",
              }}
              onClick={(e) => {
                handleClose(e);
                setErrors({});
                setFormData({});
              }}
            />
            <Grid sx={{ padding: 3 }}>
              <Grid sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: "1.2rem",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  Add New Client
                </Typography>
              </Grid>

              <Grid
                sx={{
                  border: "1px solid #f2f2f2",
                  padding: 2,
                  borderRadius: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    // gridTemplateColumns: "1fr 1fr",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      lg: "1fr 1fr",
                    },
                    columnGap: 2,
                    rowGap: 1.5,
                  }}
                >
                  {/* Company Name */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        mb: 0.5,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Company Name
                    </Typography>

                    <TextField
                      name='company_name'
                      value={formData.company_name}
                      onChange={handleChange}
                      error={!!errors.company_name}
                      helperText={errors.company_name}
                      fullWidth
                      size='small'
                      placeholder='Enter Company Name'
                      sx={textFieldStyle}
                    />
                  </Box>

                  {/* Industry */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        mb: 0.5,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Industry
                    </Typography>

                    <TextField
                      name='industry'
                      value={formData.industry}
                      onChange={handleChange}
                      error={!!errors.industry}
                      helperText={errors.industry}
                      fullWidth
                      size='small'
                      placeholder='Enter Industry'
                      sx={textFieldStyle}
                    />
                  </Box>

                  {/* Email */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        mb: 0.5,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Email
                    </Typography>

                    <TextField
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      fullWidth
                      size='small'
                      placeholder='Enter Email'
                      sx={textFieldStyle}
                    />
                  </Box>

                  {/* Contact Person */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        mb: 0.5,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Contact Person
                    </Typography>

                    <TextField
                      name='contact_person'
                      value={formData.contact_person}
                      onChange={handleChange}
                      error={!!errors.contact_person}
                      helperText={errors.contact_person}
                      fullWidth
                      size='small'
                      placeholder='Enter Contact Person Name'
                      sx={textFieldStyle}
                    />
                  </Box>

                  {/* Phone Number */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        mb: 0.5,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Phone Number
                    </Typography>

                    <TextField
                      name='phone_number'
                      value={formData.phone_number}
                      onChange={handleChange}
                      error={!!errors.phone_number}
                      helperText={errors.phone_number}
                      fullWidth
                      size='small'
                      placeholder='Enter Phone Number'
                      sx={textFieldStyle}
                    />
                  </Box>

                  {/* Location */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 12,
                        mb: 0.5,
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      Location
                    </Typography>

                    <TextField
                      name='location'
                      value={formData.location}
                      onChange={handleChange}
                      error={!!errors.location}
                      helperText={errors.location}
                      fullWidth
                      size='small'
                      placeholder='Enter Location'
                      sx={textFieldStyle}
                    />
                  </Box>
                </Box>

                {/* Address */}
                <Box sx={{ mt: 1.5 }}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      mb: 0.5,
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Address
                  </Typography>

                  <TextField
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    fullWidth
                    multiline
                    placeholder='Enter Address'
                    size='small'
                    sx={{
                      "& .MuiInputBase-root": {
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12px",
                        minHeight: "32px", // reduced height
                        borderRadius: "3px",
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
                    }}
                  />
                </Box>

                {/* Buttons */}
                <Grid
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                    type='submit'
                    variant='contained'
                    sx={{
                      color: "white",
                      background: "#ff2d55",
                      borderRadius: "8px",
                      px: 2,
                      py: 0.8,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: "none",

                      "&:hover": {
                        background: "#e3264b",
                        boxShadow: "none",
                      },
                    }}
                    onClick={handleSubmit}
                  >
                    Create Client
                  </Button>

                  <Button
                    type='button'
                    variant='outlined'
                    onClick={handleClose}
                    sx={{
                      color: "#ff2d55",
                      border: "1px solid #ff2d55",

                      borderRadius: "8px",
                      px: 2,
                      py: 0.8,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      fontFamily: "'Poppins', sans-serif",
                      boxShadow: "none",

                      "&:hover": {
                        border: "1px solid #ff2d55",
                        boxShadow: "none",
                        background: "transparent",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Dialog>
    </React.Fragment>
  );
}
// export default Clientform;

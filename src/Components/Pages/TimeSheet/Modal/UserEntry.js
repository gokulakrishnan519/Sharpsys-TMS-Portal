import React, { useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import MoneyOffOutlinedIcon from "@mui/icons-material/MoneyOffOutlined";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

const clientOptions = [
  "Acme Corp",
  "TechVision",
  "Globex",
  "Initech",
  "Umbrella Ltd",
];
const projectOptions = [
  "ERP Development",
  "IoT Dashboard",
  "SCADA Monitoring",
  "React Web App",
  "API Integration",
];
const statusOptions = ["Progress", "Completed"];

const LEAVE_TYPES = [
  {
    value: "casual",
    label: "Casual Leave",
    shortLabel: "CL",
    icon: <BeachAccessOutlinedIcon sx={{ fontSize: 18 }} />,
    description: "Personal errands, family events, or short breaks",
    color: "#f97316",
    bg: "#fff7ed",
    border: "#fed7aa",
  },
  {
    value: "sick",
    label: "Sick Leave",
    shortLabel: "SL",
    icon: <LocalHospitalOutlinedIcon sx={{ fontSize: 18 }} />,
    description: "Medical appointments or health-related absence",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
  },
  {
    value: "lop",
    label: "Loss of Pay",
    shortLabel: "LOP",
    icon: <MoneyOffOutlinedIcon sx={{ fontSize: 18 }} />,
    description: "Unpaid leave when paid leave balance is exhausted",
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
  },
];

const cellSx = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "11px",
  fontWeight: 600,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  py: 1.2,
  px: 2,
  borderBottom: "1px solid #f0f0f0",
  background: "#fafafa",
  whiteSpace: "nowrap",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13.5px",
    borderRadius: "8px",
    background: "#fff",
    "& fieldset": { borderColor: "#e5e7eb", borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "#c0c4cc" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6", borderWidth: "1.5px" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#b0b5bd",
    opacity: 1,
    fontFamily: "'DM Sans', sans-serif",
  },
};

const errorInputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13.5px",
    borderRadius: "8px",
    background: "#fff",
    "& fieldset": { borderColor: "#fca5a5", borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "#ef4444" },
    "&.Mui-focused fieldset": { borderColor: "#ef4444", borderWidth: "1.5px" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#fca5a5",
    opacity: 1,
    fontFamily: "'DM Sans', sans-serif",
  },
};

const purpleInputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13.5px",
    borderRadius: "8px",
    background: "#fff",
    "& fieldset": { borderColor: "#c4b5fd", borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "#8b5cf6" },
    "&.Mui-focused fieldset": { borderColor: "#7c3aed", borderWidth: "1.5px" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#c4b5fd",
    opacity: 1,
    fontFamily: "'DM Sans', sans-serif",
  },
};

const purpleErrorInputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13.5px",
    borderRadius: "8px",
    background: "#fff",
    "& fieldset": { borderColor: "#fca5a5", borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "#ef4444" },
    "&.Mui-focused fieldset": { borderColor: "#ef4444", borderWidth: "1.5px" },
  },
};

export default function TimesheetForm() {
  const [rows, setRows] = useState([
    {
      client: null,
      project: null,
      description: "",
      hours: "",
      status: null,
      reason: "",
    },
  ]);
  const [submitted, setSubmitted] = useState(false);

  // Permission state
  const [showPermission, setShowPermission] = useState(false);
  const [permissionHours, setPermissionHours] = useState("");
  const [permissionReason, setPermissionReason] = useState("");

  // Leave Modal state
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveFromDate, setLeaveFromDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [leaveToDate, setLeaveToDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [leaveSubmitError, setLeaveSubmitError] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(null);

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];
    if (!isValidRow(lastRow)) {
      setSubmitted(true);
      return;
    }
    setRows([
      ...rows,
      {
        client: null,
        project: null,
        description: "",
        hours: "",
        status: null,
        reason: "",
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    if (field === "status" && value !== "Progress") {
      updated[index].reason = "";
    }
    setRows(updated);
  };

  const togglePermission = () => {
    if (showPermission) {
      setPermissionHours("");
      setPermissionReason("");
    }
    setShowPermission((prev) => !prev);
  };

  const isReasonRequired = (row) => row.status === "Progress";
  const isReasonError = (row) =>
    submitted && isReasonRequired(row) && !row.reason.trim();

  const permissionHoursValue = parseFloat(permissionHours) || 0;
  const rowsTotal = rows.reduce(
    (sum, r) => sum + (parseFloat(r.hours) || 0),
    0,
  );
  const totalHours = rowsTotal + (showPermission ? permissionHoursValue : 0);

  const isPermissionReasonError =
    submitted && showPermission && !permissionReason.trim();

  const isRowFilled = (row) =>
    row.client ||
    row.project ||
    row.description.trim() ||
    row.hours ||
    row.status ||
    row.reason.trim();

  const isValidRow = (row) =>
    row.client &&
    row.project &&
    row.description.trim() &&
    row.hours &&
    row.status &&
    (row.status !== "Progress" || row.reason.trim());

  const canSubmit =
    rows.some((row) => isRowFilled(row)) &&
    rows.every((row) => !isRowFilled(row) || isValidRow(row)) &&
    (!showPermission || (permissionHours && permissionReason.trim()));

  // Leave handlers
  const handleLeaveOpen = () => {
    setSelectedLeaveType("");
    setLeaveReason("");
    setLeaveFromDate(dayjs().format("YYYY-MM-DD"));
    setLeaveToDate(dayjs().format("YYYY-MM-DD"));
    setLeaveSubmitError(false);
    setLeaveSuccess(null);
    setLeaveModalOpen(true);
  };

  const handleLeaveClose = () => {
    setLeaveModalOpen(false);
  };

  const handleSubmit = () => {
    // setSubmitted(true);
    // const rowError = rows.some(
    //   (row) => isReasonRequired(row) && !row.reason.trim(),
    // );
    // const permError = showPermission && !permissionReason.trim();
    // if (!rowError && !permError) {
    //   alert("Timesheet submitted successfully!");
    //   setSubmitted(false);
    // }

    console.log({
      data: rows,
      permissionHours: permissionHours,
      permissionReason: permissionReason,
    });
  };

  const handleLeaveSubmit = () => {
    if (!selectedLeaveType || !leaveReason.trim()) {
      setLeaveSubmitError(true);
      return;
    }
    const leaveLabel = LEAVE_TYPES.find(
      (l) => l.value === selectedLeaveType,
    )?.label;
    setLeaveSuccess(
      `${leaveLabel} applied from ${dayjs(leaveFromDate).format("DD MMM")} to ${dayjs(leaveToDate).format("DD MMM YYYY")}`,
    );

    console.log({
      leave_type: selectedLeaveType,
      leaveFromDate: leaveFromDate,
      leaveToDate: leaveToDate,
      leaveReason: leaveReason,
    });

    // setTimeout(() => {
    //   setLeaveModalOpen(false);
    //   setLeaveSuccess(null);
    // }, 1800);
  };

  const selectedLeaveInfo = LEAVE_TYPES.find(
    (l) => l.value === selectedLeaveType,
  );

  return (
    <Box
      sx={{
        background: "#f5f6f8",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        px: 2,
        py: 2,
        fontFamily: "'DM Sans', sans-serif",
        borderRadius: "5px",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 1400,
          borderRadius: "16px",
          border: "1px solid #e8eaed",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3.5,
            py: 2.5,
            borderBottom: "1px solid #f0f1f3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "20px",
                fontWeight: 600,
                color: "#111827",
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              Timesheet Entry
            </Typography>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                color: "#9ca3af",
                mt: 0.3,
              }}
            >
              Log your daily work hours below
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                background: totalHours > 0 ? "#eff6ff" : "#f9fafb",
                border: `1px solid ${totalHours > 0 ? "#bfdbfe" : "#e5e7eb"}`,
                borderRadius: "8px",
                px: 1.5,
                py: 0.7,
              }}
            >
              <AccessTimeOutlinedIcon
                sx={{
                  fontSize: 14,
                  color: totalHours > 0 ? "#3b82f6" : "#9ca3af",
                }}
              />
              <Typography
                sx={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: totalHours > 0 ? "#1d4ed8" : "#6b7280",
                }}
              >
                {totalHours.toFixed(1)} hrs
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                px: 1.5,
                py: 0.7,
              }}
            >
              <CalendarTodayOutlinedIcon
                sx={{ fontSize: 13, color: "#9ca3af" }}
              />
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                {dayjs().format("DD MMM YYYY")}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer sx={{ px: 0, maxHeight: 280 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...cellSx, width: "14%" }}>Client</TableCell>
                <TableCell sx={{ ...cellSx, width: "14%" }}>Project</TableCell>
                <TableCell sx={cellSx}>Description</TableCell>
                <TableCell sx={{ ...cellSx, width: "90px" }}>Hours</TableCell>
                <TableCell sx={{ ...cellSx, width: "130px" }}>Status</TableCell>
                <TableCell sx={{ ...cellSx, width: "18%" }}>
                  Reason{" "}
                  <span
                    style={{
                      color: "#9ca3af",
                      fontWeight: 400,
                      textTransform: "none",
                      fontSize: "10px",
                      letterSpacing: 0,
                    }}
                  >
                    (if Progress)
                  </span>
                </TableCell>
                <TableCell sx={{ ...cellSx, width: "50px" }} />
                <TableCell sx={{ ...cellSx, width: "50px" }} />
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": { background: "#fafbff" },
                    "&:last-child td": { borderBottom: "none" },
                    transition: "background 0.12s",
                  }}
                >
                  <TableCell
                    sx={{ px: 2, py: 1.2, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <Autocomplete
                      disableClearable
                      options={clientOptions}
                      value={row.client}
                      onChange={(_, v) => handleChange(index, "client", v)}
                      size='small'
                      sx={inputSx}
                      slotProps={{
                        paper: {
                          sx: {
                            fontFamily: "Poppins, sans-serif", // Your font
                            fontSize: "12px",
                          },
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder='Select client'
                          size='small'
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell
                    sx={{ px: 2, py: 1.2, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <Autocomplete
                      disableClearable
                      options={projectOptions}
                      value={row.project}
                      onChange={(_, v) => handleChange(index, "project", v)}
                      size='small'
                      sx={inputSx}
                      slotProps={{
                        paper: {
                          sx: {
                            fontFamily: "Poppins, sans-serif", // Your font
                            fontSize: "12px",
                          },
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder='Select project'
                          size='small'
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell
                    sx={{ px: 2, py: 1.2, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <TextField
                      fullWidth
                      multiline
                      size='small'
                      placeholder='What did you work on?'
                      value={row.description}
                      onChange={(e) =>
                        handleChange(index, "description", e.target.value)
                      }
                      sx={inputSx}
                    />
                  </TableCell>

                  <TableCell
                    sx={{ px: 2, py: 1.2, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <TextField
                      fullWidth
                      size='small'
                      type='number'
                      placeholder='0.0'
                      value={row.hours}
                      inputProps={{ min: 0, max: 24, step: 0.5 }}
                      onChange={(e) =>
                        handleChange(index, "hours", e.target.value)
                      }
                      sx={{
                        ...inputSx,
                        "& input": {
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "13px",
                          textAlign: "right",
                          width: 50,
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell
                    sx={{ px: 2, py: 1.2, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <Autocomplete
                      disableClearable
                      options={statusOptions}
                      value={row.status}
                      onChange={(_, v) => handleChange(index, "status", v)}
                      size='small'
                      sx={inputSx}
                      renderOption={(props, option) => (
                        <li {...props}>
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              px: 1,
                              py: 0.3,
                              borderRadius: "5px",
                              fontSize: "12px",
                              fontWeight: 600,
                              fontFamily: "'DM Sans', sans-serif",
                              ...(option === "Progress"
                                ? { background: "#fffbeb", color: "#d97706" }
                                : { background: "#f0fdf4", color: "#16a34a" }),
                            }}
                          >
                            {option === "Progress" ? "⏳ " : "✅ "}
                            {option}
                          </Box>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder='Select status'
                          size='small'
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: row.status ? (
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  px: 0.8,
                                  py: 0.2,
                                  borderRadius: "5px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  fontFamily: "'DM Sans', sans-serif",
                                  mr: 0.5,
                                  ...(row.status === "Progress"
                                    ? {
                                        background: "#fffbeb",
                                        color: "#d97706",
                                        border: "1px solid #fde68a",
                                      }
                                    : {
                                        background: "#f0fdf4",
                                        color: "#16a34a",
                                        border: "1px solid #bbf7d0",
                                      }),
                                }}
                              >
                                {row.status === "Progress" ? "⏳" : "✅"}
                              </Box>
                            ) : null,
                          }}
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell
                    sx={{ px: 2, py: 1.2, borderBottom: "1px solid #f0f0f0" }}
                  >
                    <TextField
                      fullWidth
                      multiline
                      maxRows={3}
                      size='small'
                      placeholder={
                        isReasonRequired(row)
                          ? "Required — explain progress…"
                          : "Optional"
                      }
                      value={row.reason}
                      disabled={!isReasonRequired(row)}
                      onChange={(e) =>
                        handleChange(index, "reason", e.target.value)
                      }
                      error={isReasonError(row)}
                      helperText={
                        isReasonError(row) ? "Reason is required" : ""
                      }
                      sx={
                        isReasonError(row)
                          ? errorInputSx
                          : !isReasonRequired(row)
                            ? {
                                "& .MuiOutlinedInput-root": {
                                  fontFamily: "'DM Sans', sans-serif",
                                  fontSize: "13.5px",
                                  borderRadius: "8px",
                                  background: "#f9fafb",
                                  "& fieldset": {
                                    borderColor: "#f0f0f0",
                                    borderWidth: "1px",
                                  },
                                },
                                "& .MuiInputBase-input": {
                                  color: "#c0c4cc",
                                  fontFamily: "'DM Sans', sans-serif",
                                },
                                "& .MuiInputBase-input::placeholder": {
                                  color: "#d1d5db",
                                  opacity: 1,
                                },
                              }
                            : inputSx
                      }
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      px: 1,
                      py: 1.2,
                      borderBottom: "1px solid #f0f0f0",
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      size='small'
                      onClick={handleAddRow}
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "7px",
                        border: "1px solid #dbeafe",
                        background: "#eff6ff",
                        color: "#3b82f6",
                        "&:hover": {
                          background: "#dbeafe",
                          border: "1px solid #93c5fd",
                        },
                        transition: "all 0.12s",
                      }}
                    >
                      <AddIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </TableCell>

                  <TableCell
                    sx={{
                      px: 1,
                      py: 1.2,
                      borderBottom: "1px solid #f0f0f0",
                      textAlign: "center",
                    }}
                  >
                    <IconButton
                      size='small'
                      onClick={() => handleDeleteRow(index)}
                      disabled={rows.length === 1}
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "7px",
                        border: "1px solid #fee2e2",
                        background: "#fef2f2",
                        color: "#ef4444",
                        "&:hover": {
                          background: "#fee2e2",
                          border: "1px solid #fca5a5",
                        },
                        "&.Mui-disabled": {
                          opacity: 0.35,
                          border: "1px solid #e5e7eb",
                          background: "#f9fafb",
                        },
                        transition: "all 0.12s",
                      }}
                    >
                      <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {showPermission && (
                <TableRow sx={{ background: "#faf5ff" }}>
                  <TableCell
                    colSpan={8}
                    sx={{ px: 3, py: 1.5, borderBottom: "1px solid #ede9fe" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.6,
                        mb: 1,
                      }}
                    >
                      <LockOutlinedIcon
                        sx={{ fontSize: 13, color: "#7c3aed" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#7c3aed",
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                        }}
                      >
                        Permission Hours
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "11px",
                            color: "#6b7280",
                            fontWeight: 500,
                          }}
                        >
                          Hours
                        </Typography>
                        <TextField
                          size='small'
                          type='number'
                          placeholder='0.0'
                          value={permissionHours}
                          inputProps={{ min: 0, max: 24, step: 0.5 }}
                          onChange={(e) => setPermissionHours(e.target.value)}
                          sx={{
                            width: 100,
                            ...purpleInputSx,
                            "& input": {
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "13px",
                              textAlign: "right",
                            },
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          minWidth: 220,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "11px",
                            color: "#6b7280",
                            fontWeight: 500,
                          }}
                        >
                          Reason for Permission
                        </Typography>
                        <TextField
                          fullWidth
                          size='small'
                          placeholder='Enter reason for permission…'
                          value={permissionReason}
                          onChange={(e) => setPermissionReason(e.target.value)}
                          error={isPermissionReasonError}
                          helperText={
                            isPermissionReasonError ? "Reason is required" : ""
                          }
                          sx={
                            isPermissionReasonError
                              ? purpleErrorInputSx
                              : purpleInputSx
                          }
                        />
                      </Box>

                      {permissionHoursValue > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            background: "#ede9fe",
                            border: "1px solid #c4b5fd",
                            borderRadius: "8px",
                            px: 1.5,
                            py: 0.7,
                            mt: 2.8,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <AccessTimeOutlinedIcon
                            sx={{ fontSize: 13, color: "#7c3aed" }}
                          />
                          <Typography
                            sx={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "12px",
                              fontWeight: 500,
                              color: "#6d28d9",
                            }}
                          >
                            {permissionHoursValue.toFixed(1)} hrs
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box
          sx={{
            px: 3.5,
            py: 2,
            borderTop: "1px solid #f0f1f3",
            background: "#fafafa",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            {rows.length} {rows.length === 1 ? "entry" : "entries"}{" "}
            &nbsp;·&nbsp;{" "}
            <span style={{ color: "#374151", fontWeight: 500 }}>
              {totalHours.toFixed(1)} hrs total
            </span>
            {showPermission && permissionHoursValue > 0 && (
              <>
                &nbsp;·&nbsp;
                <span style={{ color: "#7c3aed", fontWeight: 500 }}>
                  Permission: {permissionHoursValue.toFixed(1)} hrs
                </span>
              </>
            )}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 1.2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant='outlined'
              size='small'
              onClick={() => {
                setSubmitted(false);
                setShowPermission(false);
                setPermissionHours("");
                setPermissionReason("");
                setRows([
                  {
                    client: null,
                    project: null,
                    description: "",
                    hours: "",
                    status: null,
                    reason: "",
                  },
                ]);
              }}
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "8px",
                px: 2.2,
                py: 0.8,
                borderColor: "#e5e7eb",
                color: "#6b7280",
                "&:hover": { borderColor: "#c0c4cc", background: "#f5f6f8" },
              }}
            >
              Clear all
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              {!canSubmit && (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#ef4444",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Complete all required fields to submit the timesheet.
                </Typography>
              )}

              <Button
                variant='contained'
                size='small'
                disableElevation
                onClick={handleSubmit}
                disabled={!canSubmit}
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2.5,
                  py: 0.8,
                  background: "#3b82f6",
                  "&:hover": { background: "#2563eb" },
                  "&.Mui-disabled": { background: "#d1d5db", color: "#9ca3af" },
                }}
              >
                Submit Timesheet
              </Button>

              {/* Apply Leave button */}
              <Button
                variant='contained'
                size='small'
                disableElevation
                onClick={handleLeaveOpen}
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2.5,
                  py: 0.8,
                  background: "#f97316",
                  "&:hover": { background: "#ea580c" },
                }}
              >
                Apply Leave
              </Button>

              <Button
                variant='contained'
                size='small'
                disableElevation
                onClick={togglePermission}
                startIcon={
                  <LockOutlinedIcon sx={{ fontSize: "14px !important" }} />
                }
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2.5,
                  py: 0.8,
                  background: showPermission ? "#6d28d9" : "#7c3aed",
                  "&:hover": { background: "#6d28d9" },
                  boxShadow: showPermission
                    ? "inset 0 1px 3px rgba(0,0,0,0.2)"
                    : "none",
                }}
              >
                {showPermission ? "Hide Permission" : "Permission"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ── Apply Leave Modal ── */}
      <Dialog
        open={leaveModalOpen}
        onClose={handleLeaveClose}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "16px",
            border: "1px solid #e8eaed",
            fontFamily: "'DM Sans', sans-serif",
            overflow: "hidden",
          },
        }}
      >
        {/* Modal Header */}
        <DialogTitle
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: "1px solid #f0f1f3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "17px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Apply Leave
            </Typography>
            <Typography
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "12.5px",
                color: "#9ca3af",
                mt: 0.2,
              }}
            >
              Select the type of leave you want to apply
            </Typography>
          </Box>
          <IconButton
            size='small'
            onClick={handleLeaveClose}
            sx={{
              color: "#9ca3af",
              "&:hover": { background: "#f3f4f6", color: "#374151" },
              borderRadius: "8px",
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
          {leaveSuccess ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 4,
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "#f0fdf4",
                  border: "2px solid #bbf7d0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                }}
              >
                ✅
              </Box>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#16a34a",
                }}
              >
                Leave Applied Successfully!
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                {leaveSuccess}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Leave Type Selection */}
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  mb: 1.5,
                }}
              >
                Leave Type
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mb: 2.5,
                }}
              >
                {LEAVE_TYPES.map((leave) => {
                  const isSelected = selectedLeaveType === leave.value;
                  return (
                    <Box
                      key={leave.value}
                      onClick={() => setSelectedLeaveType(leave.value)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 1.5,
                        borderRadius: "10px",
                        border: `1.5px solid ${isSelected ? leave.color : "#e5e7eb"}`,
                        background: isSelected ? leave.bg : "#fff",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": {
                          border: `1.5px solid ${leave.color}`,
                          background: leave.bg,
                        },
                      }}
                    >
                      {/* Icon */}
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "9px",
                          background: isSelected ? leave.border : "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: isSelected ? leave.color : "#9ca3af",
                          transition: "all 0.15s",
                          flexShrink: 0,
                        }}
                      >
                        {leave.icon}
                      </Box>

                      {/* Label + desc */}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "13.5px",
                            fontWeight: 600,
                            color: isSelected ? leave.color : "#111827",
                          }}
                        >
                          {leave.label}
                          <Box
                            component='span'
                            sx={{
                              ml: 1,
                              px: 0.8,
                              py: 0.15,
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: 700,
                              background: isSelected ? leave.color : "#e5e7eb",
                              color: isSelected ? "#fff" : "#6b7280",
                              verticalAlign: "middle",
                            }}
                          >
                            {leave.shortLabel}
                          </Box>
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "12px",
                            color: "#9ca3af",
                            mt: 0.2,
                          }}
                        >
                          {leave.description}
                        </Typography>
                      </Box>

                      {/* Radio */}
                      <Box
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          border: `2px solid ${isSelected ? leave.color : "#d1d5db"}`,
                          background: isSelected ? leave.color : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.15s",
                        }}
                      >
                        {isSelected && (
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#fff",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {leaveSubmitError && !selectedLeaveType && (
                <Typography
                  sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    color: "#ef4444",
                    mb: 1.5,
                  }}
                >
                  Please select a leave type.
                </Typography>
              )}

              <Divider sx={{ mb: 2.5, borderColor: "#f0f1f3" }} />

              {/* Date Range */}
              <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      mb: 1,
                    }}
                  >
                    From Date
                  </Typography>
                  <TextField
                    fullWidth
                    size='small'
                    type='date'
                    value={leaveFromDate}
                    onChange={(e) => setLeaveFromDate(e.target.value)}
                    sx={{
                      ...inputSx,
                      ...(selectedLeaveInfo
                        ? {
                            "& .MuiOutlinedInput-root": {
                              ...inputSx["& .MuiOutlinedInput-root"],
                              "&.Mui-focused fieldset": {
                                borderColor: selectedLeaveInfo.color,
                                borderWidth: "1.5px",
                              },
                            },
                          }
                        : {}),
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      mb: 1,
                    }}
                  >
                    To Date
                  </Typography>
                  <TextField
                    fullWidth
                    size='small'
                    type='date'
                    value={leaveToDate}
                    onChange={(e) => setLeaveToDate(e.target.value)}
                    sx={inputSx}
                  />
                </Box>
              </Box>

              {/* Reason */}
              <Box sx={{ mb: 1 }}>
                <Typography
                  sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    mb: 1,
                  }}
                >
                  Reason
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  size='small'
                  placeholder='Brief reason for your leave…'
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  error={leaveSubmitError && !leaveReason.trim()}
                  helperText={
                    leaveSubmitError && !leaveReason.trim()
                      ? "Please enter a reason."
                      : ""
                  }
                  sx={
                    leaveSubmitError && !leaveReason.trim()
                      ? errorInputSx
                      : inputSx
                  }
                />
              </Box>
            </>
          )}
        </DialogContent>

        {!leaveSuccess && (
          <DialogActions
            sx={{
              px: 3,
              py: 2,
              borderTop: "1px solid #f0f1f3",
              background: "#fafafa",
              gap: 1,
            }}
          >
            <Button
              variant='outlined'
              size='small'
              onClick={handleLeaveClose}
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "8px",
                px: 2.2,
                py: 0.8,
                borderColor: "#e5e7eb",
                color: "#6b7280",
                "&:hover": { borderColor: "#c0c4cc", background: "#f5f6f8" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              size='small'
              disableElevation
              onClick={handleLeaveSubmit}
              sx={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "8px",
                px: 2.5,
                py: 0.8,
                background: selectedLeaveInfo?.color || "#f97316",
                "&:hover": {
                  background: selectedLeaveInfo?.color || "#ea580c",
                  filter: "brightness(0.92)",
                },
              }}
            >
              Submit Leave
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
}

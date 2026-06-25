import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
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
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import Loading from "../../../../Loading/Loading";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

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

export default function TimesheetForm(props) {
  const [rows, setRows] = useState([
    {
      clientId: null,
      clientName: null,
      projectId: "",
      projectName: null,
      taskname: null,
      workDescription: "",
      hoursWorked: "",
      status: null,
      reason: "",
      requestType: "Timesheet",
      employee_id: sessionStorage.getItem("employeeId"),
      departmentId: sessionStorage.getItem("departmentId"),
      workDate: props.passData.workDate,
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

  const [clientOptions, setClientOptions] = useState([]);
  const [projectOption, setProjectOption] = useState([]);
  const [taskMasterList, setTaskMasterList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [timesheetSuccess, setTimesheetSuccess] = useState("");
  const [dateType, setDateType] = useState(0); // 0 = Single Date, 1 = Custom Date

  const navigate = useNavigate();

  const handleAddRow = () => {
    const isAllRowsValid = rows.every((row) => {
      return (
        row.clientId &&
        row.clientName &&
        row.projectId &&
        row.taskname &&
        row.projectName &&
        row.workDescription?.trim() !== "" &&
        row.hoursWorked !== "" &&
        row.hoursWorked !== null &&
        row.hoursWorked !== undefined &&
        row.status &&
        (row.status === "Completed" ||
          (row.status === "Progress" && row.reason?.trim() !== ""))
      );
    });

    if (!isAllRowsValid) {
      // setSubmitted(true);
      return;
    }

    setRows([
      ...rows,
      {
        clientId: null,
        clientName: null,
        projectId: "",
        projectName: "",
        taskname: "",
        workDescription: "",
        hoursWorked: "",
        status: null,
        reason: "",
        requestType: "Timesheet",

        employee_id: sessionStorage.getItem("employeeId"),
        departmentId: sessionStorage.getItem("departmentId"),
        workDate: props.passData.workDate,
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];

    updatedRows[index] = {
      ...updatedRows[index],
      [field]:
        field === "hoursWorked" ? (value === "" ? "" : Number(value)) : value,
    };

    setRows(updatedRows);
  };

  console.log(rows);

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

  // const isRowFilled = (row) =>
  //   row.clientName ||
  //   row.projectName ||
  //   row.workDescription.trim() ||
  //   row.hoursWorked ||
  //   row.status ||
  //   row.reason.trim();

  // const isValidRow = (row) =>
  //   row.clientName &&
  //   row.projectName &&
  //   row.description.trim() &&
  //   row.hoursWorked &&
  //   row.status &&
  //   (row.status !== "Progress" || row.reason.trim());

  // const canSubmit =
  //   rows.some((row) => isRowFilled(row)) &&
  //   rows.every((row) => !isRowFilled(row) || isValidRow(row)) &&
  //   (!showPermission || (permissionHours && permissionReason.trim()));

  // Leave handlers

  console.log(props.passData.workDate);

  const handleLeaveOpen = () => {
    setSelectedLeaveType("");
    setLeaveReason("");
    setLeaveFromDate(dayjs(props.passData?.workDate).format("YYYY-MM-DD"));
    setLeaveToDate(dayjs(props.passData?.workDate).format("YYYY-MM-DD"));
    setLeaveSubmitError(false);
    setLeaveSuccess(null);
    setLeaveModalOpen(true);

    setPermissionHours("");
    setPermissionReason("");
    setShowPermission(false);
    setRows([
      {
        clientId: null,
        clientName: null,
        projectId: "",
        projectName: null,
        workDescription: "",
        hoursWorked: "",
        status: null,
        reason: "",
        requestType: "Timesheet",
        employee_id: sessionStorage.getItem("employeeId"),
        departmentId: sessionStorage.getItem("departmentId"),
        workDate: props.passData.workDate,
      },
    ]);
  };

  const handleLeaveClose = () => {
    setLeaveModalOpen(false);
  };

  const handleSubmit = () => {
    setLoading(true);

    const payload = showPermission
      ? [
          ...rows.filter(
            (item) =>
              item.timesheetId === null ||
              item.timesheetId === undefined ||
              item.timesheetId === "",
          ),
          {
            requestType: "Permission",
            permissionHours,
            permissionReason,
            employee_id: sessionStorage.getItem("employeeId"),
            departmentId: sessionStorage.getItem("departmentId"),
            workDate: props.passData.workDate,
            timesheetId: rows[0]?.timesheetId, // First object's timesheetId
          },
        ]
      : rows.filter(
          (item) =>
            item.timesheetId === null ||
            item.timesheetId === undefined ||
            item.timesheetId === "",
        );

    axios
      .post(`http://10.10.0.108:8000/timesheet/create`, payload)
      .then((res) => {
        console.log(res.data);
        setLoading(false);

        const totalHours = rows.reduce(
          (sum, row) => sum + (parseFloat(row.hoursWorked) || 0),
          0,
        );

        setTimesheetSuccess(
          `Timesheet submitted successfully for ${dayjs().format(
            "DD MMM YYYY",
          )} (${totalHours.toFixed(1)} hrs)`,
        );
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

  const handleLeaveSubmit = () => {
    if (!selectedLeaveType || !leaveReason.trim()) {
      setLeaveSubmitError(true);
      return;
    }
    const leaveLabel = LEAVE_TYPES.find(
      (l) => l.value === selectedLeaveType,
    )?.label;

    setLoading(true);

    const payload = [
      {
        requestType: "Leave",
        leave_type: selectedLeaveType,
        startDate: dayjs(leaveFromDate).format("YYYY-MM-DD"),
        endDate: dayjs(leaveToDate).format("YYYY-MM-DD"),
        leaveReason: leaveReason,
        employee_id: sessionStorage.getItem("employeeId"),
        departmentId: sessionStorage.getItem("departmentId"),
        workDate: props.passData.workDate,
      },
    ];

    axios
      .post(`http://10.10.0.108:8000/timesheet/create`, payload)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        setLeaveSuccess(
          `${leaveLabel} applied from ${dayjs(leaveFromDate).format("DD MMM")} to ${dayjs(leaveToDate).format("DD MMM YYYY")}`,
        );
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.message || "Login failed";

        console.log(err);
        //navigate("/ErrorHandling");
        sessionStorage.setItem("errormessge", errorMessage);
        setLoading(false);
      });
  };

  const selectedLeaveInfo = LEAVE_TYPES.find(
    (l) => l.value === selectedLeaveType,
  );

  const handleChangeClients = (index, value) => {
    const updatedRows = [...rows];

    console.log(value);

    updatedRows[index] = {
      ...updatedRows[index],
      clientId: value?.clientId || "",
      clientName: value?.clientName || "",
    };

    setRows(updatedRows);

    console.log(updatedRows);
  };

  const handleChangeProjects = (index, value) => {
    const updatedRows = [...rows];

    updatedRows[index] = {
      ...updatedRows[index],
      ProjectID: value?.ProjectID ?? "",
      projectName: value?.projectName ?? "",
    };

    taskMaster(value?.ProjectID, index);

    setRows(updatedRows);
  };

  const handleChangeTask = (index, value) => {
    const updatedRows = [...rows];

    updatedRows[index] = {
      ...updatedRows[index],
      task_id: value?.taskid ?? "",
      taskname: value?.taskname ?? "",
    };

    setRows(updatedRows);
  };

  // Get Client List
  const clientMaster = async () => {
    try {
      const response = await axios.get(
        "http://10.10.0.108:8000/dropdown/clientname",
      );

      const client = response.data.map((item) => ({
        clientId: item.ClientID,
        clientName: item.CompanyName,
      }));

      setClientOptions(client);
    } catch (error) {
      console.error("Error fetching client names:", error);
    }
  };

  // Get Project List
  const projectMaster = async () => {
    try {
      const response = await axios
        .get("http://10.10.0.108:8000/dropdown/timesheetproject")
        .then((res) => {
          setProjectOption(res.data);
        });

      // const projects = response.data.projects.map((item) => ({
      //   projectId: item.ProjectID,
      //   projectName: item.ProjectName,
      // }));
    } catch (error) {
      console.error("Error fetching client names:", error);
    }
  };

  // Get Project List
  const taskMaster = async (id, index) => {
    const payload = {
      project_id: id,
      employee_id: sessionStorage.getItem("employeeId"),
    };

    try {
      const response = await axios.post(
        "http://10.10.0.108:8000/dropdown/tasks",
        payload,
      );

      // const projects = response.data.projects.map((item) => ({
      //   projectId: item.ProjectID,
      //   projectName: item.ProjectName,
      // }));

      setTaskMasterList(response.data);

      setRows((prevRows) =>
        prevRows.map((row, i) =>
          i === index ? { ...row, taskname: "" } : row,
        ),
      );
    } catch (error) {
      console.error("Error fetching client names:", error);
    }
  };

  useEffect(() => {
    clientMaster();
    projectMaster();
  }, []);

  const isSubmitEnabled = rows.every((row) => {
    return (
      row.clientId &&
      row.clientName &&
      row.projectId &&
      row.projectName &&
      row.taskname &&
      row.workDescription?.trim() !== "" &&
      row.hoursWorked !== "" &&
      row.hoursWorked !== null &&
      row.hoursWorked !== undefined &&
      row.status &&
      (row.status === "Completed" ||
        (row.status === "Progress" && row.reason?.trim() !== ""))
    );
  });

  useEffect(() => {
    const entries = props.passData?.entries || [];

    if (entries.length > 0) {
      // Set Timesheet rows
      setRows(
        entries
          .filter((item) => item.requestType === "Timesheet")
          .map((item) => ({
            clientId: item.clientId,
            clientName: item.clientName,
            projectId: item.projectId,
            projectName: item.project,
            taskname: item.taskname,
            workDescription: item.workDescription,
            hoursWorked: item.hours,
            status: item.status,
            reason: item.reason,
            requestType: "Timesheet",
            employee_id: item.employeeId,
            departmentId: item.departmentId,
            workDate: item.workDate,
            timesheetId: item.timesheetId,
          })),
      );

      // Find Permission object
      const permissionData = entries.find(
        (item) => item.requestType === "Permission",
      );

      if (permissionData) {
        setShowPermission(true);
        setPermissionHours(permissionData.permissionHours);
        setPermissionReason(permissionData.permissionReason);
      } else {
        setShowPermission(false);
        setPermissionHours("");
        setPermissionReason("");
      }
    }
  }, [props.passData]);

  return (
    <>
      {loading ? (
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
            height: 300,
          }}
        >
          <CircularProgress color="secondary" aria-label="Loading…" />
        </Box>
      ) : (
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

          {timesheetSuccess ? (
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
                Timesheet Submitted Successfully!
              </Typography>

              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "#6b7280",
                  textAlign: "center",
                }}
              >
                {timesheetSuccess}
              </Typography>
            </Box>
          ) : (
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
                      {dayjs(props.passData?.workDate).format("DD MMM YYYY")}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Table */}
              <TableContainer sx={{ px: 0, maxHeight: 250 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ ...cellSx, width: "14%" }}>
                        Client
                      </TableCell>
                      <TableCell sx={{ ...cellSx, width: "14%" }}>
                        Project
                      </TableCell>
                      <TableCell sx={cellSx}>Task</TableCell>
                      <TableCell sx={cellSx}>Description</TableCell>

                      <TableCell sx={{ ...cellSx, width: "90px" }}>
                        Hours
                      </TableCell>
                      <TableCell sx={{ ...cellSx, width: "130px" }}>
                        Status
                      </TableCell>
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
                          sx={{
                            px: 2,
                            py: 1.2,
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <Autocomplete
                            key={index}
                            disableClearable
                            options={clientOptions}
                            value={
                              clientOptions.find(
                                (item) => item.clientId === row.clientId,
                              ) || null
                            }
                            onChange={(_, value) =>
                              handleChangeClients(index, value)
                            }
                            getOptionLabel={(option) =>
                              `${option.clientName} - ${option.clientId}`
                            }
                            size="small"
                            sx={inputSx}
                            slotProps={{
                              paper: {
                                sx: {
                                  fontFamily: "Poppins, sans-serif",
                                  fontSize: "12px",
                                },
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select client"
                                size="small"
                              />
                            )}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            px: 2,
                            py: 1.2,
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <Autocomplete
                            disableClearable
                            options={projectOption}
                            getOptionLabel={(option) =>
                              `${option.ProjectName} - ${option.ProjectID}`
                            }
                            value={
                              projectOption.find(
                                (item) => item.ProjectID === row.ProjectID,
                              ) || null
                            }
                            onChange={(_, value) =>
                              handleChangeProjects(index, value)
                            }
                            size="small"
                            sx={inputSx}
                            slotProps={{
                              paper: {
                                sx: {
                                  fontFamily: "Poppins, sans-serif",
                                  fontSize: "12px",
                                },
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Projects"
                                size="small"
                              />
                            )}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            px: 2,
                            py: 1.2,
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          {/* <Autocomplete
                            key={index}
                            disableClearable
                            options={taskMasterList}
                            value={row.taskname || ""}
                            onChange={(_, value) => {
                              setRows((prev) =>
                                prev.map((item, i) =>
                                  i === index
                                    ? {
                                        ...item,
                                        taskname: value,
                                      }
                                    : item,
                                ),
                              );
                            }}
                            size='small'
                            sx={inputSx}
                            slotProps={{
                              paper: {
                                sx: {
                                  fontFamily: "Poppins, sans-serif",
                                  fontSize: "12px",
                                },
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder='Select Task'
                                size='small'
                              />
                            )}
                          /> */}

                          <Autocomplete
                            key={index}
                            disableClearable
                            options={taskMasterList}
                            value={
                              taskMasterList.find(
                                (item) => item.taskid === row.taskid,
                              ) || null
                            }
                            onChange={(_, value) =>
                              handleChangeTask(index, value)
                            }
                            getOptionLabel={(option) => `${option.taskname}`}
                            size="small"
                            sx={inputSx}
                            slotProps={{
                              paper: {
                                sx: {
                                  fontFamily: "Poppins, sans-serif",
                                  fontSize: "12px",
                                },
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Projects"
                                size="small"
                              />
                            )}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            px: 2,
                            py: 1.2,
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <TextField
                            fullWidth
                            multiline
                            size="small"
                            placeholder="What did you work on?"
                            value={row.workDescription}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "workDescription",
                                e.target.value,
                              )
                            }
                            sx={inputSx}
                          />
                        </TableCell>

                        <TableCell
                          sx={{
                            px: 2,
                            py: 1.2,
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            placeholder="0.0"
                            value={row.hoursWorked}
                            inputProps={{ min: 0, max: 24, step: 0.5 }}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "hoursWorked",
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value),
                              )
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
                          sx={{
                            px: 2,
                            py: 1.2,
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <Autocomplete
                            disableClearable
                            options={statusOptions}
                            value={row.status}
                            onChange={(_, v) =>
                              handleChange(index, "status", v)
                            }
                            size="small"
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
                                      ? {
                                          background: "#fffbeb",
                                          color: "#d97706",
                                        }
                                      : {
                                          background: "#f0fdf4",
                                          color: "#16a34a",
                                        }),
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
                                placeholder="Select status"
                                size="small"
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
                          sx={{
                            px: 2,
                            py: 1.2,
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <TextField
                            fullWidth
                            multiline
                            maxRows={3}
                            size="small"
                            placeholder={
                              isReasonRequired(row)
                                ? "Required — explain progress…"
                                : "Optional"
                            }
                            value={row.reason}
                            // disabled={!isReasonRequired(row)}
                            onChange={(e) =>
                              handleChange(index, "reason", e.target.value)
                            }
                            error={isReasonError(row)}
                            helperText={
                              isReasonError(row) ? "Reason is required" : ""
                            }
                            sx={inputSx}
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
                            size="small"
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
                            size="small"
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
                          sx={{
                            px: 3,
                            py: 1.5,
                            borderBottom: "1px solid #ede9fe",
                          }}
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
                                size="small"
                                type="number"
                                placeholder="0.0"
                                value={permissionHours}
                                inputProps={{ min: 0, max: 24, step: 0.5 }}
                                onChange={(e) => {
                                  setPermissionHours(Number(e.target.value));
                                }}
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
                                size="small"
                                placeholder="Enter reason for permission…"
                                value={permissionReason}
                                onChange={(e) => {
                                  setPermissionReason(e.target.value);
                                }}
                                error={isPermissionReasonError}
                                helperText={
                                  isPermissionReasonError
                                    ? "Reason is required"
                                    : ""
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
                    {rows
                      .reduce(
                        (sum, row) => sum + Number(row.hoursWorked || 0),
                        0,
                      )
                      .toFixed(1)}{" "}
                    hrs total hrs total
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
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSubmitted(false);
                      setShowPermission(false);
                      setPermissionHours("");
                      setPermissionReason("");
                      setRows([
                        {
                          clientId: null,
                          clientName: null,
                          projectId: "",
                          projectName: null,
                          taskname: null,
                          workDescription: "",
                          hoursWorked: "",
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
                      "&:hover": {
                        borderColor: "#c0c4cc",
                        background: "#f5f6f8",
                      },
                    }}
                  >
                    Clear all
                  </Button>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    {!isSubmitEnabled && (
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
                      variant="contained"
                      size="small"
                      disableElevation
                      onClick={handleSubmit}
                      disabled={!isSubmitEnabled}
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
                        "&.Mui-disabled": {
                          background: "#d1d5db",
                          color: "#9ca3af",
                        },
                      }}
                    >
                      Submit Timesheet
                    </Button>

                    {/* Apply Leave button */}
                    <Button
                      variant="contained"
                      size="small"
                      disableElevation
                      onClick={handleLeaveOpen}
                      disabled={rows.some(
                        (item) =>
                          item.timesheetId !== null &&
                          item.timesheetId !== undefined &&
                          item.timesheetId !== "",
                      )}
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
                      variant="contained"
                      size="small"
                      disableElevation
                      onClick={togglePermission}
                      startIcon={
                        <LockOutlinedIcon
                          sx={{ fontSize: "14px !important" }}
                        />
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
          )}

          {/* ── Apply Leave Modal ── */}
          <Dialog
            open={leaveModalOpen}
            onClose={handleLeaveClose}
            maxWidth="sm"
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
                size="small"
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
                    }}
                  >
                    <CheckCircleRoundedIcon
                      sx={{
                        fontSize: 28,
                        color: "#22c55e",
                      }}
                    />
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
                                component="span"
                                sx={{
                                  ml: 1,
                                  px: 0.8,
                                  py: 0.15,
                                  borderRadius: "4px",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  background: isSelected
                                    ? leave.color
                                    : "#e5e7eb",
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

                  <Box sx={{ mb: 2.5 }}>
                    <Tabs
                      value={dateType}
                      onChange={(e, newValue) => {
                        setDateType(newValue);

                        // Single Date select pannumbodhu
                        if (newValue === 0) {
                          setLeaveToDate(leaveFromDate);
                          setLeaveFromDate(
                            dayjs(props.passData?.workDate).format(
                              "YYYY-MM-DD",
                            ),
                          );
                          setLeaveToDate(
                            dayjs(props.passData?.workDate).format(
                              "YYYY-MM-DD",
                            ),
                          );
                        }
                      }}
                      sx={{
                        minHeight: 36,
                        mb: 2,
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#6366F1",
                          height: 3,
                          borderRadius: "3px",
                        },
                        "& .MuiTab-root": {
                          textTransform: "none",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          minHeight: 36,
                          color: "#6b7280",
                        },
                        "& .Mui-selected": {
                          color: "#6366F1 !important",
                        },
                      }}
                    >
                      <Tab label="Leave Date" />
                      <Tab label="Select Custom Leave Date" disabled />
                    </Tabs>

                    {dateType === 0 ? (
                      <Box>
                        {/* <Typography
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
                          Leave Date
                        </Typography> */}

                        <Typography
                          sx={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#111827",
                          }}
                        >
                          {dayjs(props.passData?.workDate).format(
                            "DD MMM YYYY",
                          )}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", gap: 2 }}>
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

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              value={
                                leaveFromDate ? dayjs(leaveFromDate) : null
                              }
                              format="DD-MM-YYYY"
                              minDate={dayjs()}
                              onChange={(newValue) =>
                                setLeaveFromDate(newValue)
                              }
                              slotProps={{
                                popper: {
                                  disablePortal: true,
                                },
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  sx: {
                                    "& .MuiInputBase-input": {
                                      fontSize: "14px",
                                      fontWeight: 500,
                                      fontFamily: "Poppins",
                                      padding: "10px 14px",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: "8px",
                                      backgroundColor: "#fff",
                                      "& fieldset": {
                                        borderColor: "#D1D5DB",
                                      },
                                      "&:hover fieldset": {
                                        borderColor: "#6366F1",
                                      },
                                      "&.Mui-focused fieldset": {
                                        borderColor: "#6366F1",
                                        borderWidth: "1.5px",
                                      },
                                    },
                                  },
                                },
                              }}
                            />
                          </LocalizationProvider>
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

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              value={leaveToDate ? dayjs(leaveToDate) : null}
                              format="DD-MM-YYYY"
                              minDate={
                                leaveFromDate ? dayjs(leaveFromDate) : dayjs()
                              }
                              onChange={(newValue) => setLeaveToDate(newValue)}
                              slotProps={{
                                popper: {
                                  disablePortal: true,
                                },
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                  sx: {
                                    "& .MuiInputBase-input": {
                                      fontSize: "14px",
                                      fontWeight: 500,
                                      fontFamily: "Poppins",
                                      padding: "10px 14px",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: "8px",
                                      backgroundColor: "#fff",
                                      "& fieldset": {
                                        borderColor: "#D1D5DB",
                                      },
                                      "&:hover fieldset": {
                                        borderColor: "#6366F1",
                                      },
                                      "&.Mui-focused fieldset": {
                                        borderColor: "#6366F1",
                                        borderWidth: "1.5px",
                                      },
                                    },
                                  },
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </Box>
                      </Box>
                    )}
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
                      size="small"
                      placeholder="Brief reason for your leave…"
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
                  variant="outlined"
                  size="small"
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
                    "&:hover": {
                      borderColor: "#c0c4cc",
                      background: "#f5f6f8",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
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
      )}
    </>
  );
}

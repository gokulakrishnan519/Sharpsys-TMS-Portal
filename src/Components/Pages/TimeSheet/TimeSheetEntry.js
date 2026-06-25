import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Modal,
  IconButton,
  Paper,
  Avatar,
  Button,
  TextField,
  DialogActions,
  Tab,
  DialogTitle,
  Dialog,
  Tabs,
  Divider,
  DialogContent,
} from "@mui/material";
import dayjs from "dayjs";
import Navbar from "../../../Navbars/Navbar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import UserEntry from "./Modal/UserEntry";
import axios from "axios";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CloseIcon from "@mui/icons-material/Close";
import MoneyOffOutlinedIcon from "@mui/icons-material/MoneyOffOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";

// ── constants ────────────────────────────────────────────────────────────────

const FONT = "'Poppins', sans-serif";
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CHIP = {
  Timesheet: { bg: "#E6F1FB", color: "#0C447C", dot: "#185FA5" },
  Permission: { bg: "#FAEEDA", color: "#633806", dot: "#BA7517" },
  Leave: { bg: "#FCEBEB", color: "#791F1F", dot: "#A32D2D" },
  default: { bg: "#EEEDFE", color: "#3C3489", dot: "#534AB7" },
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: "Poppins, sans-serif",
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
    fontFamily: "Poppins, sans-serif",
  },
};

const errorInputSx = {
  "& .MuiOutlinedInput-root": {
    fontFamily: "Poppins, sans-serif",
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
    fontFamily: "Poppins, sans-serif",
  },
};

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

// ── helpers ──────────────────────────────────────────────────────────────────

function buildCalendar(apiData) {
  const firstDay = dayjs(`${apiData.year}-${apiData.month}-01`).day();
  const calendar = [];
  let week = [];

  for (let i = 0; i < firstDay; i++) week.push(null);

  apiData.days.forEach((item) => {
    week.push(item);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  });

  while (week.length > 0 && week.length < 7) week.push(null);
  if (week.length) calendar.push(week);

  return calendar;
}

function computeSummary(days) {
  let present = 0,
    leaves = 0,
    totalHours = 0;

  days.forEach(({ entries }) => {
    if (!entries.length) return;

    const hasLeave = entries.some((e) => e.requestType === "Leave");
    const hasTimesheet = entries.some((e) => e.requestType === "Timesheet");

    if (hasLeave) leaves++;
    else if (hasTimesheet) present++;

    entries.forEach((e) => {
      if (e.hours) totalHours += e.hours;
    });
  });

  return { present, leaves, totalHours };
}

// ── SummaryCard ──────────────────────────────────────────────────────────────

function SummaryCard({ icon, label, value, color, sub }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 130,
        display: "flex",
        alignItems: "center",
        gap: 2,
        bgcolor: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: "18px",
        px: 3,
        py: 2.2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <Avatar
        sx={{
          width: 38,
          height: 38,
          bgcolor: `${color}18`,
          borderRadius: "10px",
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: "1.1rem", color } })}
      </Avatar>
      <Box>
        <Typography
          sx={{
            fontSize: "0.62rem",
            fontFamily: FONT,
            color: "#94A3B8",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.4 }}>
          <Typography
            sx={{
              fontSize: "1.35rem",
              fontFamily: FONT,
              fontWeight: 700,
              color: "#0F172A",
              lineHeight: 1.2,
            }}
          >
            {value}
          </Typography>
          {sub && (
            <Typography
              sx={{ fontSize: "0.62rem", fontFamily: FONT, color: "#94A3B8" }}
            >
              {sub}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ── DayCell ──────────────────────────────────────────────────────────────────

function DayCell({ cell, isToday, isWeekend, onClick }) {
  if (!cell) {
    return (
      <TableCell
        sx={{
          height: 108,
          border: "1px solid #F1F5F9",
          bgcolor: "#FAFBFC",
          p: 0,
        }}
      />
    );
  }

  const entries = cell.entries ?? [];
  const shown = entries.slice(0, 2);
  const extra = entries.length - 2;

  console.log(cell?.workDate);

  const isFutureDate = dayjs(cell?.workDate).isAfter(dayjs(), "day");

  return (
    <TableCell
      onClick={!isFutureDate ? onClick : undefined}
      sx={{
        height: 108,
        border: "1px solid #F1F5F9",
        verticalAlign: "top",
        cursor: cell.entries[0]?.requestType == "Leave" ? "" : "pointer",
        p: "8px",
        bgcolor: isWeekend ? "#FAFBFC" : "#fff",
        position: "relative",
        transition: "background 0.15s",
        "&:hover": { bgcolor: "#F8FAFF", "& .add-hint": { opacity: 1 } },
      }}
    >
      {/* Today accent */}
      {isToday && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            bgcolor: "#6366F1",
          }}
        />
      )}

      {/* Day number */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: "4px" }}>
        <Box
          sx={{
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            bgcolor: isToday ? "#6366F1" : "transparent",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontFamily: FONT,
              fontWeight: isToday ? 700 : 500,
              color: isToday ? "#fff" : isWeekend ? "#CBD5E1" : "#94A3B8",
            }}
          >
            {cell.day}
          </Typography>
        </Box>
      </Box>

      {/* Entry chips */}
      {shown.map((entry) => {
        const cfg = CHIP[entry.requestType] ?? CHIP.default;
        const label = entry.project || entry.requestType;

        return (
          <Box
            key={entry.id}
            sx={{
              mb: "3px",
              px: "6px",
              py: "3px",
              bgcolor: cfg.bg,
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                bgcolor: cfg.dot,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontSize: "0.62rem",
                fontFamily: FONT,
                fontWeight: 600,
                color: cfg.color,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {label}
            </Typography>
            {entry.hours > 0 && (
              <Typography
                sx={{
                  fontSize: "0.57rem",
                  fontFamily: FONT,
                  color: cfg.color,
                  opacity: 0.7,
                  ml: "auto",
                  flexShrink: 0,
                }}
              >
                {entry.hours}h
              </Typography>
            )}
          </Box>
        );
      })}

      {extra > 0 && (
        <Typography
          sx={{
            fontSize: "0.58rem",
            fontFamily: FONT,
            color: "#94A3B8",
            pl: "2px",
          }}
        >
          +{extra} more
        </Typography>
      )}

      {/* Hover hint */}
      {!entries.length && !isWeekend && (
        <Typography
          className="add-hint"
          sx={{
            fontSize: "0.6rem",
            fontFamily: FONT,
            color: "#CBD5E1",
            opacity: 0,
            transition: "opacity 0.15s",
            mt: 0.5,
          }}
        >
          + Add entry
        </Typography>
      )}
    </TableCell>
  );
}

// ── main ─────────────────────────────────────────────────────────────────────

export default function TimeSheetEntry() {
  const today = dayjs();
  const [selectionDate, setSelectionDate] = useState(dayjs());
  const [open1, setOpen1] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [calendarRows, setCalendarRows] = useState([]);
  const [summary, setSummary] = useState({
    present: 0,
    leaves: 0,
    totalHours: 0,
  });
  const [loading, setLoading] = useState(false);
  const [passData, setPassData] = useState(null);

  // Leave Modal State

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveFromDate, setLeaveFromDate] = useState(
    dayjs().format("YYYY-MM-DD"),
  );
  const [leaveToDate, setLeaveToDate] = useState(dayjs().format("YYYY-MM-DD"));

  const [leaveSubmitError, setLeaveSubmitError] = useState(false);
  const [leaveSuccess, setLeaveSuccess] = useState(null);

  const fetchTimesheet = () => {
    setLoading(true);
    axios
      .post("http://10.10.0.108:8000/timesheet/calendar", {
        year: selectionDate.year(),
        month: selectionDate.format("MM"),
        employeeId: sessionStorage.getItem("employeeId"),
      })
      .then((res) => {
        setCalendarRows(buildCalendar(res.data));
        setSummary(computeSummary(res.data.days));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTimesheet();
  }, [selectionDate]);

  const handleDayClick = (cell) => {
    if (!cell) return;
    if (cell.entries[0]?.requestType == "Leave") {
      return;
    }

    console.log(cell);

    setSelectedDay(cell);
    setPassData(cell);
    setOpen1(true);
  };

  const handleLeaveOpen = () => {
    setSelectedLeaveType("");
    setLeaveReason("");
    // setLeaveFromDate(dayjs(props.passData?.workDate).format("YYYY-MM-DD"));
    // setLeaveToDate(dayjs(props.passData?.workDate).format("YYYY-MM-DD"));
    setLeaveSubmitError(false);
    setLeaveSuccess(null);
    setLeaveModalOpen(true);
    // setPermissionHours("");
    // setPermissionReason("");
    // setShowPermission(false);
  };

  const handleLeaveClose = () => {
    setLeaveModalOpen(false);
    fetchTimesheet();
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
        // workDate: props.passData.workDate,
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

  return (
    <Navbar>
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2.5,
          bgcolor: "#F1F5F9",
          minHeight: "100vh",
        }}
      >
        {/* ── Header ── */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2.5,
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: 700,
                fontFamily: FONT,
                color: "#0F172A",
              }}
            >
              {selectionDate.format("MMMM YYYY")}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.72rem",
                fontFamily: FONT,
                color: "#94A3B8",
                mt: 0.2,
              }}
            >
              Timesheet · {selectionDate.format("YYYY")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Button
              variant="contained"
              size="small"
              disableElevation
              onClick={handleLeaveOpen}
              // disabled={rows.some(
              //   (item) =>
              //     item.timesheetId !== null &&
              //     item.timesheetId !== undefined &&
              //     item.timesheetId !== "",
              // )}
              sx={{
                fontFamily: "Poppins, sans-serif",
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
            <IconButton
              size="small"
              onClick={() => setSelectionDate((d) => d.subtract(1, "month"))}
              sx={{
                border: "1.5px solid #E2E8F0",
                borderRadius: "9px",
                width: 32,
                height: 32,
                "&:hover": { bgcolor: "#F1F5F9" },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: "1rem", color: "#64748B" }} />
            </IconButton>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year", "month"]}
                format="YYYY-MM"
                value={selectionDate}
                onChange={(d) => d && setSelectionDate(d)}
                slotProps={{ textField: { size: "small" } }}
                sx={{
                  width: 130,
                  "& .MuiOutlinedInput-root": {
                    height: "32px !important",
                    borderRadius: "9px",
                    fontFamily: FONT,
                    bgcolor: "#fff",
                    "& fieldset": {
                      borderColor: "#E2E8F0",
                      borderWidth: "1.5px",
                    },
                    "&:hover fieldset": { borderColor: "#6366F1" },
                  },
                  "& .MuiInputBase-input": {
                    padding: "4px 6px !important",
                    fontSize: "0.72rem",
                    fontFamily: FONT,
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: "1.1rem",
                    color: "#64748B",
                  },
                }}
              />
            </LocalizationProvider>

            <IconButton
              size="small"
              onClick={() => setSelectionDate((d) => d.add(1, "month"))}
              sx={{
                border: "1.5px solid #E2E8F0",
                borderRadius: "9px",
                width: 32,
                height: 32,
                "&:hover": { bgcolor: "#F1F5F9" },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: "1rem", color: "#64748B" }} />
            </IconButton>
          </Box>
        </Box>

        {/* ── Summary Cards ── */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
          <SummaryCard
            icon={<BusinessCenterIcon />}
            label="Present"
            value={summary.present}
            color="#22C55E"
          />
          <SummaryCard
            icon={<BeachAccessOutlinedIcon />}
            label="Leaves"
            value={summary.leaves}
            color="#F97316"
          />
          <SummaryCard
            icon={<AccessTimeIcon />}
            label="Total Hours"
            value={summary.totalHours}
            color="#0EA5E9"
            sub="hrs"
          />
        </Box>

        {/* ── Calendar ── */}
        <Paper
          elevation={0}
          sx={{
            border: "1.5px solid #F1F5F9",
            borderRadius: "16px",
            overflow: "hidden",
            bgcolor: "#fff",
          }}
        >
          {loading && (
            <Box
              sx={{
                height: 3,
                bgcolor: "#6366F1",
                animation: "pulse 1s infinite",
              }}
            />
          )}

          <Table
            sx={{
              borderCollapse: "collapse",
              tableLayout: "fixed",
              width: "100%",
            }}
          >
            <TableHead>
              <TableRow>
                {WEEK_DAYS.map((day, i) => (
                  <TableCell
                    key={day}
                    align="center"
                    sx={{
                      fontFamily: FONT,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      color: i === 0 || i === 6 ? "#CBD5E1" : "#64748B",
                      bgcolor: "#FAFBFC",
                      border: "1px solid #F1F5F9",
                      py: 1.2,
                    }}
                  >
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {calendarRows.map((week, wi) => (
                <TableRow key={wi}>
                  {week.map((cell, ci) => {
                    const isToday =
                      cell &&
                      today.date() === cell.day &&
                      today.month() === selectionDate.month() &&
                      today.year() === selectionDate.year();
                    const isWeekend = ci === 0 || ci === 6;

                    return (
                      <DayCell
                        key={ci}
                        cell={cell}
                        isToday={isToday}
                        isWeekend={isWeekend}
                        onClick={() => handleDayClick(cell)}
                      />
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* ── Legend ── */}
        <Box sx={{ display: "flex", gap: 2.5, mt: 1.5, flexWrap: "wrap" }}>
          {Object.entries(CHIP)
            .filter(([k]) => k !== "default")
            .map(([label, cfg]) => (
              <Box
                key={label}
                sx={{ display: "flex", alignItems: "center", gap: 0.6 }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor: cfg.dot,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.68rem",
                    fontFamily: FONT,
                    color: "#94A3B8",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            ))}
        </Box>

        {/* ── Modal ── */}
        <Modal open={open1} onClose={() => setOpen1(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "99%",
              bgcolor: "#fff",
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
              outline: "none",
            }}
          >
            <Box sx={{ position: "absolute", top: 10, right: 10 }}>
              <IconButton
                size="small"
                onClick={() => {
                  setOpen1(false);
                  fetchTimesheet();
                }}
                sx={{
                  bgcolor: "#F1F5F9",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: "9px",
                  width: 32,
                  height: 32,
                  "&:hover": { bgcolor: "#E2E8F0" },
                }}
              >
                <CloseOutlinedIcon
                  sx={{ fontSize: "1rem", color: "#64748B" }}
                />
              </IconButton>
            </Box>
            <Box sx={{ p: 4.7 }}>
              <UserEntry
                day={selectedDay}
                onClose={() => setOpen1(false)}
                passData={passData}
              />
            </Box>
          </Box>
        </Modal>

        {/* ── Apply Leave Modal ── */}
        <Dialog
          open={leaveModalOpen}
          // onClose={handleLeaveClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            elevation: 0,
            sx: {
              borderRadius: "16px",
              border: "1px solid #e8eaed",
              fontFamily: "Poppins, sans-serif",
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
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Apply Leave
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins, sans-serif",
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
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "15px",
                    fontWeight: 600,
                    color: "#16a34a",
                  }}
                >
                  Leave Applied Successfully!
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Poppins, sans-serif",
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
                    fontFamily: "Poppins, sans-serif",
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
                              fontFamily: "Poppins, sans-serif",
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
                              fontFamily: "Poppins, sans-serif",
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
                      fontFamily: "Poppins, sans-serif",
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
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: "Poppins, sans-serif",
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
                          value={leaveFromDate ? dayjs(leaveFromDate) : null}
                          format="DD-MM-YYYY"
                          minDate={dayjs()}
                          onChange={(newValue) => {
                            setLeaveFromDate(newValue);
                            setLeaveToDate(null);
                          }}
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
                          fontFamily: "Poppins, sans-serif",
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
                          onChange={(newValue) => {
                            setLeaveToDate(newValue);
                          }}
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
                </Box>

                {/* Reason */}
                <Box sx={{ mb: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: "Poppins, sans-serif",
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
                  fontFamily: "Poppins, sans-serif",
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
                  fontFamily: "Poppins, sans-serif",
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
    </Navbar>
  );
}
